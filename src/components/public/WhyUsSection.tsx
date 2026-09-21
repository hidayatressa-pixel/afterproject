import React from 'react';
import {
  Zap,
  Receipt,
  PackageCheck,
  Printer,
  MessageCircle,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhyUsSection: React.FC = () => {
  const { websiteContent } = useApp();

  const highlights = [
    {
      title: 'Pelayanan Cepat',
      desc: 'Mesin fotocopy high-speed dan printer laser responsif untuk memangkas waktu tunggu Anda.',
      icon: Zap,
      color: 'amber',
    },
    {
      title: 'Harga Transparan',
      desc: 'Tarif cetak dan fotocopy jelas tanpa biaya tersembunyi, sangat bersahabat untuk pelajar & anggaran kantor.',
      icon: Receipt,
      color: 'blue',
    },
    {
      title: 'Kebutuhan ATK Lengkap',
      desc: 'Tersedia pulpen, buku, kertas rim, map arsip, hingga perlengkapan kantor siap pakai.',
      icon: PackageCheck,
      color: 'emerald',
    },
    {
      title: 'Printing & Fotocopy Presisi',
      desc: 'Hasil cetak tajam, warna akurat, serta opsi bolak-balik (duplex) rapi dan presisi.',
      icon: Printer,
      color: 'purple',
    },
    {
      title: 'Bisa Kirim File via WhatsApp',
      desc: 'Tak perlu antri lama di toko, cukup kirim PDF atau file gambar lewat WA lalu ambil saat siap.',
      icon: MessageCircle,
      color: 'green',
    },
    {
      title: 'Melayani Individu & UMKM',
      desc: 'Menerima fotocopy 1 lembar KTP hingga cetak ribuan proposal, modul sekolah, atau invoice usaha.',
      icon: Users,
      color: 'rose',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Komitmen Layanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Kenapa Memilih AFTER PROJECT?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Dedikasi kami adalah menghadirkan layanan dokumen yang cepat, hasil rapi, dan pelayanan ramah untuk seluruh kalangan.
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-2xs hover:shadow-lg hover:border-amber-300 transition-all duration-200 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20 shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
