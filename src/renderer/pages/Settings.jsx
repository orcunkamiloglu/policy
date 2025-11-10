import React, { useState, useEffect } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    notificationDays: [7, 30],
    autoBackup: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await window.api.settings.get();

      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const result = await window.api.settings.update(settings);

      if (result.success) {
        alert('Ayarlar başarıyla kaydedildi!');
      } else {
        alert('Ayarlar kaydedilirken bir hata oluştu: ' + result.error);
      }
    } catch (error) {
      alert('Ayarlar kaydedilirken bir hata oluştu: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      const result = await window.api.data.backup();

      if (result.success) {
        alert(`Yedekleme başarılı!\n\nDosya konumu:\n${result.path}`);
      } else {
        alert('Yedekleme hatası: ' + (result.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Yedekleme hatası: ' + error.message);
    }
  };

  const handleRestore = async () => {
    if (
      !confirm(
        'Yedekten geri yükleme yapmak, mevcut tüm verilerin üzerine yazacaktır. Devam etmek istiyor musunuz?'
      )
    ) {
      return;
    }

    try {
      const result = await window.api.data.restore();

      if (result.success) {
        alert('Geri yükleme başarılı! Veriler yenilendi.');
        window.location.reload(); // Reload the app to show restored data
      } else if (!result.canceled) {
        alert('Geri yükleme hatası: ' + (result.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Geri yükleme hatası: ' + error.message);
    }
  };

  const handleCheckNotifications = async () => {
    try {
      await window.api.notification.check();
      alert('Bildirimler kontrol edildi!');
    } catch (error) {
      alert('Bildirim hatası: ' + error.message);
    }
  };

  const toggleNotificationDay = (day) => {
    const newDays = settings.notificationDays.includes(day)
      ? settings.notificationDays.filter((d) => d !== day)
      : [...settings.notificationDays, day];

    setSettings({ ...settings, notificationDays: newDays.sort((a, b) => a - b) });
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🔔 Bildirim Ayarları
        </h2>

        <div className="space-y-4">
          <div>
            <label className="label">
              Kaç gün önceden bildirim almak istiyorsunuz?
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Poliçe bitiş tarihinden kaç gün önce masaüstü bildirimi almak istediğinizi seçin.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 3, 7, 14, 30, 60, 90].map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={settings.notificationDays.includes(day)}
                    onChange={() => toggleNotificationDay(day)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{day} gün</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Otomatik Yedekleme
              </p>
              <p className="text-xs text-gray-500">
                Uygulama kapatıldığında otomatik yedekleme yap
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) =>
                  setSettings({ ...settings, autoBackup: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={handleSaveSettings} className="btn btn-primary" disabled={saving}>
              {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
            </button>
            <button onClick={handleCheckNotifications} className="btn btn-secondary">
              🔔 Bildirimleri Test Et
            </button>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          💾 Yedekleme & Geri Yükleme
        </h2>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Yedekleme:</strong> Tüm poliçe verilerinizi JSON dosyası olarak kaydeder.
              Bu dosyayı güvenli bir yerde saklayabilirsiniz.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Geri Yükleme:</strong> Daha önce yedeklediğiniz bir dosyadan verileri
              geri yükler. Mevcut tüm veriler silinir ve yedek dosyadaki verilerle değiştirilir.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={handleBackup} className="btn btn-success">
              💾 Yedek Al
            </button>
            <button onClick={handleRestore} className="btn btn-danger">
              ⚠️ Yedekten Geri Yükle
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ℹ️ Hakkında
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Uygulama:</strong> Sigorta Poliçe Yöneticisi
          </p>
          <p>
            <strong>Versiyon:</strong> 2.0.0
          </p>
          <p>
            <strong>Açıklama:</strong> Sigorta poliçelerinizi kolayca yönetin, takip edin ve
            raporlayın.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
