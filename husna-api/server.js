const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

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
app.post('/api/leaderboard', (req, res) => {
    const { name, country, sworeOath } = req.body;
    if (!name || !country || sworeOath !== true) {
        return res.status(400).json({ error: 'Invalid submission data. Oath is required.' });
    }

    const sql = 'INSERT INTO leaderboard (name, country, swore_oath) VALUES (?, ?, ?)';
    const params = [name, country, 1];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Successfully added to leaderboard',
            data: { id: this.lastID, name, country }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
