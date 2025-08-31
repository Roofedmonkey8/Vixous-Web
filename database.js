const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./player_skins.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS skins (
            uuid TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            image_path TEXT NOT NULL,
            last_updated INTEGER NOT NULL
        )
    `);
});

module.exports = db;