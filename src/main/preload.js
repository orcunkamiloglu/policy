const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Insurance operations
  insurance: {
    getAll: () => ipcRenderer.invoke('insurance:getAll'),
    getById: (id) => ipcRenderer.invoke('insurance:getById', id),
    create: (insurance) => ipcRenderer.invoke('insurance:create', insurance),
    update: (id, updates) => ipcRenderer.invoke('insurance:update', id, updates),
    delete: (id) => ipcRenderer.invoke('insurance:delete', id),
    search: (query) => ipcRenderer.invoke('insurance:search', query),
    filterByEndDate: (days) => ipcRenderer.invoke('insurance:filterByEndDate', days)
  },

  // Settings operations
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (settings) => ipcRenderer.invoke('settings:update', settings)
  },

  // Data operations (backup/restore)
  data: {
    backup: () => ipcRenderer.invoke('data:backup'),
    restore: () => ipcRenderer.invoke('data:restore')
  },

  // Export operations
  export: {
    toExcel: (insurances) => ipcRenderer.invoke('export:excel', insurances),
    toPDF: (insurances) => ipcRenderer.invoke('export:pdf', insurances)
  },

  // Notification operations
  notification: {
    check: () => ipcRenderer.invoke('notification:check')
  }
});
