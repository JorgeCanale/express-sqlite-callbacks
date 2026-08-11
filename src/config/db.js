const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./products.db');



db.serialize(()=>{
    db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT UNIQUE, price REAL)');
});

module.exports = db;
