import React from 'react';
import { ShieldCheck, Heart, Sparkles, Check, Lightbulb, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutSection: React.FC = () => {
  const { settings } = useApp();

  const philosophies = [
    {
      title: 'Simple',
      desc: 'Proses pemesanan mudah tanpa kerumitan, baik datang langsung maupun kirim file lewat WhatsApp.',
    },
    {
      title: 'Useful',
      desc: 'Setiap lembar yang dicetak dan produk yang disediakan tepat sasaran untuk kebutuhan Anda.',
    },
    {
      title: 'Affordable',
      desc: 'Harga ramah untuk pelajar, guru, warga sekitar, hingga pelaku usaha kecil dan menengah.',
    },
    {
      title: 'Practical',
      desc: 'Fokus pada hasil akhir yang rapi, cepat selesai, dan langsung siap digunakan.',
    },
    {
      title: 'Technology-enabled',
      desc: 'Memanfaatkan teknologi modern untuk kecepatan cetak serta membantu UMKM bertransformasi digital.',
    },
  ];

  return (
    <section id="tentang" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Company Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              Tentang Kami
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              AFTER PROJECT: Dari Dokumen Harian Hingga Solusi Usaha
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              <strong>AFTER PROJECT</strong> berawal dari usaha layanan fotocopy, pencetakan berkas, dan penyediaan alat tulis kantor (ATK) lokal yang berdedikasi melayani pelajar, pengajar, warga sekitar, dan pelaku usaha mandiri.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Seiring berjalannya waktu dan berkembangnya kebutuhan dunia usaha, kami tidak hanya melayani cetak fisik, namun juga menghadirkan <strong>Digital Solutions</strong> sederhana—seperti sistem kasir, aplikasi stok, dan website usaha praktis untuk membantu UMKM lokal bertumbuh lebih rapi dan tertata.
            </p>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                Komitmen Kami
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kami percaya bahwa pelayanan yang baik tidak harus rumit ataupun mahal. Baik Anda membutuhkan 1 lembar fotocopy KTP, jilid 10 buku tugas, maupun konsultasi sistem usaha kecil, Anda akan selalu mendapatkan perhatian dan pelayanan terbaik dari kami.
              </p>
            </div>
          </div>

          {/* Right Column: 5 Main Philosophies */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Nilai & Filosofi
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">
                  5 Prinsip Utama AFTER PROJECT
                </h3>
              </div>

              <div className="space-y-3.5">
                {philosophies.map((phil, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-amber-50/50 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {phil.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        {phil.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
