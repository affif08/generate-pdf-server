import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { invoiceNumber, fields } = req.body;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  doc.setFontSize(16);
  doc.text('Caj Transaksi Penggunaan Modul Sebutharga & Tender', 300, 40, { align: 'center' });

  const headers = [
    [
      'Agensi',
      'Tahun',
      'Tajuk',
      'No Rujukan',
      'Kategori',
      'Jabatan/Unit',
      'Status',
      'Nilai Kontrak (RM)',
      'Tarikh Mula',
      'Tarikh Akhir',
      'Bulan Kontrak',
      'One-Off',
      'Bermasa',
      'Fi CDCi (RM)'
    ]
  ];

  const data = [
    [
      fields.Agensi || '',
      fields.Tahun || '',
      fields.Tajuk || '',
      fields.NoRujukan || '',
      fields.Kategori || '',
      fields.JabatanUnit || '',
      fields.StatusTerkini || '',
      fields.NilaiKontrak || '',
      fields.TarikhMula || '',
      fields.TarikhAkhir || '',
      fields.JumlahBulanKontrak || '',
      fields.OneOff || '',
      fields.Bermasa || '',
      fields.FiCDCi || ''
    ]
  ];

  autoTable(doc, {
    startY: 60,
    head: headers,
    body: data,
    styles: {
      fontSize: 10,
      cellPadding: 4,
      overflow: 'linebreak'
    },
    columnStyles: {
      2: { cellWidth: 180 }, // Tajuk
      3: { cellWidth: 90 },  // No Rujukan
      6: { cellWidth: 60 },  // Status
      7: { cellWidth: 80 },  // Nilai Kontrak
    },
    theme: 'grid',
    headStyles: {
      fillColor: [255, 204, 0],
      textColor: 20,
      halign: 'center',
      fontStyle: 'bold'
    },
    bodyStyles: {
      halign: 'left',
      valign: 'top'
    }
  });

  const pdfOutput = doc.output('arraybuffer');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
  res.status(200).send(Buffer.from(pdfOutput));
}
