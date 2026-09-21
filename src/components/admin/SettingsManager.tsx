import React, { useState, useEffect } from 'react';
import { Save, Printer, ShieldCheck, CreditCard, Globe, ExternalLink, MessageCircle, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const {
    settings,
    updateSettings,
    addToast,
    setAdminTab,
    setCurrentView,
  } = useApp();

  const [storeName, setStoreName] = useState(settings.store_name);
  const [mainTagline, setMainTagline] = useState(settings.main_tagline);
  const [subTagline, setSubTagline] = useState(settings.sub_tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [qrisMerchantName, setQrisMerchantName] = useState(settings.qris_merchant_name);
  const [bankName, setBankName] = useState(settings.bank_name);
  const [bankAccountNumber, setBankAccountNumber] = useState(settings.bank_account_number);
  const [bankAccountHolder, setBankAccountHolder] = useState(settings.bank_account_holder);
  const [receiptFooterNote, setReceiptFooterNote] = useState(settings.receipt_footer_note);

  // Keep form in sync if settings update in background or mode changes
  useEffect(() => {
    setStoreName(settings.store_name || '');
    setMainTagline(settings.main_tagline || '');
    setSubTagline(settings.sub_tagline || '');
    setAddress(settings.address || '');
    setPhone(settings.phone || '');
    setWhatsapp(settings.whatsapp || '');
    setQrisMerchantName(settings.qris_merchant_name || '');
    setBankName(settings.bank_name || '');
    setBankAccountNumber(settings.bank_account_number || '');
    setBankAccountHolder(settings.bank_account_holder || '');
    setReceiptFooterNote(settings.receipt_footer_note || '');
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateSettings({
        store_name: storeName.trim(),
        main_tagline: mainTagline.trim(),
        sub_tagline: subTagline.trim(),
        address: address.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        qris_merchant_name: qrisMerchantName.trim(),
        bank_name: bankName.trim(),
        bank_account_number: bankAccountNumber.trim(),
        bank_account_holder: bankAccountHolder.trim(),
        receipt_footer_note: receiptFooterNote.trim(),
      });
    } catch (err: any) {
      addToast('error', 'Gagal Memperbarui Pengaturan', err.message);
    }
  };



  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Pengaturan Toko
          </h2>
          <p className="text-xs text-slate-500">
            Kelola identitas toko, kontak publik, struk, dan informasi pembayaran.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi</span>
        </button>
      </div>

      {/* Info Banner: Dual Contact Management & Live Sync */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 rounded-2xl border border-amber-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                Sinkronisasi Otomatis Aktif
              </span>
              <span className="text-xs font-extrabold text-slate-800 font-heading">
                Kontak Toko & Website Publik Terhubung
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Nomor WhatsApp, Telepon, dan Alamat Toko yang Anda simpan di halaman ini <strong>otomatis langsung terhubung ke Halaman Depan Website Publik</strong> (tombol chat WhatsApp navbar, form kirim berkas, pemesanan ATK, bagian kontak, dan footer).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAdminTab('cms')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-sm transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Buka Tab Konten Website (CMS)</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('public')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Cek Website Publik</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Store & Receipt Settings */}
      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                Identitas Toko, Struk Kasir & Kontak Utama
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Otomatis dipakai di Struk Nota & Seluruh Website
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Toko (Brand / Usaha)
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tagline Utama
              </label>
              <input
                type="text"
                required
                value={mainTagline}
                onChange={(e) => setMainTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tagline Pendukung
              </label>
              <input
                type="text"
                value={subTagline}
                onChange={(e) => setSubTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor WhatsApp Toko (Tombol Chat Website & Nota)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="081234567890 atau 6281234567890"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
                />
                <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Terhubung ke tombol Chat WA di Beranda, Navbar, Pemesanan ATK, Cetak Berkas, dan Footer.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Telepon Toko (Tampilan Kontak Website & Nota)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Ditampilkan pada bagian Kontak dan header/footer struk kasir.
              </p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Toko Lengkap (Website & Struk)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Raya Utama No. 45, Kecamatan..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-2.5 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Alamat fisik toko yang tampil di footer website dan informasi kontak pengunjung.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pesan Footer Struk (Catatan Penutup Nota)
            </label>
            <textarea
              rows={2}
              required
              value={receiptFooterNote}
              onChange={(e) => setReceiptFooterNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Bank and QRIS Payment Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900 font-heading">
              Informasi Pembayaran QRIS & Transfer Bank
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Merchant QRIS
              </label>
              <input
                type="text"
                value={qrisMerchantName}
                onChange={(e) => setQrisMerchantName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Bank Transfer
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Rekening Bank
              </label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Pemilik Rekening (Atas Nama)
              </label>
              <input
                type="text"
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Roles and System Info */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900 font-heading">
              Peran Akun Pengguna (RBAC)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-sm">ADMINISTRATOR / OWNER</span>
              <p className="text-[11px] text-slate-500 mt-1">
                Akses penuh ke semua modul: Kasir POS, Inventori & Mutasi Stok, Laporan Keuangan, Pengaturan Toko, dan CMS Website.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-sm">KASIR (OPERATOR POS)</span>
              <p className="text-[11px] text-slate-500 mt-1">
                Fokus pada transaksi kasir cepat produk ATK & layanan cetak, input pembayaran CASH/QRIS/TRANSFER, dan cetak struk nota pelanggan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
