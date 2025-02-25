const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

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
    username VARCHAR UNIQUE,
    birth_date DATE,
    occupation TEXT,
    premium_user BOOLEAN
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Table created or already exists.');
});

// Endpoint to add a new user
app.post('/add-user', (req, res) => {
    const { username, birth_date, occupation, premium_user } = req.body;
    db.run(`INSERT INTO users (username, birth_date, occupation, premium_user) VALUES (?, ?, ?, ?)`, [username, birth_date, occupation, premium_user], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `A row has been inserted with rowid ${this.lastID}` });
    });
});

// Endpoint to get all users
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ users: rows });
    });
});

// Endpoint to update a user
app.put('/update-user/:id', (req, res) => {
    const { id } = req.params;
    const { username, birth_date, occupation, premium_user } = req.body;
    db.run(`UPDATE users SET username = ?, birth_date = ?, occupation = ?, premium_user = ? WHERE id = ?`, [username, birth_date, occupation, premium_user, id], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Row(s) updated: ${this.changes}` });
    });
});

// Endpoint to delete a user
app.delete('/delete-user/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Row(s) deleted: ${this.changes}` });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Close the database connection when the process ends
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});