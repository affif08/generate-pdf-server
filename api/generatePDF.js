import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function handler(req, res) {
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

  const headers = [[
    'Agensi', 'Tahun', 'Tajuk', 'No Rujukan', 'Kategori', 'Jabatan/Unit',
    'Status', 'Nilai (RM)', 'Mula', 'Akhir', 'Bulan', 'One-Off', 'Bermasa', 'Fi CDCi'
  ]];

  const data = [[
    fields.Agensi || '-',
    fields.Tahun || '-',
    fields.Tajuk || '-',
    fields.NoRujukan || '-',
    fields.Kategori || '-',
    fields.JabatanUnit || '-',
    fields.StatusTerkini || '-',
    fields.NilaiKontrak || '-',
    fields.TarikhMula || '-',
    fields.TarikhAkhir || '-',
    fields.JumlahBulanKontrak || '-',
    fields.OneOff || '-',
    fields.Bermasa || '-',
    fields.FiCDCi || '-'
  ]];

  autoTable(doc, {
    startY: 70,
    head: headers,
    body: data,
    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: 'middle'
    },
    columnStyles: {
      2: { cellWidth: 220 }, // Tajuk
      3: { cellWidth: 90 },  // No Rujukan
      6: { cellWidth: 70 },  // Status
      7: { cellWidth: 80 },  // Nilai
      13: { cellWidth: 60 }, // Fi CDCi
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: 20,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      halign: 'left'
    },
    theme: 'grid'
  });

  const pdfOutput = doc.output('arraybuffer');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
  res.status(200).send(Buffer.from(pdfOutput));
}
