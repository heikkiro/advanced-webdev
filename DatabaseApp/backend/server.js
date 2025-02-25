const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create a table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    birth_date TEXT,
    email TEXT UNIQUE
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Table created or already exists.');

    // Insert a record
    db.run(`INSERT INTO users (name, birth_date, email) VALUES (?, ?, ?)`, ['John Doe', '1990-01-01', 'john.doe@example.com'], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
});