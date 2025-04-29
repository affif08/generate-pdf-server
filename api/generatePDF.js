import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function formatDate(input) {
  if (!input) return '-';
  const date = new Date(input);
  if (isNaN(date.getTime())) return input; // if invalid, return raw
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

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
      'No. Rujukan',
      'Kategori',
      'Jabatan/Unit',
      'Status Terkini',
      'Nilai Kontrak (Tanpa SST) (RM)',
      'Tarikh Mula',
      'Tarikh Akhir',
      'Jumlah Bulan',
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
    formatDate(row.TarikhMula),
    formatDate(row.TarikhAkhir),
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
      halign: 'left',
      minCellHeight: 20
    },
    headStyles: {
      fillColor: [255, 255, 153], // Light Yellow
      textColor: 0,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      2: { cellWidth: 200 }, // Tajuk
      3: { cellWidth: 100 }, // No Rujukan
      6: { cellWidth: 80 },  // Status Terkini
      7: { cellWidth: 100 }, // Nilai Kontrak
      8: { cellWidth: 80 },  // Tarikh Mula
      9: { cellWidth: 80 },  // Tarikh Akhir
      13: { cellWidth: 90 }  // Fi CDCi
    }
  });

  const pdfOutput = doc.output('arraybuffer');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
  res.status(200).send(Buffer.from(pdfOutput));
}
