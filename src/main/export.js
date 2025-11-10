const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');

class ExportManager {
  constructor() {}

  // Export to Excel
  async exportToExcel(insurances, mainWindow) {
    try {
      // Show save dialog
      const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
        title: 'Excel Dosyası Olarak Kaydet',
        defaultPath: `insurances_${new Date().toISOString().split('T')[0]}.xlsx`,
        filters: [
          { name: 'Excel Files', extensions: ['xlsx'] }
        ]
      });

      if (canceled || !filePath) {
        return { success: false, canceled: true };
      }

      // Create workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Poliçeler');

      // Define columns
      worksheet.columns = [
        { header: 'Ad', key: 'name', width: 15 },
        { header: 'Soyad', key: 'surname', width: 15 },
        { header: 'Telefon', key: 'phone', width: 15 },
        { header: 'Poliçe Türü', key: 'policyType', width: 20 },
        { header: 'Poliçe No', key: 'policyNumber', width: 20 },
        { header: 'Şirket', key: 'company', width: 20 },
        { header: 'Başlangıç Tarihi', key: 'startDate', width: 15 },
        { header: 'Bitiş Tarihi', key: 'endDate', width: 15 },
        { header: 'Notlar', key: 'notes', width: 30 }
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

      // Add data
      insurances.forEach(insurance => {
        worksheet.addRow({
          name: insurance.name,
          surname: insurance.surname,
          phone: insurance.phone,
          policyType: insurance.policyType,
          policyNumber: insurance.policyNumber || '',
          company: insurance.company || '',
          startDate: insurance.startDate,
          endDate: insurance.endDate,
          notes: insurance.notes || ''
        });
      });

      // Auto-fit columns (simple version)
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      // Save file
      await workbook.xlsx.writeFile(filePath);

      return { success: true, path: filePath };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      return { success: false, error: error.message };
    }
  }

  // Export to PDF
  async exportToPDF(insurances, mainWindow) {
    try {
      // Show save dialog
      const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
        title: 'PDF Dosyası Olarak Kaydet',
        defaultPath: `insurances_${new Date().toISOString().split('T')[0]}.pdf`,
        filters: [
          { name: 'PDF Files', extensions: ['pdf'] }
        ]
      });

      if (canceled || !filePath) {
        return { success: false, canceled: true };
      }

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Title
      doc.fontSize(20).text('Poliçe Listesi', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, {
        align: 'center'
      });
      doc.moveDown(2);

      // Add each insurance as a section
      insurances.forEach((insurance, index) => {
        doc.fontSize(14).text(`${index + 1}. ${insurance.name} ${insurance.surname}`, {
          underline: true
        });
        doc.moveDown(0.5);

        doc.fontSize(10);
        doc.text(`Telefon: ${insurance.phone}`);
        doc.text(`Poliçe Türü: ${insurance.policyType}`);
        if (insurance.policyNumber) {
          doc.text(`Poliçe No: ${insurance.policyNumber}`);
        }
        if (insurance.company) {
          doc.text(`Şirket: ${insurance.company}`);
        }
        doc.text(`Başlangıç Tarihi: ${insurance.startDate}`);
        doc.text(`Bitiş Tarihi: ${insurance.endDate}`);
        if (insurance.notes) {
          doc.text(`Notlar: ${insurance.notes}`);
        }

        doc.moveDown(1.5);

        // Add page break if needed
        if (doc.y > 700) {
          doc.addPage();
        }
      });

      // Footer
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Sayfa ${i + 1} / ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
      }

      // Finalize PDF
      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          resolve({ success: true, path: filePath });
        });
        stream.on('error', (error) => {
          reject({ success: false, error: error.message });
        });
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = ExportManager;
