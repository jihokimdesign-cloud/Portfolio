const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files — serve from public/ and project root (for landingimgs/, Sub_proj/, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/tap3d-case-study', (req, res) => {
  res.sendFile(path.join(__dirname, 'tap3d-case-study.html'));
});

app.get('/proxiplay-case-study', (req, res) => {
  res.sendFile(path.join(__dirname, 'proxiplay-case-study.html'));
});

app.get('/myjournal-case-study', (req, res) => {
  res.sendFile(path.join(__dirname, 'myjournal-case-study.html'));
});

app.get('/sidewalk-case-study', (req, res) => {
  res.sendFile(path.join(__dirname, 'sidewalk-case-study.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
