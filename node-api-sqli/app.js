const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Initialize the in-memory SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create a users table and insert some sample data
db.serialize(() => {
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
    db.run("INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie')");
});

// Middleware to decode base64 and URL encoding
app.use((req, res, next) => {
    if (req.method === 'POST') {
        if (typeof req.body.data === 'string') {
            try {
                let decodedData = decodeURIComponent(Buffer.from(req.body.data, 'base64').toString('ascii'));
                req.decodedInput = decodedData;
                next();
            } catch (e) {
                res.status(400).send('Invalid input. Please ensure your input is base64 and URL encoded.');
            }
        } else {
            res.status(400).send('Invalid input format.');
        }
    } else {
        next();
    }
});

// Vulnerable SQL route
app.post('/search', (req, res) => {
    let query = `SELECT * FROM users WHERE name = '${req.decodedInput}'`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error executing SQL query.');
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


