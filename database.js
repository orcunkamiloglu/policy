const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./policy_manager.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create the records table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        phone TEXT NOT NULL,
        policyType TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL
      )
    `);
  }
});

// Function to insert a new record
const insertRecord = (record, callback) => {
  const { name, surname, phone, policyType, startDate, endDate } = record;
  const query = `
    INSERT INTO records (name, surname, phone, policyType, startDate, endDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [name, surname, phone, policyType, startDate, endDate], callback);
};

// Function to get all records
const getAllRecords = (callback) => {
  const query = `SELECT * FROM records`;
  db.all(query, callback);
};

// Function to get ended policies (where endDate is before the current date)
const getEndedPolicies = (callback) => {
  const query = `
    SELECT * FROM records
    WHERE endDate < ?
  `;
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  db.all(query, [currentDate], callback);
};

const filter = (currentDate, targetDate, callback) => {
    const query = `
      SELECT * FROM records
      WHERE endDate BETWEEN ? AND ?
    `;
    const params = [currentDate, targetDate.toISOString().split('T')[0]];
  
    db.all(query, params, callback);
};

module.exports = { insertRecord, getAllRecords, getEndedPolicies, filter };