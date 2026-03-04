export default function Detail() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button className="mb-4 text-blue-500">← Kembali</button>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <img src="https://placehold.co/600x400" className="w-full rounded-xl mb-4" />
        <h1 className="text-4xl font-black mb-2">Judul Postingan</h1>
        <p className="text-gray-700 leading-relaxed">Isi lengkap postingan lo bakal muncul di sini.</p>
      </div>
    </div>
  );
}