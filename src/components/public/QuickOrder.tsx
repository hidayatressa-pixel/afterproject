import React, { useState } from 'react';
import {
  FileUp,
  MessageCircle,
  Settings2,
  CheckCircle,
  Printer,
  ShoppingBag,
  ArrowRight,
  Send,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickOrder: React.FC = () => {
  const { websiteContent, settings } = useApp();

  const activeWhatsApp = settings.whatsapp || websiteContent.whatsapp_number || '';

  // Interactive Quick Order Estimator
  const [docType, setDocType] = useState('Dokumen Tugas / Makalah');
  const [printOption, setPrintOption] = useState('Hitam Putih (B/W)');
  const [paperSize, setPaperSize] = useState('A4');
  const [sheetCount, setSheetCount] = useState<number>(10);
  const [copyCount, setCopyCount] = useState<number>(1);
  const [finishing, setFinishing] = useState('Tanpa Finishing (Staples saja)');
  const [customNote, setCustomNote] = useState('');

  const steps = [
    {
      num: '1',
      title: 'Siapkan File',
      desc: 'Simpan file dokumen Anda dalam format PDF, Word, Excel, atau JPG/PNG.',
      icon: FileUp,
    },
    {
      num: '2',
      title: 'Hubungi WhatsApp',
      desc: 'Klik tombol WA untuk terhubung langsung dengan operator cetak kami.',
      icon: MessageCircle,
    },
    {
      num: '3',
      title: 'Pilih Spesifikasi',
      desc: 'Tentukan ukuran kertas (A4/F4), hitam putih atau warna, dan jumlah rangkap.',
      icon: Settings2,
    },
    {
      num: '4',
      title: 'Konfirmasi Biaya',
      desc: 'Operator kami menghitung estimasi biaya dan waktu cetak secara akurat.',
      icon: CheckCircle,
    },
    {
      num: '5',
      title: 'Proses Print',
      desc: 'Dokumen Anda langsung dicetak dengan mesin laser berkualitas tinggi.',
      icon: Printer,
    },
    {
      num: '6',
      title: 'Ambil di Toko',
      desc: 'Tinggal ambil di toko AFTER PROJECT tanpa perlu antri lama!',
      icon: ShoppingBag,
    },
  ];

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const message =
      `*ORDER PRINT DOKUMEN - AFTER PROJECT*\n\n` +
      `Halo AFTER PROJECT, saya mau kirim file untuk dicetak dengan rincian berikut:\n` +
      `• Jenis: ${docType}\n` +
      `• Warna: ${printOption}\n` +
      `• Kertas: ${paperSize}\n` +
      `• Perkiraan Halaman: ${sheetCount} lembar\n` +
      `• Jumlah Rangkap: ${copyCount} rangkap\n` +
      `• Finishing: ${finishing}\n` +
      (customNote ? `• Catatan Khusus: ${customNote}\n` : '') +
      `\nFile dokumen akan saya lampirkan via chat ini. Mohon konfirmasi total biayanya. Terima kasih!`;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDirectWA = () => {
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const message = encodeURIComponent(
      'Halo AFTER PROJECT, saya ingin kirim file untuk dicetak. Apakah bisa diproses sekarang?'
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="kirim-file" className="py-16 md:py-24 bg-slate-50 text-slate-900 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-slate-950">
            Kirim File, Kami Print.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Tidak perlu buang waktu antri di toko. Kirimkan file Anda dari rumah atau kantor via WhatsApp, kami cetak dan Anda tinggal ambil saat sudah rapi!
          </p>
        </div>

        {/* 6-Step Visual Workflow */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl bg-white border border-slate-200 p-4 flex flex-col justify-between hover:bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-Column Interactive Tool: Form Generator & Direct WhatsApp Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Quick Form to generate pre-filled WhatsApp message */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Format Pesanan Cetak Cepat
                </h3>
                <p className="text-xs text-slate-500">
                  Isi spesifikasi di bawah, pesan rapi akan dibuatkan otomatis ke WhatsApp.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendWhatsAppOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jenis Dokumen
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option>Dokumen Tugas / Makalah</option>
                    <option>Skripsi / Laporan Akhir</option>
                    <option>Surat Lamaran / CV</option>
                    <option>Modul / Buku Pembelajaran</option>
                    <option>Proposal Usaha & Laporan</option>
                    <option>Sertifikat / Foto</option>
                    <option>Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pilihan Warna
                  </label>
                  <select
                    value={printOption}
                    onChange={(e) => setPrintOption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option>Hitam Putih (B/W)</option>
                    <option>Warna Campuran (Teks + Diagram)</option>
                    <option>Full Color Kualitas Tinggi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ukuran Kertas
                  </label>
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option>A4 (21 x 29.7 cm)</option>
                    <option>F4 / Folio (21.5 x 33 cm)</option>
                    <option>A3 Format Besar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jumlah Lembar
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sheetCount}
                    onChange={(e) => setSheetCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rangkap (Copy)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={copyCount}
                    onChange={(e) => setCopyCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Finishing / Jilid
                </label>
                <select
                  value={finishing}
                  onChange={(e) => setFinishing(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option>Tanpa Finishing (Staples saja)</option>
                  <option>Jilid Lakban & Mika Transparan</option>
                  <option>Jilid Spiral Kawat</option>
                  <option>Laminating Panas Anti-Air</option>
                  <option>Potong Kertas Rapi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Contoh: Halaman 1-5 warna, selebihnya hitam putih"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Kirim Rincian File via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Direct Quick Help Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-heading">
                    Atau Langsung Chat WA Kami
                  </h4>
                  <p className="text-xs text-slate-500">
                    Bebas kirim file langsung tanpa formulir
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Anda juga bisa langsung mengirimkan file dokumen Anda melalui lampiran WhatsApp ke nomor resmi AFTER PROJECT. Tim kami siap merespons dengan cepat.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Nomor WhatsApp:</span>
                  <span className="font-mono font-bold text-amber-700">
                    {settings.phone || websiteContent.phone_number || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Format yang Diterima:</span>
                  <span className="font-semibold text-slate-900">PDF, Word, JPG, Excel</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Jam Operasional:</span>
                  <span className="text-slate-700">{websiteContent.business_hours_weekday}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDirectWA}
                className="w-full py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Chat Langsung ke Operator WA</span>
              </button>
            </div>

            {/* Quick Tips */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-slate-700 text-xs space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-amber-700">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Tips Cetak Lebih Cepat:
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Untuk menghindari perubahan format atau pergeseran font, disarankan untuk mengonversi dokumen Word Anda menjadi <strong>PDF</strong> sebelum dikirim.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
