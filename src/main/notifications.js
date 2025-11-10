const { Notification } = require('electron');

class NotificationManager {
  constructor(database) {
    this.database = database;
    this.checkInterval = null;
  }

  // Start checking for expiring policies
  startMonitoring() {
    // Check immediately
    this.checkExpiringPolicies();

    // Then check every 6 hours
    this.checkInterval = setInterval(() => {
      this.checkExpiringPolicies();
    }, 6 * 60 * 60 * 1000); // 6 hours
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Check for policies expiring soon and send notifications
  checkExpiringPolicies() {
    try {
      const settingsResult = this.database.getSettings();
      if (!settingsResult.success) {
        console.error('Failed to get settings:', settingsResult.error);
        return;
      }

      const notificationDays = settingsResult.data.notificationDays || [7, 30];

      notificationDays.forEach(days => {
        const result = this.database.filterByEndDate(days);

        if (result.success && result.data.length > 0) {
          this.sendNotification(result.data, days);
        }
      });
    } catch (error) {
      console.error('Error checking expiring policies:', error);
    }
  }

  // Send a notification
  sendNotification(policies, days) {
    try {
      const count = policies.length;

      let title = '';
      let body = '';

      if (days === 0) {
        title = 'Bugün Biten Poliçeler!';
        body = `${count} adet poliçeniz bugün bitiyor.`;
      } else if (days === 1) {
        title = 'Yarın Biten Poliçeler!';
        body = `${count} adet poliçeniz yarın bitiyor.`;
      } else if (days <= 7) {
        title = `${days} Gün İçinde Biten Poliçeler`;
        body = `${count} adet poliçeniz ${days} gün içinde bitiyor.`;
      } else {
        title = `${days} Gün İçinde Biten Poliçeler`;
        body = `${count} adet poliçeniz ${days} gün içinde bitiyor.`;
      }

      // Add details about the first few policies
      if (count > 0) {
        body += '\n\n';
        const topPolicies = policies.slice(0, 3);
        topPolicies.forEach(policy => {
          body += `${policy.name} ${policy.surname} - ${policy.policyType}\n`;
        });

        if (count > 3) {
          body += `ve ${count - 3} tane daha...`;
        }
      }

      const notification = new Notification({
        title: title,
        body: body,
        icon: null, // You can add an icon path here
        urgency: days <= 7 ? 'critical' : 'normal'
      });

      notification.show();

      notification.on('click', () => {
        // When notification is clicked, focus the app window
        // This will be handled by the main process
        console.log('Notification clicked');
      });

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Manually check and notify (for testing or manual trigger)
  manualCheck() {
    this.checkExpiringPolicies();
  }
}

module.exports = NotificationManager;
