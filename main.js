const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const { insertRecord, getAllRecords, getEndedPolicies, filter } = require('./database');

// Create an Express server
const expressApp = express();
const port = 3000;

// Middleware to parse JSON and form data
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Serve static files from the "views" directory
expressApp.use(express.static(path.join(__dirname, 'views')));

// Home page - List all records
expressApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API endpoint to get all records
expressApp.get('/api/records', (req, res) => {
  getAllRecords((err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching records' });
    }
    res.json(records);
  });
});

// API endpoint to add a new record
expressApp.post('/api/records', (req, res) => {
  const record = req.body;
  insertRecord(record, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding record' });
    }
    res.json({ message: 'Record added successfully' });
  });
});

// Page to list ended policies
expressApp.get('/ended-policies', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ended-policies.html'));
});

// Filtrelenmiş biten poliçeleri getir
expressApp.get('/api/ended-policies', (req, res) => {
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

// Start the Express server
expressApp.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

// Create the Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the Express server URL
  win.loadURL('http://localhost:3000');
}

// When the app is ready, create the window
app.whenReady().then(createWindow);

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recreate the window if the app is activated (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});