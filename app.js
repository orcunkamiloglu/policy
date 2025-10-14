const express = require('express');
const path = require('path');
const { insertRecord, getAllRecords, getEndedPolicies, filter } = require('./database');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from the "views" directory
app.use(express.static(path.join(__dirname, 'views')));

// Home page - List all records
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API endpoint to get all records
app.get('/api/records', (req, res) => {
  getAllRecords((err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching records' });
    }
    res.json(records);
  });
});

// API endpoint to add a new record
app.post('/api/records', (req, res) => {
  const record = req.body;
  insertRecord(record, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding record' });
    }
    res.json({ message: 'Record added successfully' });
  });
});

// Page to list ended policies
app.get('/ended-policies', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ended-policies.html'));
});

// Filtrelenmiş biten poliçeleri getir
app.get('/api/ended-policies', (req, res) => {
  const days = parseInt(req.query.days) || 0; // Varsayılan: 0 (bugün bitecekler)
  const currentDate = new Date().toISOString().split('T')[0]; // Bugünün tarihi
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days); // Seçilen gün sayısına göre hedef tarih

  filter(currentDate, targetDate, (err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching ended policies' });
    }
    res.json(records);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});