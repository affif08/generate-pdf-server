import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { invoiceNumber, rows } = req.body;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  doc.setFontSize(16);
  doc.text('Caj Transaksi Penggunaan Modul Sebutharga & Tender', 420, 40, { align: 'center' });

  const headers = [
    [
      'Agensi',
      'Tahun',
      'Tajuk',
      'No. Rujukan (No. Sebutharga / Tender)',
      'Kategori',
      'Jabatan/Unit',
      'Status Terkini (Selesai/Batal/Re-tender)',
      'Nilai Kontrak (Tanpa SST) (RM)',
      'Tarikh Mula',
      'Tarikh Akhir',
      'Jumlah Bulan Kontrak',
      'One-Off',
      'Bermasa',
      'Fi CDCi (0.7%) (RM)'
    ]
  ];

  const tableData = rows.map(row => [
    row.Agensi || '-',
    row.Tahun || '-',
    row.Tajuk || '-',
    row.NoRujukan || '-',
    row.Kategori || '-',
    row.JabatanUnit || '-',
    row.StatusTerkini || '-',
    row.NilaiKontrak || '-',
    row.TarikhMula || '-',
    row.TarikhAkhir || '-',
    row.JumlahBulanKontrak || '-',
    row.OneOff || '-',
    row.Bermasa || '-',
    row.FiCDCi || '-'
  ]);

  autoTable(doc, {
    startY: 70,
    head: headers,
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      valign: 'middle',
      halign: 'left',
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [255, 255, 153], // Light Yellow header background
      textColor: 0,
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255] // White background for all rows
    },
    columnStyles: {
      2: { cellWidth: 200 }, // Tajuk wider
      3: { cellWidth: 120 }, // No Rujukan
      6: { cellWidth: 100 }, // Status
      7: { cellWidth: 100 }, // Nilai Kontrak
      13: { cellWidth: 90 } // Fi CDCi
    }
  });

  const pdfOutput = doc.output('arraybuffer');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
  res.status(200).send(Buffer.from(pdfOutput));
}
