const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const NodeRSA = require('node-rsa');

const app = express();
const port = 3000;

// Use bodyParser to parse application/x-www-form-urlencoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Load the public key from file
const publicKey = fs.readFileSync('public_key.pem', 'utf8');
const key = new NodeRSA();
key.importKey(publicKey, 'public');

app.post('/user', (req, res) => {
    let { name, signature } = req.body;

    if (!name || !signature) {
        return res.status(400).send('Missing name or signature.');
    }

    // Correcting URL-decoded Base64 signature: replace spaces with plus signs
    signature = signature.replace(/\s/g, '+');

    // Verify the signature
    const isVerified = key.verify(
        name, 
        Buffer.from(signature, 'base64'), 
        'utf8', 
        'base64'
    );

    if (!isVerified) {
        return res.status(401).send('Invalid signature.');
    }

    res.send(`Name ${name} has been securely stored.`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

