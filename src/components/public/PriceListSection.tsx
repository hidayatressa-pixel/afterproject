import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Tag,
  CheckCircle,
  HelpCircle,
  MessageCircle,
  Plus,
  Printer,
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const PriceListSection: React.FC = () => {
  const { services, websiteContent, currentUser, setCurrentView, setAdminTab, setIsAdminLoginOpen, loadDemoData } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter only active services
  const activeServices = useMemo(() => {
    return services.filter((s) => s.active);
  }, [services]);

  // Extract unique categories from actual database records
  const serviceCategories = useMemo(() => {
    const set = new Set<string>();
    activeServices.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [activeServices]);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return activeServices;
    return activeServices.filter((s) => s.category === activeCategory);
  }, [activeServices, activeCategory]);

  const handleOrderWhatsApp = (serviceName: string, price: number, unit: string) => {
    const cleanNumber = websiteContent.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Halo AFTER PROJECT, saya ingin menanyakan / memesan layanan:\n` +
      `• Layanan: *${serviceName}*\n` +
      `• Tarif: Rp ${price.toLocaleString('id-ID')} / ${unit}\n\n` +
      `Apakah bisa langsung dikerjakan?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="daftar-harga" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
            Transparan & Terjangkau
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Daftar Tarif Cetak & Fotocopy
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Tarif resmi dan jelas untuk setiap lembar fotocopy, print dokumen, laminating, hingga scan. Cocok untuk kantong pelajar, masyarakat, maupun anggaran UMKM.
          </p>
        </div>

        {/* Dynamic Category Tabs if services exist */}
        {serviceCategories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Layanan ({activeServices.length})
            </button>
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Pricing Content */}
        {activeServices.length === 0 ? (
          <div className="max-w-xl mx-auto">
            <EmptyState
              id="empty-services"
              icon={<Printer className="w-7 h-7" />}
              title="Belum ada daftar tarif layanan."
              description="Tarif layanan fotocopy dan cetak belum diinput pada database produksi. Anda dapat menambahkannya melalui dashboard Admin atau memuat data demo."
              actionText={currentUser ? '+ Tambah Tarif Layanan' : 'Login Admin'}
              onAction={() => {
                if (currentUser) {
                  setCurrentView('admin');
                  setAdminTab('services');
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              secondaryActionText="Muat Data Demo Tarif"
              onSecondaryAction={loadDemoData}
            />
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs">
            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-4 px-6">Nama Layanan & Spesifikasi</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Satuan</th>
                    <th className="py-4 px-6 text-right">Tarif</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredServices.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {service.service_name}
                        </div>
                        {service.description && (
                          <div className="text-xs text-slate-500 mt-0.5 max-w-lg leading-relaxed">
                            {service.description}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        per {service.unit}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-base font-extrabold text-slate-900 font-heading">
                          Rp {service.selling_price.toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleOrderWhatsApp(
                              service.service_name,
                              service.selling_price,
                              service.unit
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Pesan</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing Notes */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Catatan:</strong> Untuk pesanan fotocopy modul atau berkas dalam jumlah banyak (di atas 500 lembar), hubungi kami untuk penawaran harga khusus partai/sekolah.
            </span>
          </div>
          <a
            href="#kontak"
            className="font-bold text-amber-700 hover:text-amber-800 underline shrink-0"
          >
            Konsultasi Harga Partai &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
