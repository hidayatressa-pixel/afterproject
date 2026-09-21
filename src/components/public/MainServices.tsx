import React from 'react';
import { Copy, Printer, PenTool, FileCheck, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MainServices: React.FC = () => {
  const { websiteContent } = useApp();

  const handleOrderWhatsApp = (serviceName: string) => {
    const cleanNumber = websiteContent.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(`Halo AFTER PROJECT, saya ingin menggunakan layanan: *${serviceName}*.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const servicesList = [
    {
      id: 'srv-copy',
      title: 'FOTOCOPY',
      subtitle: 'Cepat, Rapi & Tajam',
      tag: 'Mulai Rp 350 / lbr',
      icon: Copy,
      color: 'amber',
      accentBg: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      badgeBg: 'bg-amber-100 text-amber-900',
      items: [
        'Fotocopy A4 (70 & 75 Gsm)',
        'Fotocopy F4 / Folio',
        'Fotocopy A3 Format Besar',
        'Fotocopy KTP / SIM (Rapi & Sejajar)',
        'Fotocopy Dokumen & Proposal',
        'Fotocopy Bolak-Balik (Duplex)',
      ],
      description: 'Menggunakan mesin digital multi-fungsi berkecepatan tinggi dengan kontras tajam.',
    },
    {
      id: 'srv-print',
      title: 'PRINTING',
      subtitle: 'B/W & Full Color',
      tag: 'Laser & Inkjet',
      icon: Printer,
      color: 'blue',
      accentBg: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      badgeBg: 'bg-blue-100 text-blue-900',
      items: [
        'Print Hitam Putih (Laser Tajam)',
        'Print Warna Jernih & Akurat',
        'Cetak Tugas Sekolah & Kuliah',
        'Cetak Skripsi & Makalah Rapi',
        'Surat Resmi, Invoice & Berkas',
        'Cetak File PDF, Word, Excel & Foto',
      ],
      description: 'Dukungan kirim file via WhatsApp atau Flashdisk, siap cetak tanpa harus antri lama.',
    },
    {
      id: 'srv-atk',
      title: 'ATK LENGKAP',
      subtitle: 'Alat Tulis Sekolah & Kantor',
      tag: 'Stok Terjamin',
      icon: PenTool,
      color: 'emerald',
      accentBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      badgeBg: 'bg-emerald-100 text-emerald-900',
      items: [
        'Pulpen (Standard, Gel, Boxy, Spidol)',
        'Pensil 2B Ujian & Penghapus Dust-Free',
        'Buku Tulis, Buku Kas & Kuitansi',
        'Kertas HVS A4, F4, Folio Bergaris',
        'Map Snelhecter, Stopmap, Binder',
        'Tipe-X, Lem, Gunting, Stapler & Klip',
      ],
      description: 'Koleksi ATK harian lengkap dengan harga eceran maupun grosir untuk kantor dan sekolah.',
    },
    {
      id: 'srv-finishing',
      title: 'DOCUMENT SERVICES',
      subtitle: 'Finishing & Perlindungan Berkas',
      tag: 'Solusi Dokumen',
      icon: FileCheck,
      color: 'purple',
      accentBg: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      badgeBg: 'bg-purple-100 text-purple-900',
      items: [
        'Scan Dokumen ke PDF / Foto High-Res',
        'Laminating Panas Anti-Air (A4 & F4)',
        'Cutting / Pemotongan Kertas Presisi',
        'Jilid Lakban & Mika Transparan',
        'Jilid Spiral Kawat & Plastik',
        'Document Preparation & Merging Berkas',
      ],
      description: 'Layanan finishing profesional untuk memastikan dokumen penting Anda terlindungi dan rapi.',
    },
  ];

  return (
    <section id="layanan" className="py-16 md:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Layanan Utama Toko
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Layanan Lengkap Fotocopy, Print & ATK
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Semua kebutuhan dokumen, fotocopy, alat tulis sekolah hingga perlengkapan administrasi kantor dilayani dengan cepat, rapi, dan transparan.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="group relative rounded-3xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 p-6 flex flex-col justify-between shadow-2xs hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${svc.accentBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${svc.badgeBg}`}>
                      {svc.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                    {svc.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    {svc.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-5 pb-4 border-b border-slate-200/80">
                    {svc.description}
                  </p>

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 mb-6">
                    {svc.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <button
                  type="button"
                  onClick={() => handleOrderWhatsApp(svc.title)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white hover:bg-amber-600 hover:text-white text-slate-800 text-xs font-bold border border-slate-200 group-hover:border-amber-600 flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Pesan / Tanya Layanan</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Info Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="text-center md:text-left space-y-1">
            <h4 className="text-xl font-extrabold font-heading text-white">
              Punya dokumen mendadak atau butuh fotocopy jumlah banyak?
            </h4>
            <p className="text-sm font-medium text-amber-100">
              Kirim softcopy Anda via WhatsApp sekarang, kami siapkan dan cetak langsung.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#kirim-file"
              className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shadow-sm transition-colors"
            >
              Lihat Alur Kirim File
            </a>
            <a
              href="#daftar-harga"
              className="px-5 py-3 rounded-xl bg-amber-900 text-white font-bold text-xs hover:bg-amber-950 transition-colors"
            >
              Cek Daftar Tarif
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
