import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Phone,
  Building,
  GraduationCap,
  Store,
  UserCheck,
  Edit2,
  X,
} from 'lucide-react';
import { Customer, CustomerType } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const CustomerManager: React.FC = () => {
  const { customers, saveCustomer, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('GENERAL');
  const [notes, setNotes] = useState('');

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setWhatsapp('');
    setAddress('');
    setCustomerType('GENERAL');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone || '');
    setWhatsapp(c.whatsapp || '');
    setAddress(c.address || '');
    setCustomerType(c.customer_type);
    setNotes(c.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('error', 'Validasi Gagal', 'Nama pelanggan tidak boleh kosong.');
      return;
    }

    try {
      saveCustomer({
        id: editingCustomer ? editingCustomer.id : undefined,
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        address: address.trim(),
        customer_type: customerType,
        notes: notes.trim(),
      });
      setIsModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan Pelanggan', err.message);
    }
  };

  const handleOpenWA = (waNum: string) => {
    const clean = waNum.replace(/\D/g, '');
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(term) ||
      (c.phone && c.phone.includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term));
    const matchType =
      typeFilter === 'all' ||
      c.customer_type.toLowerCase() === typeFilter.toLowerCase();
    return matchSearch && matchType;
  });

  const getBadgeType = (type: CustomerType) => {
    switch (type) {
      case 'STUDENT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Pelajar / Mahasiswa</span>;
      case 'SCHOOL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Sekolah / Instansi</span>;
      case 'UMKM':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">UMKM Lokal</span>;
      case 'COMPANY':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">Perusahaan</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Umum</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Data Pelanggan & Mitra Langganan
          </h2>
          <p className="text-xs text-slate-500">
            Daftar pelanggan tetap fotocopy, pesanan modul sekolah, dan supply ATK kantor.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama pelanggan, nomor telepon, atau instansi..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Tipe Pelanggan</option>
              <option value="general">Umum</option>
              <option value="student">Pelajar / Mahasiswa</option>
              <option value="school">Sekolah / Yayasan</option>
              <option value="umkm">UMKM Lokal</option>
              <option value="company">Perusahaan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table or Empty State */}
      {customers.length === 0 ? (
        <EmptyState
          id="empty-admin-customers"
          icon={<Users className="w-8 h-8" />}
          title="Belum ada data pelanggan tercatat."
          description="Anda dapat mendaftarkan pelanggan tetap seperti sekolah, kantor, atau UMKM untuk mempermudah pencatatan nota dan penawaran khusus."
          actionText="+ Daftarkan Pelanggan"
          onAction={handleOpenCreate}
        />
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Tidak ada pelanggan yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Nama Pelanggan</th>
                  <th className="py-3.5 px-4">Kategori / Tipe</th>
                  <th className="py-3.5 px-4">Kontak WhatsApp</th>
                  <th className="py-3.5 px-4">Alamat / Wilayah</th>
                  <th className="py-3.5 px-4">Catatan Khusus</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4">
                      {getBadgeType(c.customer_type)}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.whatsapp || c.phone ? (
                        <button
                          type="button"
                          onClick={() => handleOpenWA(c.whatsapp || c.phone || '')}
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{c.whatsapp || c.phone}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {c.address || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {c.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Data Mitra
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Pelanggan / Instansi
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: SMA Negeri 1 / Bapak Hendra"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipe Pelanggan
                  </label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="GENERAL">Umum (Walk-in)</option>
                    <option value="STUDENT">Pelajar / Mahasiswa</option>
                    <option value="SCHOOL">Sekolah / Instansi</option>
                    <option value="UMKM">UMKM Lokal</option>
                    <option value="COMPANY">Perusahaan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / No. HP
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setWhatsapp(e.target.value);
                    }}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat / Lokasi
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat kantor, sekolah, atau rumah..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Khusus (Tarif khusus, tempo bayar, dll.)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Langganan cetak soal ujian semester, diskon 5%"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-xs"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
