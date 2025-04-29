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

  doc.setFontSize(18);
  doc.text('Caj Transaksi Penggunaan Modul Sebutharga & Tender', 210, 40, { align: 'center' });

  const headers = [
    ['Agensi', 'Tahun', 'Tajuk', 'No Rujukan', 'Kategori', 'Jabatan/Unit', 'Status Terkini', 'Nilai Kontrak', 'Tarikh Mula', 'Tarikh Akhir', 'Jumlah Bulan', 'One-Off', 'Bermasa', 'Fi CDCi']
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
    startY: 70,
    head: headers,
    body: data,
    theme: 'grid'
  });

  const pdfOutput = doc.output('arraybuffer');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
  res.status(200).send(Buffer.from(pdfOutput));
}
