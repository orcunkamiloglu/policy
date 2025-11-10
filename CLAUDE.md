# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Insurance Policy Manager is a modern Electron + React desktop application for managing insurance policies. It uses a single JSON file for data storage (no database), Vite for building, and Tailwind CSS for styling.

## Architecture

**Modern Stack:**
- **Electron** - Desktop app framework with IPC for main/renderer communication
- **React** - UI library with functional components and hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JSON Storage** - Single file storage (`src/data/insurances.json`) with in-memory operations

**Process Architecture:**
- `src/main/index.js` - Electron main process, creates window, registers IPC handlers
- `src/main/preload.js` - Secure IPC bridge using contextBridge
- `src/renderer/` - React app running in renderer process
- Communication via `window.api.*` methods exposed by preload

**Data Layer:**
- `src/main/database.js` - JSON file CRUD operations (synchronous)
- All operations return `{ success: boolean, data?: any, error?: string }`
- In-memory caching for performance
- No native dependencies, pure JavaScript

## Development Commands

```bash
# Development (starts Vite + Electron with hot reload)
npm run dev

# Build for Windows
npm run build:windows

# Vite dev server only
npm run dev:vite

# Preview production build
npm run preview
```

**Note:** `npm run dev` uses concurrently to run both Vite and Electron. Vite must be ready before Electron starts (handled by wait-on).

## Key Files

### Main Process
- `src/main/index.js` - Entry point, IPC handlers, window management
- `src/main/database.js` - JSON storage operations (create, read, update, delete, search, filter)
- `src/main/notifications.js` - Desktop notifications for expiring policies (checks every 6 hours)
- `src/main/export.js` - Excel (exceljs) and PDF (pdfkit) export
- `src/main/preload.js` - Exposes `window.api` to renderer

### Renderer (React)
- `src/renderer/App.jsx` - Main component, state management, page routing
- `src/renderer/pages/InsuranceList.jsx` - Main page with CRUD, search, sort
- `src/renderer/pages/ExpiringPolicies.jsx` - Filtered view of policies ending soon
- `src/renderer/pages/Settings.jsx` - Settings, backup, restore
- `src/renderer/components/` - Reusable UI components

### Configuration
- `vite.config.js` - Vite config (root: src/renderer, output: dist-renderer)
- `tailwind.config.js` - Tailwind CSS config
- `package.json` - Scripts, dependencies, electron-builder config

## IPC API

All IPC handlers return `{ success: boolean, data?: any, error?: string }`

**Insurance operations:**
- `insurance:getAll` - Get all records
- `insurance:getById(id)` - Get single record
- `insurance:create(insurance)` - Create record
- `insurance:update(id, updates)` - Update record
- `insurance:delete(id)` - Delete record
- `insurance:search(query)` - Search by name, phone, policy type, etc.
- `insurance:filterByEndDate(days)` - Get policies ending in N days

**Settings:**
- `settings:get` - Get settings
- `settings:update(settings)` - Update settings

**Data:**
- `data:backup` - Create timestamped backup
- `data:restore` - Restore from backup file (opens file dialog)

**Export:**
- `export:excel(insurances)` - Export to Excel (opens save dialog)
- `export:pdf(insurances)` - Export to PDF (opens save dialog)

**Notifications:**
- `notification:check` - Manually trigger notification check

## Data Model

```javascript
{
  "insurances": [
    {
      "id": "uuid",
      "name": "string",
      "surname": "string",
      "phone": "string",
      "policyType": "string",
      "policyNumber": "string",
      "company": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "notes": "string",
      "createdAt": "ISO timestamp",
      "updatedAt": "ISO timestamp"
    }
  ],
  "settings": {
    "notificationDays": [7, 30],
    "autoBackup": true,
    "language": "tr"
  }
}
```

## Important Notes

- **No database** - Everything is in `insurances.json`, suitable for 100-1000 records
- **Turkish UI** - All labels and messages are in Turkish
- **Context isolation** - Enabled for security, use preload.js for IPC
- **Synchronous operations** - Database methods are sync (not promises/callbacks)
- **Auto-backup** - Runs on app quit if `settings.autoBackup` is true
- **Dev mode detection** - Uses `process.env.NODE_ENV` and `app.isPackaged`
- **Build output** - Vite builds to `dist-renderer/`, Electron to `dist/`

## Adding Features

**New IPC handler:**
1. Add handler in `src/main/index.js` using `ipcMain.handle()`
2. Expose in `src/main/preload.js` via `contextBridge.exposeInMainWorld()`
3. Call from renderer using `window.api.*`

**New React page:**
1. Create page component in `src/renderer/pages/`
2. Add route in `src/renderer/App.jsx`
3. Add navigation button in `src/renderer/components/Header.jsx`

**New database method:**
1. Add method to `Database` class in `src/main/database.js`
2. Return `{ success, data?, error? }` format
3. Call `this.saveData()` if modifying data
