const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/insurances.json');
    this.data = this.loadData();
  }

  // Load data from JSON file
  loadData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        // Create default data structure if file doesn't exist
        const defaultData = {
          insurances: [],
          settings: {
            notificationDays: [7, 30],
            autoBackup: true,
            language: 'tr'
          }
        };
        this.saveData(defaultData);
        return defaultData;
      }

      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading data:', error);
      return {
        insurances: [],
        settings: {
          notificationDays: [7, 30],
          autoBackup: true,
          language: 'tr'
        }
      };
    }
  }

  // Save data to JSON file
  saveData(data = this.data) {
    try {
      const dir = path.dirname(this.dataPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2), 'utf8');
      return { success: true };
    } catch (error) {
      console.error('Error saving data:', error);
      return { success: false, error: error.message };
    }
  }

  // Create a new insurance record
  create(insurance) {
    try {
      const newInsurance = {
        id: uuidv4(),
        name: insurance.name,
        surname: insurance.surname,
        phone: insurance.phone,
        policyType: insurance.policyType,
        policyNumber: insurance.policyNumber || '',
        company: insurance.company || '',
        startDate: insurance.startDate,
        endDate: insurance.endDate,
        notes: insurance.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.data.insurances.push(newInsurance);
      const saveResult = this.saveData();

      if (saveResult.success) {
        return { success: true, data: newInsurance };
      } else {
        return { success: false, error: saveResult.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all insurance records
  getAll() {
    try {
      return { success: true, data: this.data.insurances };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get a single insurance record by ID
  getById(id) {
    try {
      const insurance = this.data.insurances.find(ins => ins.id === id);
      if (insurance) {
        return { success: true, data: insurance };
      } else {
        return { success: false, error: 'Insurance not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update an insurance record
  update(id, updates) {
    try {
      const index = this.data.insurances.findIndex(ins => ins.id === id);

      if (index === -1) {
        return { success: false, error: 'Insurance not found' };
      }

      this.data.insurances[index] = {
        ...this.data.insurances[index],
        ...updates,
        id: this.data.insurances[index].id, // Keep original ID
        createdAt: this.data.insurances[index].createdAt, // Keep original creation date
        updatedAt: new Date().toISOString()
      };

      const saveResult = this.saveData();

      if (saveResult.success) {
        return { success: true, data: this.data.insurances[index] };
      } else {
        return { success: false, error: saveResult.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete an insurance record
  delete(id) {
    try {
      const index = this.data.insurances.findIndex(ins => ins.id === id);

      if (index === -1) {
        return { success: false, error: 'Insurance not found' };
      }

      this.data.insurances.splice(index, 1);
      const saveResult = this.saveData();

      if (saveResult.success) {
        return { success: true };
      } else {
        return { success: false, error: saveResult.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search insurance records
  search(query) {
    try {
      const searchTerm = query.toLowerCase();
      const results = this.data.insurances.filter(ins => {
        return (
          ins.name.toLowerCase().includes(searchTerm) ||
          ins.surname.toLowerCase().includes(searchTerm) ||
          ins.phone.includes(searchTerm) ||
          ins.policyType.toLowerCase().includes(searchTerm) ||
          ins.policyNumber.toLowerCase().includes(searchTerm) ||
          ins.company.toLowerCase().includes(searchTerm)
        );
      });

      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Filter insurance records by date range (policies ending soon)
  filterByEndDate(days) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      targetDate.setHours(23, 59, 59, 999);

      const results = this.data.insurances.filter(ins => {
        const endDate = new Date(ins.endDate);
        return endDate >= today && endDate <= targetDate;
      });

      // Sort by end date (closest first)
      results.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get settings
  getSettings() {
    try {
      return { success: true, data: this.data.settings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update settings
  updateSettings(settings) {
    try {
      this.data.settings = { ...this.data.settings, ...settings };
      const saveResult = this.saveData();

      if (saveResult.success) {
        return { success: true, data: this.data.settings };
      } else {
        return { success: false, error: saveResult.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Backup data
  backup() {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const backupPath = path.join(
        path.dirname(this.dataPath),
        `insurances_backup_${timestamp}.json`
      );

      fs.copyFileSync(this.dataPath, backupPath);
      return { success: true, path: backupPath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Restore data from backup
  restore(backupPath) {
    try {
      if (!fs.existsSync(backupPath)) {
        return { success: false, error: 'Backup file not found' };
      }

      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

      // Validate backup data structure
      if (!backupData.insurances || !Array.isArray(backupData.insurances)) {
        return { success: false, error: 'Invalid backup file format' };
      }

      this.data = backupData;
      const saveResult = this.saveData();

      if (saveResult.success) {
        return { success: true };
      } else {
        return { success: false, error: saveResult.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = Database;
