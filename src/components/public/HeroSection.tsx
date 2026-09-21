import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Copy,
  PenTool,
  FileText,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import heroBannerImg from '../../assets/images/after_project_hero_1790002166570.jpg';
import logoImg from '../../assets/images/after_project_logo_1790002151078.jpg';

export const HeroSection: React.FC = () => {
  const { websiteContent, settings } = useApp();

  const activeWhatsApp = settings?.whatsapp || websiteContent?.whatsapp_number || '081234567890';

  const handleWhatsApp = () => {
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const message = encodeURIComponent(
      'Halo AFTER PROJECT! Saya ingin print / fotocopy dokumen. Bagaimana prosedurnya?'
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="beranda" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-slate-50">
      {/* Background Decorative Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Local Business Badge with Official Emblem */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs">
              <img
                src={logoImg}
                alt="Logo Emblem"
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-sm object-cover"
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900 font-heading">
                {websiteContent.hero_badge || 'Pusat Fotocopy, Print & ATK Terpercaya'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12] font-heading">
              {websiteContent.hero_headline || 'Fotocopy, Printing & ATK Lebih Mudah dalam Satu Tempat.'}
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              {websiteContent.hero_subheadline ||
                'Solusi kebutuhan dokumen, printing, alat tulis dan layanan digital untuk pelajar, masyarakat, UMKM dan bisnis.'}
            </p>

            {/* Premium Capability Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-heading">High-Speed Copy</h4>
                  <p className="text-[11px] text-slate-500">120 ppm Mesin Laser</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Printer className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-heading">Warna & B/W Tajam</h4>
                  <p className="text-[11px] text-slate-500">Kertas 70 - 310 gsm</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <PenTool className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-heading">Stok ATK Komplit</h4>
                  <p className="text-[11px] text-slate-500">Harga Grosir & Eceran</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#layanan"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200"
              >
                <span>Lihat Layanan Utama</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi & Order WA</span>
              </button>

              <a
                href="#kirim-file"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Kirim File & Estimasi</span>
              </a>
            </div>

            {/* Reassurance Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Kirim PDF langsung via WhatsApp
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Jaminan Hasil Rapi & Presisi
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                Layanan Kilat Siap Ditunggu
              </span>
            </div>
          </div>

          {/* Right Column: Studio Showcase Photography & Floating Information Cards */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Studio Showcase Photography Container */}
              <div className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group">
                <div className="relative aspect-16/10 w-full overflow-hidden">
                  <img
                    src={heroBannerImg}
                    alt="AFTER PROJECT Studio Workspace"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Top Badge on Photo */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Studio Cetak & Dokumen Resmi</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider">
                      Grade A Quality
                    </span>
                  </div>

                  {/* Overlay Description at bottom of photo */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <p className="text-xs font-semibold text-slate-200">
                      Didukung mesin laser digital production & kertas premium.
                    </p>
                  </div>
                </div>

                {/* Service Cards below photo */}
                <div className="p-4 sm:p-5 bg-white space-y-2.5">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 hover:bg-amber-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Fotocopy Berkualitas</p>
                        <p className="text-[11px] text-slate-600">A4, F4 Folio, KTP, Bolak-Balik</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-amber-900 block font-heading">Mulai Rp 300</span>
                      <span className="text-[10px] text-slate-500">/ lembar</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/70 hover:bg-blue-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Print Laser & Inkjet</p>
                        <p className="text-[11px] text-slate-600">Hitam Putih & Full Color Tajam</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-blue-900 block font-heading">Mulai Rp 500</span>
                      <span className="text-[10px] text-slate-500">/ lembar</span>
                    </div>
                  </div>

                  {/* Floating Action Banner */}
                  <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">Order Kilat Siap Ditunggu</p>
                        <p className="text-[10px] text-slate-300">File langsung diproses tanpa antre</p>
                      </div>
                    </div>
                    <a
                      href="#kirim-file"
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                    >
                      Kirim File
                    </a>
                  </div>
                </div>
              </div>

              {/* Secondary Digital Service Teaser */}
              <div className="mt-3 p-3 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-600 flex items-center justify-between shadow-2xs">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  Layanan Digital: Pembuatan Website & Aplikasi Kasir UMKM
                </span>
                <a
                  href="#digital-solutions"
                  className="font-bold text-amber-700 hover:text-amber-800 text-[11px] underline ml-2 shrink-0"
                >
                  Pelajari &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

