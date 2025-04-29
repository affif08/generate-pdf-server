import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { invoiceNumber, rows } = req.body;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  doc.setFontSize(12); // Moderate font size to match normal Google Sheet look

  doc.text('Caj Transaksi Penggunaan Modul Sebutharga & Tender', 420, 40, { align: 'center' });

  const headers = [
    [
      'Agensi',
      'Tahun',
      'Tajuk',
      'No. Rujukan',
      'Kategori',
      'Jabatan/Unit',
      'Status Terkini',
      'Nilai Kontrak (RM)',
      'Tarikh Mula',
      'Tarikh Akhir',
      'Jumlah Bulan Kontrak',
      'One-Off',
      'Bermasa',
      'Fi CDCi (RM)'
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
      overflow: 'linebreak',
      valign: 'middle',
      halign: 'left'
    },
    headStyles: {
      fillColor: [255, 255, 153], // Excel light yellow header color
      textColor: 0,
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255] // keep normal white rows
    },
    columnStyles: {
      2: { cellWidth: 200 }, // Tajuk wider
      3: { cellWidth: 100 }, // No. Rujukan
      6: { cellWidth: 80 },  // Status Terkini
      7: { cellWidth: 100 }, // Nilai Kontrak
      13: { cellWidth: 90 }  // Fi CDCi
    }
  });

  const pdfOutput = doc.output('arraybuffer');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
  res.status(200).send(Buffer.from(pdfOutput));
}
