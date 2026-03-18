const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3005;

// Trust the reverse proxy (e.g. Nginx) so rate limiter gets the real IP
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size

// Global rate limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Stricter rate limiter for HoF submissions
const submissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 submissions per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many submissions from this IP. Please try again later.' }
});

const crypto = require('crypto');

// Secret for HMAC (should be set in env on server)
const API_SECRET = process.env.API_SECRET || 'husna-secret-key-2026';

app.use(globalLimiter);

// Get Leaderboard stats
app.get('/api/leaderboard', (req, res) => {
    const { type } = req.query;

    if (type === 'names') {
        // Top 20 fastest memorizers
        const sql = `
            SELECT name, country, time_taken, completed_at
            FROM leaderboard 
            WHERE swore_oath = 1 AND time_taken IS NOT NULL
            ORDER BY time_taken ASC, completed_at ASC
            LIMIT 20
        `;
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ data: rows });
        });
    } else {
        // Grouped by country
        const sql = `
            SELECT country, COUNT(id) as count 
            FROM leaderboard 
            WHERE swore_oath = 1 
            GROUP BY country 
            ORDER BY count DESC, country ASC
        `;
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ data: rows });
        });
    }
});

// Get specific user rank
app.get('/api/leaderboard/rank/:uuid', (req, res) => {
    const { uuid } = req.params;
    
    // 1. Get user's time
    const userSql = 'SELECT time_taken, name, country FROM leaderboard WHERE user_uuid = ? LIMIT 1';
    db.get(userSql, [uuid], (err, user) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!user || user.time_taken === null) return res.json({ rank: null });

        // 2. Count how many are faster
        const rankSql = 'SELECT COUNT(*) as count FROM leaderboard WHERE swore_oath = 1 AND time_taken < ?';
        db.get(rankSql, [user.time_taken], (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ 
                rank: result.count + 1,
                user: user
            });
        });
    });
});

// Submit completion and oath
app.post('/api/leaderboard', submissionLimiter, (req, res) => {
    let { name, country, sworeOath, user_uuid, time_taken } = req.body;
    const signature = req.headers['x-husna-signature'];
    const timestamp = req.headers['x-husna-timestamp'];
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`[Submission] IP: ${clientIp}, Name: ${name}, Country: ${country}, Time: ${time_taken}`);

    // 1. Validation Logic
    if (typeof name !== 'string' || typeof country !== 'string' || !sworeOath) {
        return res.status(400).json({ error: 'Invalid submission data.' });
    }

    // 2. HMAC Signature Verification
    if (!signature || !timestamp) {
        console.warn(`[Security Alert] Missing signature/timestamp from IP: ${clientIp}`);
        return res.status(401).json({ error: 'Security verification failed.' });
    }

    // Replay attack protection (5 minute window)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 300) {
        return res.status(401).json({ error: 'Request expired.' });
    }

    const payload = `${timestamp}${name}${country}${time_taken || ''}`;
    const expectedSignature = crypto.createHmac('sha256', API_SECRET).update(payload).digest('hex');

    if (signature !== expectedSignature) {
        console.warn(`[Security Alert] Invalid signature from IP: ${clientIp}. Expected: ${expectedSignature.substring(0,8)}... Got: ${signature.substring(0,8)}...`);
        return res.status(401).json({ error: 'Signature mismatch.' });
    }

    name = name.trim();
    country = country.trim();

    if (name.length === 0 || name.length > 50) return res.status(400).json({ error: 'Invalid name.' });

    // 3. Database Operations
    const sql = 'INSERT INTO leaderboard (name, country, swore_oath, user_uuid, time_taken) VALUES (?, ?, ?, ?, ?)';
    const params = [name, country, 1, user_uuid, time_taken];
    
    db.run(sql, params, function (err) {
        if (err) {
            console.error(`[Database Error] ${err.message}`);
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'Successfully added to leaderboard',
            data: { id: this.lastID, rank_check_url: `/api/leaderboard/rank/${user_uuid}` }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
