import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileText, Table } from 'lucide-react';

interface ExportProps {
  data: any[];
  filename: string;
}

export default function ExportButtons({ data, filename }: ExportProps) {
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`LAPORAN KOLEKSI BUNGA - ${filename}`, 14, 15);

    // Filter data agar kolom id, judul, isi, dan nama_kategori saja yang masuk PDF
    const tableRows = data.map((item, index) => [
      index + 1,
      item.judul,
      item.nama_kategori,
      item.isi.substring(0, 50) + "..." // Potong deskripsi biar gak kepanjangan di PDF
    ]);

    autoTable(doc, {
      head: [['No', 'Nama Bunga', 'Kategori', 'Deskripsi Singkat']],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [219, 39, 119] } // Warna Pink Pinky
    });

    doc.save(`${filename}.pdf`);
  };

  const handleExportExcel = () => {
    // Siapkan data untuk Excel
    const excelData = data.map(item => ({
      ID: item.id,
      Nama_Bunga: item.judul,
      Kategori: item.nama_kategori,
      Deskripsi: item.isi,
      Link_Gambar: item.url_gambar
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Bunga");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <div className="flex gap-4 mb-6">
      <button 
        onClick={handleExportPDF}
        className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-95"
      >
        <FileText size={16} /> EKSPOR PDF
      </button>
      <button 
        onClick={handleExportExcel}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-95"
      >
        <Table size={16} /> EKSPOR EXCEL
      </button>
    </div>
  );
}