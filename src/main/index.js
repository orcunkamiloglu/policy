const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('./database');
const NotificationManager = require('./notifications');
const ExportManager = require('./export');

let mainWindow;
let database;
let notificationManager;
let exportManager;

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist-renderer/index.html'));
  }
}

// Initialize application
function initializeApp() {
  // Initialize database
  database = new Database();

  // Initialize notification manager
  notificationManager = new NotificationManager(database);
  notificationManager.startMonitoring();

  // Initialize export manager
  exportManager = new ExportManager();
}

// IPC Handlers

// Insurance CRUD operations
ipcMain.handle('insurance:getAll', async () => {
  return database.getAll();
});

ipcMain.handle('insurance:getById', async (event, id) => {
  return database.getById(id);
});

ipcMain.handle('insurance:create', async (event, insurance) => {
  return database.create(insurance);
});

ipcMain.handle('insurance:update', async (event, id, updates) => {
  return database.update(id, updates);
});

ipcMain.handle('insurance:delete', async (event, id) => {
  return database.delete(id);
});

// Search and filter
ipcMain.handle('insurance:search', async (event, query) => {
  return database.search(query);
});

ipcMain.handle('insurance:filterByEndDate', async (event, days) => {
  return database.filterByEndDate(days);
});

// Settings
ipcMain.handle('settings:get', async () => {
  return database.getSettings();
});

ipcMain.handle('settings:update', async (event, settings) => {
  return database.updateSettings(settings);
});

// Backup and restore
ipcMain.handle('data:backup', async () => {
  return database.backup();
});

ipcMain.handle('data:restore', async () => {
  try {
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
      title: 'Yedek Dosyası Seç',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile']
    });

    if (canceled || !filePaths || filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    return database.restore(filePaths[0]);
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Export
ipcMain.handle('export:excel', async (event, insurances) => {
  return exportManager.exportToExcel(insurances, mainWindow);
});

ipcMain.handle('export:pdf', async (event, insurances) => {
  return exportManager.exportToPDF(insurances, mainWindow);
});

// Notifications
ipcMain.handle('notification:check', async () => {
  notificationManager.manualCheck();
  return { success: true };
});

// App lifecycle
app.whenReady().then(() => {
  initializeApp();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Stop notification monitoring
    if (notificationManager) {
      notificationManager.stopMonitoring();
    }
    app.quit();
  }
});

app.on('before-quit', () => {
  // Auto-backup if enabled
  const settingsResult = database.getSettings();
  if (settingsResult.success && settingsResult.data.autoBackup) {
    database.backup();
  }
});
