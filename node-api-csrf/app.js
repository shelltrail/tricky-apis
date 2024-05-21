const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());  // Middleware to parse JSON bodies

// In-memory "database"
const users = [];

// CSRF tokens store
const csrfTokens = new Map();

// Middleware to check CSRF token
function checkCsrfToken(req, res, next) {
    const csrfToken = req.headers['csrf-token'];

    if (!csrfToken || !csrfTokens.has(csrfToken)) {
        const newToken = uuidv4();
        csrfTokens.set(newToken, true);
        res.setHeader('CSRF-Token', newToken); // Provide a valid CSRF token in response header
        return res.status(403).json({ error: "Invalid CSRF token" });
    }

    // CSRF token is valid, let's remove it and proceed
    csrfTokens.delete(csrfToken);
    next();
}


// Route to add a user
app.post('/user', checkCsrfToken, (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    users.push(name);  // Storing the name in "database"
    const newToken = uuidv4();
    csrfTokens.set(newToken, true);
    res.setHeader('CSRF-Token', newToken); // Provide a valid CSRF token in response header
    res.status(201).send('User added');
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

