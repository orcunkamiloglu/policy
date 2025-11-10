import React, { useState } from 'react';

function ExportMenu({ insurances }) {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type) => {
    setShowMenu(false);
    setExporting(true);

    try {
      let result;
      if (type === 'excel') {
        result = await window.api.export.toExcel(insurances);
      } else if (type === 'pdf') {
        result = await window.api.export.toPDF(insurances);
      }

      if (result.success) {
        alert(`Dosya başarıyla kaydedildi:\n${result.path}`);
      } else if (!result.canceled) {
        alert('Dışa aktarma hatası: ' + (result.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Dışa aktarma hatası: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn btn-success"
        disabled={exporting || insurances.length === 0}
        title={insurances.length === 0 ? 'Dışa aktarılacak veri yok' : 'Dışa Aktar'}
      >
        {exporting ? '⏳ Dışa Aktarılıyor...' : '📥 Dışa Aktar'}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => handleExport('excel')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span>📊</span> Excel (.xlsx)
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span>📄</span> PDF (.pdf)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportMenu;
