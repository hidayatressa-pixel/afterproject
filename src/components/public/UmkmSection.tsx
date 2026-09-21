import React from 'react';
import { Briefcase, FileSpreadsheet, PackageCheck, Palette, Headphones, ArrowRight, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UmkmSection: React.FC = () => {
  const { websiteContent } = useApp();

  const handleWhatsApp = (serviceName: string) => {
    const cleanNumber = websiteContent.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Halo AFTER PROJECT, kami dari pelaku usaha/UMKM ingin konsultasi kebutuhan: *${serviceName}*.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const umkmServices = [
    {
      title: 'Printing Dokumen Usaha',
      desc: 'Cetak invoice, nota penjualan rangkap (NCR), proposal kerjasama bisnis, dan company profile.',
      icon: Briefcase,
    },
    {
      title: 'Pengarsipan & Dokumen Legal',
      desc: 'Penggandaan berkas tender, legalitas perizinan, kontrak kerja, hingga jilid laporan keuangan rapi.',
      icon: FileSpreadsheet,
    },
    {
      title: 'Supply ATK Rutin Kantor',
      desc: 'Pasokan bulanan alat tulis kantor, kertas HVS rim, map arsip, dan binder dengan sistem tagihan berkala.',
      icon: PackageCheck,
    },
    {
      title: 'Desain Grafis Sederhana',
      desc: 'Bantuan tata letak banner mini, stiker label kemasan produk UMKM, dan kartu nama usaha.',
      icon: Palette,
    },
    {
      title: 'Dukungan Operasional Bisnis',
      desc: 'Layanan print mendadak saat pertemuan penting dengan mitra, siap diantar atau diambil fleksibel.',
      icon: Headphones,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            Mitra Bisnis Lokal
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Solusi untuk UMKM & Usaha
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Membantu kelancaran administrasi dokumen harian, kebutuhan cetak promosi, hingga pasokan ATK kantor Anda secara teratur dan efisien.
          </p>
        </div>

        {/* UMKM Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {umkmServices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 flex flex-col justify-between hover:bg-white hover:border-amber-400 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4 border border-amber-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 font-heading">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {svc.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleWhatsApp(svc.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 pt-2"
                >
                  <span>Konsultasi Kebutuhan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Special Bridge Card to Digital Solutions */}
          <div className="rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 text-white p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                Layanan Tambahan
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-heading">
                Butuh Sistem Digital atau Website?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Selain urusan cetak dan kertas, After Project juga menghadirkan <strong>Digital Solutions</strong> untuk membantu UMKM membuat aplikasi kasir, sistem stok, dan website usaha sederhana.
              </p>
            </div>
            <a
              href="#digital-solutions"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <span>Pelajari Digital Solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
