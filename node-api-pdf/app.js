// mkdir $HOME/node-user-pdf
// cd $HOME/node-user-pdf
// npm init -y
// npm install express body-parser puppeteer uuid

const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Store HTML content indexed by UUID
const htmlStore = {};

// Middleware to check API key
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey !== '1d8e71ab-8e46-47aa-b25c-a3c8c83b0360') {
    return res.status(403).json({ message: 'Forbidden: Incorrect API key' });
  }
  next();
};

app.use(bodyParser.text({ type: 'text/html' }));

// Insert endpoint
app.post('/insert', apiKeyMiddleware, (req, res) => {
  const uuid = uuidv4();
  htmlStore[uuid] = req.body;  // Store HTML content in the map with UUID as key
  res.status(200).json({ uuid: uuid });  // Return UUID to the client
});

// Generate endpoint
app.get('/generate/:uuid', apiKeyMiddleware, async (req, res) => {
  const { uuid } = req.params;
  const htmlContent = htmlStore[uuid];

  if (!htmlContent) {
    return res.status(404).json({ message: 'No HTML content found for this UUID' });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();
  res.contentType('application/pdf');
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

