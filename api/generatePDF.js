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

  doc.setFontSize(12);
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
      'Jumlah Bulan',
      'One-Off',
      'Bermasa',
      'Fi CDCi (RM)'
    ]
  ];

  const tableData = rows.map(row => [
    row.Agensi,
    row.Tahun,
    row.Tajuk,
    row.NoRujukan,
    row.Kategori,
    row.JabatanUnit,
    row.StatusTerkini,
    row.NilaiKontrak,
    row.TarikhMula,
    row.TarikhAkhir,
    row.JumlahBulanKontrak,
    row.OneOff,
    row.Bermasa,
    row.FiCDCi
  ]);

  autoTable(doc, {
    startY: 70,
    head: headers,
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
      minCellHeight: 20
    },
    headStyles: {
      fillColor: [255, 255, 153],
      textColor: 0,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      2: { cellWidth: 180 }, // Tajuk
      3: { cellWidth: 100 }, // No Rujukan
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
