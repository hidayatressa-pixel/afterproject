import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Save,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Layers,
  ArrowRight,
  ExternalLink,
  Settings,
  CheckCircle2,
} from 'lucide-react';

export const CmsManager: React.FC = () => {
  const { websiteContent, updateWebsiteContent, addToast, setAdminTab, setCurrentView } = useApp();

  const [formData, setFormData] = useState({ ...websiteContent });

  // Sync formData whenever websiteContent updates (e.g. from Settings or background sync)
  useEffect(() => {
    setFormData({ ...websiteContent });
  }, [websiteContent]);

  const handleChange = (field: keyof typeof websiteContent, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateWebsiteContent(formData);
    } catch (err: any) {
      addToast('error', 'Gagal Memperbarui', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Pengelolaan Konten Website (CMS)
          </h2>
          <p className="text-xs text-slate-500">
            Perubahan teks headline, nomor WhatsApp, jam buka, dan alamat langsung tampil di halaman depan website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAdminTab('settings')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-amber-600" />
            <span>Pengaturan Toko & POS</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('public')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span>Cek Website</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Hero & Taglines */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-4 h-4 text-amber-600" />
            <h3 className="font-extrabold text-sm text-slate-900 font-heading">
              Hero Section & Tagline Depan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Badge Status Toko
              </label>
              <input
                type="text"
                value={formData.hero_badge}
                onChange={(e) => handleChange('hero_badge', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headline Utama (Primary Business)
              </label>
              <input
                type="text"
                value={formData.hero_headline}
                onChange={(e) => handleChange('hero_headline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subheadline / Deskripsi Pendukung
            </label>
            <textarea
              rows={2}
              value={formData.hero_subheadline}
              onChange={(e) => handleChange('hero_subheadline', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Contact & Operating Hours */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                Kontak WhatsApp, Telepon & Jam Operasional
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Tersinkronisasi Otomatis ke Pengaturan Toko
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor WhatsApp Toko (Chat Website & Pesanan)
              </label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="6281234567890"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-emerald-700"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Gunakan format nomor (contoh: 081234567890 atau 6281234567890).
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Telepon Tampilan
              </label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jam Buka (Senin - Sabtu)
              </label>
              <input
                type="text"
                value={formData.business_hours_weekday}
                onChange={(e) => handleChange('business_hours_weekday', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jam Buka (Minggu / Libur)
              </label>
              <input
                type="text"
                value={formData.business_hours_weekend}
                onChange={(e) => handleChange('business_hours_weekend', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Fisik Toko
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kota / Wilayah
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Digital Solutions Intro (Secondary) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900 font-heading">
              Digital Solutions (Layanan Sekunder)
            </h3>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Pengantar Solusi Digital
            </label>
            <textarea
              rows={2}
              value={formData.digital_solutions_intro}
              onChange={(e) => handleChange('digital_solutions_intro', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan CMS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
