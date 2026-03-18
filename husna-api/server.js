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

app.use(globalLimiter);

// Get Leaderboard stats grouped by country
app.get('/api/leaderboard', (req, res) => {
    const sql = `
    SELECT country, COUNT(id) as count 
    FROM leaderboard 
    WHERE swore_oath = 1 
    GROUP BY country 
    ORDER BY count DESC, country ASC
  `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Submit completion and oath
app.post('/api/leaderboard', submissionLimiter, (req, res) => {
    let { name, country, sworeOath } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`[Submission] Attempt from IP: ${clientIp}, Name: ${name}, Country: ${country}, SworeOath: ${sworeOath}`);

    // Type checking and validation
    if (typeof name !== 'string' || typeof country !== 'string') {
        console.warn(`[Submission Error] Invalid types: name=${typeof name}, country=${typeof country}`);
        return res.status(400).json({ error: 'Invalid submission data. Name and country must be strings.' });
    }

    if (!sworeOath) {
        console.warn(`[Submission Error] Oath not sworn: ${sworeOath}`);
        return res.status(400).json({ error: 'You must swear the oath to proceed.' });
    }

    name = name.trim();
    country = country.trim();

    // Length validation
    if (name.length === 0 || name.length > 50) {
        console.warn(`[Submission Error] Name length invalid: ${name.length}`);
        return res.status(400).json({ error: 'Name must be between 1 and 50 characters.' });
    }

    if (country.length === 0 || country.length > 50) {
        console.warn(`[Submission Error] Country length invalid: ${country.length}`);
        return res.status(400).json({ error: 'Country must be between 1 and 50 characters.' });
    }

    const sql = 'INSERT INTO leaderboard (name, country, swore_oath) VALUES (?, ?, ?)';
    const params = [name, country, 1];
    
    db.run(sql, params, function (err) {
        if (err) {
            console.error(`[Database Error] ${err.message}`);
            res.status(400).json({ error: err.message });
            return;
        }
        console.log(`[Submission Success] ID: ${this.lastID}, Name: ${name}, Country: ${country}`);
        res.json({
            message: 'Successfully added to leaderboard',
            data: { id: this.lastID, name, country }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
