const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const cors = require('cors');
const moment = require('moment');
//const bodyParser = require('body-parser');
//const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

//app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Serve static files from the "public" directory
//app.use(express.static('public'));

// Connect to SQLite database using Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mydatabase.db',
    logging: (msg) => console.log(msg)   // Print SQL commands
});

/*
// Connect to the database
let db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});
*/


// Define User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATEONLY,  // Use DATEONLY to store only the date part
        allowNull: false
    },
    occupation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    premium_user: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
});


/*
// TÄMÄ TARVITTIIN SQLITEÄ KÄYTETTÄESSÄ, NYT sequelize.sync() korvaa tämän
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
*/

// Synchronize database
sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Error synchronizing database:", err));


/* 
VANHAN KOODIN TAPA LISÄTÄ
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
 */

// Create a new user (Create)
app.post('/users', async (req, res) => {
    try {
        const { username, birth_date, occupation, premium_user } = req.body;
        if ( !username || !birth_date ) {
            return res.status(400).json({error: 'Username and birth date are required' });
        }

        // Format date structure
        const birthDate = moment(birth_date).format('YYYY-MM-DD');

        // Set default value for premium_user
        const isPremiumUser = premium_user ? true : false;

        const user = await User.create({ 
            username, 
            birth_date: birthDate, 
            occupation, 
            premium_user: isPremiumUser
        });
        res.status(201).json(username);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* KÄYTTÄJIEN TIETOJEN HAKU SQLITE3:LLA
// Endpoint to get all users
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ users: rows });
    });
});
*/

// Endpoint to get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 
VANHA SQLITE3 TYYLIN KÄYTTÄJÄN PÄIVITYS ILMAN REACT FRONTENDIÄ
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
 */

// Update user information (Update)
app.put('/users/:id', async (req, res) => {
    try {
        const { username, birth_date, occupation, premium_user } = req.body;
        const { id } = req.params;
        if (!username || !birth_date) {
            return res.status(400).json({ error: 'Username and birth date are required' });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ error: 'User not found'} )
        }
        user.username = username;
        user.birth_date = birth_date;
        await user.save();
        res.json({ message: 'User information updated', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* 
SQLITE3 TYYLIN DELETE TOIMINTO
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
 */

// Delete user (Delete)
app.delete('/users/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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