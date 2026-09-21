const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./products.db');



db.serialize(()=>{
    db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT UNIQUE, price REAL)');
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, user TEXT UNIQUE, email TEXT UNIQUE, password TEXT, uid TEXT UNIQUE)');
});

module.exports = db;
