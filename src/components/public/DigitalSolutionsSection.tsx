import React from 'react';
import {
  Globe,
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Code2,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DigitalSolutionsSection: React.FC = () => {
  const { websiteContent } = useApp();

  const handleConsultWhatsApp = (serviceName?: string) => {
    const cleanNumber = websiteContent.whatsapp_number.replace(/\D/g, '');
    const text = serviceName
      ? `Halo AFTER PROJECT Digital Solutions, saya ingin konsultasi pembuatan: *${serviceName}* untuk usaha saya.`
      : `Halo AFTER PROJECT Digital Solutions, saya ingin konsultasi mengenai pembuatan sistem / website usaha.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const digitalServices = [
    {
      title: 'Website Usaha',
      desc: 'Website profil modern, cepat, dan ramah smartphone untuk toko, bengkel, resto, klinik, atau jasa lokal.',
      icon: Globe,
      features: ['Ramah Mobile', 'WhatsApp Order Flow', 'Google Maps SEO'],
    },
    {
      title: 'Sistem Kasir (Point of Sale)',
      desc: 'Aplikasi kasir praktis untuk mencatat penjualan harian, scan barcode, cetak nota struk, dan pantau omzet.',
      icon: ShoppingCart,
      features: ['Dukungan Barcode', 'Cetak Struk Thermal', 'Multi Metode Bayar'],
    },
    {
      title: 'Sistem Stok & Inventori',
      desc: 'Pencatatan stok masuk, stok keluar, opname berkala, dan peringatan dini barang yang menipis.',
      icon: Boxes,
      features: ['Riwayat Mutasi Stok', 'Peringatan Stok Menipis', 'Kartu Stok'],
    },
    {
      title: 'Dashboard Manajemen Usaha',
      desc: 'Ringkasan laporan penjualan, laba kotor, dan pengeluaran berkala yang mudah dipahami pemilik usaha.',
      icon: LayoutDashboard,
      features: ['Grafik Penjualan', 'Rekap Harian / Bulanan', 'Ekspor Laporan'],
    },
    {
      title: 'Custom Web Application',
      desc: 'Pengembangan sistem khusus sesuai alur kerja operasional unik bisnis atau instansi sekolah Anda.',
      icon: Code2,
      features: ['Alur Kerja Khusus', 'Manajemen Hak Akses', 'Integrasi Database'],
    },
  ];

  return (
    <section id="digital-solutions" className="pt-20 pb-24 md:pt-28 md:pb-32 bg-white text-slate-900">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Clearly frames this as a modern additional service, not the primary core */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Layanan Tambahan Modern untuk UMKM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-slate-950">
            After Project Digital Solutions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {websiteContent.digital_solutions_intro ||
              'Selain layanan printing dan ATK, After Project juga membantu UMKM dan bisnis membangun solusi digital sederhana sesuai kebutuhan.'}
          </p>
        </div>

        {/* Digital Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {digitalServices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    {svc.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {svc.features.map((ft, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white text-slate-600 border border-slate-200"
                      >
                        {ft}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConsultWhatsApp(svc.title)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Konsultasi {svc.title}</span>
                </button>
              </div>
            );
          })}

          {/* Consultation CTA Banner inside Grid */}
          <div className="rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 text-slate-950 p-6 sm:p-7 flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider inline-block">
                Pendampingan UMKM
              </span>
              <h3 className="text-xl font-extrabold font-heading text-white">
                Punya Alur Usaha Khusus yang Ingin Dipermudah?
              </h3>
              <p className="text-xs text-amber-100 leading-relaxed">
                Kami siap mendengarkan kebutuhan bisnis Anda, tanpa bahasa teknis yang rumit. Sistem dibuat ringkas, tepat guna, dan terjangkau untuk operasional nyata.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleConsultWhatsApp()}
              className="mt-6 w-full py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Konsultasi Project Gratis</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
