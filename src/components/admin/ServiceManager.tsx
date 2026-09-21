import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Printer,
  Copy,
  Layers,
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const ServiceManager: React.FC = () => {
  const { services, saveService, toggleServiceActive, addToast, loadDemoData, isDemoMode } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('Fotocopy');
  const [unit, setUnit] = useState('lembar');
  const [cost, setCost] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(350);
  const [description, setDescription] = useState('');

  const handleOpenCreate = () => {
    setEditingService(null);
    setServiceName('');
    setCategory('Fotocopy');
    setUnit('lembar');
    setCost(100);
    setSellingPrice(350);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: ServiceItem) => {
    setEditingService(svc);
    setServiceName(svc.service_name);
    setCategory(svc.category);
    setUnit(svc.unit);
    setCost(svc.cost);
    setSellingPrice(svc.selling_price);
    setDescription(svc.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      addToast('error', 'Validasi Gagal', 'Nama layanan tidak boleh kosong.');
      return;
    }

    try {
      saveService({
        id: editingService ? editingService.id : undefined,
        service_name: serviceName.trim(),
        category: category.trim(),
        unit: unit.trim() || 'lembar',
        cost: cost,
        selling_price: sellingPrice,
        description: description.trim(),
        active: editingService ? editingService.active : true,
      });

      setIsModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Tarif Layanan Fotocopy & Printing
          </h2>
          <p className="text-xs text-slate-500">
            Perubahan tarif di sini otomatis tersinkronisasi ke Kasir POS dan tabel harga di website publik.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Tarif Layanan</span>
        </button>
      </div>

      {/* Services List Table or Empty State */}
      {services.length === 0 ? (
        <EmptyState
          id="empty-admin-services"
          icon={<Printer className="w-8 h-8" />}
          title="Belum ada tarif layanan cetak terdaftar."
          description="Database layanan fotocopy dan cetak masih kosong. Anda dapat menambahkan tarif baru atau memuat data simulasi demo."
          actionText="+ Tambah Layanan Pertama"
          onAction={handleOpenCreate}
          secondaryActionText={!isDemoMode ? 'Muat Data Demo Tarif' : undefined}
          onSecondaryAction={loadDemoData}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Nama Layanan Cetak</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Satuan</th>
                  <th className="py-3.5 px-4 text-right">Modal/HPP</th>
                  <th className="py-3.5 px-4 text-right">Tarif Jual</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {s.service_name}
                      </div>
                      {s.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5 max-w-sm leading-relaxed">
                          {s.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      per {s.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      Rp {s.cost.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700 text-sm">
                      Rp {s.selling_price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleServiceActive(s.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          s.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {s.active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Nonaktif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        title="Ubah Tarif"
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

      {/* Modal Add / Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Tarif Percetakan
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  {editingService ? 'Ubah Tarif Layanan' : 'Tambah Layanan Baru'}
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
                  Nama Layanan
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Contoh: Print Warna HVS A4 (Grafik / Full)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori Layanan
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option>Fotocopy</option>
                    <option>Print B/W</option>
                    <option>Print Warna</option>
                    <option>Laminating</option>
                    <option>Jilid Dokumen</option>
                    <option>Scan Dokumen</option>
                    <option>Cutting / Potong</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="lembar / buku / dokumen"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimasi Modal / HPP (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tarif Jual ke Pelanggan (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold text-amber-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi / Spesifikasi Kertas
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan ketebalan kertas, tinta laser, atau ketentuan bolak-balik..."
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
                  Simpan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
