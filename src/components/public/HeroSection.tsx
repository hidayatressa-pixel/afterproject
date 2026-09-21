import React from 'react';
import { ArrowRight, MessageCircle, FileText, Check, Package, Printer, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import heroBannerImg from '../../assets/images/after_project_hero_1790002166570.jpg';

export const HeroSection: React.FC = () => {
  const { websiteContent, settings } = useApp();
  const whatsapp = settings.whatsapp || websiteContent.whatsapp_number || '';

  const chat = () => {
    const number = whatsapp.replace(/\D/g, '');
    if (!number) return;
    const text = encodeURIComponent('Halo AFTER PROJECT, saya ingin bertanya tentang layanan Anda.');
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <section id="beranda" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_10%,rgba(245,158,11,.12),transparent_28%),radial-gradient(circle_at_10%_80%,rgba(15,23,42,.06),transparent_25%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {websiteContent.hero_badge || 'Fotocopy • Printing • ATK • Digital'}
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] leading-[1.03] text-slate-950">
              {websiteContent.hero_headline || 'Semua kebutuhan dokumen dan usaha, lebih sederhana.'}
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-slate-600">
              {websiteContent.hero_subheadline || 'Fotocopy, print, ATK dan solusi digital dalam satu tempat. Cepat, jelas, dan mudah dihubungi.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={chat} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition">
                <MessageCircle className="w-4 h-4" /> Hubungi via WhatsApp
              </button>
              <a href="#layanan" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 transition">
                Lihat layanan <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-3 max-w-xl">
              {[
                [Printer, 'Print & Copy', 'Dokumen harian'],
                [Package, 'ATK', 'Stok langsung'],
                [Sparkles, 'Digital', 'Website & sistem'],
              ].map(([Icon, title, desc]: any) => (
                <a key={title} href={title === 'Digital' ? '#digital-solutions' : '#layanan'} className="group rounded-2xl border border-slate-200 p-4 hover:border-slate-400 hover:-translate-y-0.5 transition">
                  <Icon className="w-5 h-5 text-slate-900" />
                  <div className="mt-3 text-sm font-extrabold text-slate-900">{title}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{desc}</div>
                </a>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Harga transparan</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Bisa kirim file</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Order via WhatsApp</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-200/70">
              <img src={heroBannerImg} alt="After Project" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 sm:left-8 sm:right-auto sm:w-80 rounded-2xl border border-white/80 bg-white/95 backdrop-blur p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><FileText className="w-5 h-5 text-amber-700" /></div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Kirim file, datang tinggal ambil.</div>
                  <a href="#kirim-file" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-700">Mulai pesanan <ArrowRight className="w-3 h-3" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
