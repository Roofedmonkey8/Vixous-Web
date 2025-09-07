const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./player_data.db');

db.serialize(() => {
    //this stores the username and uuid of players after fetched from geyser api
    db.run(`
        CREATE TABLE IF NOT EXISTS players (
            username TEXT PRIMARY KEY,
            uuid TEXT NOT NULL,
            last_checked INTEGER NOT NULL
        )
    `);

    //this db stores all of our player skins
    db.run(`
        CREATE TABLE IF NOT EXISTS skins (
            uuid TEXT PRIMARY KEY,
            image_path TEXT NOT NULL,
            last_updated INTEGER NOT NULL
        )
    `);

    //stores the leaderboard data 
    // db.run(`
    //     CREATE TABLE IF NOT EXISTS baltop (
            
    //     )
    // `);

    // db.run(`
    //     CREATE TABLE IF NOT EXISTS playtop (
            
    //     )
    // `);

    // db.run(`
    //     CREATE TABLE IF NOT EXISTS leveltop (
            
    //     )
    // `);
});

module.exports = db;