const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage
let userData = {
  name: null,
  version: 0
};

app.post('/user', (req, res) => {
    const { name, version } = req.body;
    if (name && version !== undefined) {
        if (version > userData.version) {
            userData.name = name;
            userData.version = version;
            return res.status(200).json({ message: "User data updated", data: userData });
        } else {
            return res.status(400).json({ error: "A newer version exists. Please update the version number." });
        }
    } else {
        return res.status(400).json({ error: "Both name and version are required" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

