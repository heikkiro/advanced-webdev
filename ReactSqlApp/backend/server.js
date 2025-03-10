const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const cors = require('cors');
const moment = require('moment');

const app = express();
const port = 3000;

//app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database using Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mydatabase.db',
    logging: (msg) => console.log(msg)   // Print SQL commands
});

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

// Synchronize database
sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Error synchronizing database:", err));

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
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user information (Update)
app.put('/users/:id', async (req, res) => {
    try {
        const { username, birth_date, occupation, premium_user } = req.body;
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ error: 'User not found'} )
        }
        if (username !== undefined && username !=="") user.username = username;
        if (birth_date !== undefined && birth_date!=="") user.birth_date = birth_date;
        if (occupation !== undefined && occupation!=="") user.occupation = occupation;

        if (premium_user !== undefined) {
            user.premium_user = premium_user;
        } else {
            user.premium_user = user.premium_user; // keep the current value
        }
        
        await user.save();
        res.json({ message: 'User information updated', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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