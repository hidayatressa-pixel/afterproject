import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactSection: React.FC = () => {
  const { websiteContent, settings, addToast } = useApp();

  const activeWhatsApp = settings.whatsapp || websiteContent.whatsapp_number || '';
  const activePhone = settings.phone || websiteContent.phone_number || '';
  const activeAddress = settings.address || websiteContent.address || '';
  const activeStoreName = settings.store_name || 'AFTER PROJECT';

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('Fotocopy / Print Berkas');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const text =
      `*PESAN DARI WEBSITE - ${activeStoreName.toUpperCase()}*\n\n` +
      `• Nama: ${formName}\n` +
      `• No. Kontak: ${formPhone}\n` +
      `• Perihal: ${formSubject}\n` +
      `• Pesan: ${formMessage}\n\n` +
      `Mohon direspon secepatnya. Terima kasih!`;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
    addToast('success', 'Pesan Diteruskan ke WhatsApp', `Terima kasih telah menghubungi ${activeStoreName}.`);
  };

  const handleDirectWA = () => {
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const msg = encodeURIComponent(`Halo ${activeStoreName}, saya ingin bertanya info layanan atau lokasi toko.`);
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  return (
    <section id="kontak" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            Hubungi Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Lokasi & Kontak AFTER PROJECT
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Kunjungi langsung toko kami untuk fotocopy dan belanja ATK, atau kirimkan file dokumen Anda melalui WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Operating Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Info Cards */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    WhatsApp & Telepon
                  </h4>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {activePhone}
                  </p>
                  <button
                    type="button"
                    onClick={handleDirectWA}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-1"
                  >
                    Chat WhatsApp ({activeWhatsApp}) &rarr;
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-200/70">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Alamat Toko
                  </h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {activeAddress}
                  </p>
                  <p className="text-xs text-slate-500">{websiteContent.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-200/70">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Jam Buka & Operasional
                  </h4>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {websiteContent.business_hours_weekday}
                  </p>
                  <p className="text-xs text-slate-600">
                    {websiteContent.business_hours_weekend}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed Placeholder Frame */}
            <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Peta Lokasi Toko
                </span>
                <a
                  href={websiteContent.maps_embed_url || 'https://maps.google.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-700 hover:text-amber-800 flex items-center gap-1 text-[11px]"
                >
                  Buka Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-52 bg-slate-200 relative flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg mb-2">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  AFTER PROJECT
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                  {activeAddress}{websiteContent.city ? `, ${websiteContent.city}` : ''}
                </p>
                <span className="mt-2 text-[10px] bg-white/90 px-3 py-1 rounded-full text-slate-700 font-mono shadow-2xs">
                  Area Strategis & Mudah Ditemukan
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 font-heading mb-1">
              Kirim Pesan / Permintaan Penawaran
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Punya pertanyaan mengenai cetak buku, pengadaan ATK kantor, atau kebutuhan digital? Kirim formulir ini dan kami akan membalas via WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kebutuhan Layanan
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                >
                  <option>Fotocopy / Print Berkas</option>
                  <option>Pesanan Grosir / Pasokan ATK Kantor</option>
                  <option>Jilid Skripsi / Modul Pelatihan</option>
                  <option>Konsultasi Pembuatan Website Usaha</option>
                  <option>Konsultasi Sistem Kasir / POS & Stok</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pesan / Rincian Kebutuhan
                </label>
                <textarea
                  rows={4}
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Jelaskan kebutuhan dokumen, perkiraan jumlah lembar, atau spesifikasi sistem yang Anda perlukan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Langsung tersambung ke WhatsApp toko
                </p>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
