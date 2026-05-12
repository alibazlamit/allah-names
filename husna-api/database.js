const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'data', 'husna.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      swore_oath INTEGER NOT NULL CHECK(swore_oath IN (0, 1)),
      user_uuid TEXT,
      time_taken INTEGER,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      } else {
        console.log('Leaderboard table ready.');
        // Add columns if they don't exist (for existing databases)
        db.run('ALTER TABLE leaderboard ADD COLUMN user_uuid TEXT', (err) => {});
        db.run('ALTER TABLE leaderboard ADD COLUMN time_taken INTEGER', (err) => {});
        
        // Add indexes for performance
        db.run('CREATE INDEX IF NOT EXISTS idx_leaderboard_country ON leaderboard(country)');
        db.run('CREATE INDEX IF NOT EXISTS idx_leaderboard_time_taken ON leaderboard(time_taken)');
        db.run('CREATE INDEX IF NOT EXISTS idx_leaderboard_user_uuid ON leaderboard(user_uuid)');

        // Quiz leaderboard table
        db.run(`CREATE TABLE IF NOT EXISTS quiz_leaderboard (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          country TEXT NOT NULL,
          user_uuid TEXT,
          score INTEGER NOT NULL,
          time_taken INTEGER,
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (!err) {
            db.run('CREATE INDEX IF NOT EXISTS idx_quiz_score ON quiz_leaderboard(score)');
            db.run('CREATE INDEX IF NOT EXISTS idx_quiz_time ON quiz_leaderboard(time_taken)');
            console.log('Quiz leaderboard table ready.');
          }
        });
      }
    });
  }
});

module.exports = db;
