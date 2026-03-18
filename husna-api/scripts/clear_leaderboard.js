const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'data', 'husna.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
  
  console.log('Connected to the SQLite database.');
  
  db.run('DELETE FROM leaderboard', function(err) {
    if (err) {
      console.error('Error clearing leaderboard:', err.message);
      process.exit(1);
    }
    console.log(`Successfully cleared leaderboard. Rows affected: ${this.changes}`);
    
    // Vacuum to shrink file size
    db.run('VACUUM', (err) => {
      if (err) console.error('Error vacuuming database:', err.message);
      else console.log('Database vacuumed.');
      db.close();
    });
  });
});
