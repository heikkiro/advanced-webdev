// koodi tehty Copilot tekoälyn avulla

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Aseta staattinen hakemisto
app.use(express.static(path.join(__dirname)));

// Palvele index.html (toimisi ilmankin yksinkertaisimmillaan)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});