import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Copy,
  PenTool,
  Lock,
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  const { websiteContent, settings, setIsAdminLoginOpen, currentUser, setCurrentView } = useApp();

  const activeAddress = settings?.address || websiteContent?.address || 'Jl. Raya Utama No. 45';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" showSubtitle={true} />

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Solusi kebutuhan dokumen, fotocopy digital, pencetakan tugas & skripsi, perlengkapan ATK kantor, serta pengembangan sistem digital sederhana untuk UMKM.
            </p>

            <div className="pt-2 text-slate-500 text-[11px] space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {activeAddress}, {websiteContent.city}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {websiteContent.business_hours_weekday}
              </p>
            </div>
          </div>

          {/* Col 2: Layanan Dokumen */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider font-heading">
              Layanan Cetak
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#layanan" className="hover:text-amber-400 transition-colors">
                  Fotocopy A4 / F4 / KTP
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-amber-400 transition-colors">
                  Print Hitam Putih Laser
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-amber-400 transition-colors">
                  Print Full Color & Gambar
                </a>
              </li>
              <li>
                <a href="#kirim-file" className="hover:text-amber-400 transition-colors">
                  Kirim File via WhatsApp
                </a>
              </li>
              <li>
                <a href="#daftar-harga" className="hover:text-amber-400 transition-colors">
                  Laminating & Jilid
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Produk & Digital */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider font-heading">
              Produk & Sistem
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#katalog-atk" className="hover:text-amber-400 transition-colors">
                  Katalog Alat Tulis (ATK)
                </a>
              </li>
              <li>
                <a href="#katalog-atk" className="hover:text-amber-400 transition-colors">
                  Kertas HVS Rim A4 & F4
                </a>
              </li>
              <li>
                <a href="#katalog-atk" className="hover:text-amber-400 transition-colors">
                  Map & Perlengkapan Arsip
                </a>
              </li>
              <li>
                <a href="#digital-solutions" className="hover:text-amber-400 transition-colors">
                  Website Usaha UMKM
                </a>
              </li>
              <li>
                <a href="#digital-solutions" className="hover:text-amber-400 transition-colors">
                  Sistem Kasir & Stok
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Akses Khusus Kasir & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider font-heading">
              Internal Toko
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Area khusus staf untuk kasir POS, manajemen stok, dan laporan keuangan toko.
            </p>

            <div className="pt-1">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => setCurrentView('admin')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buka Dashboard Kasir</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Masuk Kasir / Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} <strong>AFTER PROJECT</strong>. Hak cipta dilindungi.
          </p>
          <p className="text-slate-400">
            {settings.sub_tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};
