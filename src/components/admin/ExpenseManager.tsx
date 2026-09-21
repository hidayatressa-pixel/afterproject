import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  X,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const ExpenseManager: React.FC = () => {
  const { expenses, saveExpense, deleteExpense, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState<ExpenseCategory>('Kertas');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(50000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const categoriesList: ExpenseCategory[] = [
    'Kertas',
    'Toner & Tinta',
    'Listrik & Utilitas',
    'Sewa Tempat',
    'Perawatan Mesin',
    'Kulakan ATK',
    'Operasional',
    'Lainnya',
  ];

  const handleOpenCreate = () => {
    setCategory('Kertas');
    setDescription('');
    setAmount(100000);
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      addToast('error', 'Validasi Gagal', 'Keterangan pengeluaran tidak boleh kosong.');
      return;
    }
    if (amount <= 0) {
      addToast('error', 'Nominal Tidak Valid', 'Nominal pengeluaran harus lebih besar dari Rp 0.');
      return;
    }

    try {
      saveExpense({
        category,
        description: description.trim(),
        amount,
        date,
        notes: notes.trim(),
      });
      setIsModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Gagal Mencatat', err.message);
    }
  };

  const handleDelete = (exp: Expense) => {
    if (confirm(`Hapus catatan pengeluaran "${exp.description}" sebesar Rp ${exp.amount.toLocaleString('id-ID')}?`)) {
      deleteExpense(exp.id);
    }
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        e.description.toLowerCase().includes(term) ||
        (e.notes && e.notes.toLowerCase().includes(term));
      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [expenses, searchTerm, selectedCategory]);

  const totalFilteredExpense = useMemo(() => {
    return filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Pencatatan Beban & Pengeluaran Toko
          </h2>
          <p className="text-xs text-slate-500">
            Total beban pada filter:{' '}
            <strong className="text-rose-600 font-bold">
              Rp {totalFilteredExpense.toLocaleString('id-ID')}
            </strong>{' '}
            ({filteredExpenses.length} catatan)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Pengeluaran Baru</span>
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
              placeholder="Cari pembelian kertas, toner, servis mesin..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Kategori Pengeluaran</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table or Empty State */}
      {expenses.length === 0 ? (
        <EmptyState
          id="empty-admin-expenses"
          icon={<Wallet className="w-8 h-8" />}
          title="Belum ada catatan pengeluaran operasional."
          description="Catat biaya pembelian kertas, isi toner printer, listrik toko, atau biaya sewa untuk menghitung estimasi laba bersih secara akurat."
          actionText="+ Catat Pengeluaran Pertama"
          onAction={handleOpenCreate}
        />
      ) : filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Tidak ada data pengeluaran yang sesuai dengan filter.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Kategori Beban</th>
                  <th className="py-3.5 px-4">Keterangan Pengeluaran</th>
                  <th className="py-3.5 px-4 text-right">Nominal (Rp)</th>
                  <th className="py-3.5 px-4">Catatan / Bukti</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {exp.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {exp.description}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-rose-700 text-sm">
                      Rp {exp.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {exp.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(exp)}
                        title="Hapus Catatan"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Form Beban Usaha
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  Catat Pengeluaran Operasional
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan Pengeluaran
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Beli Kertas HVS 5 Rim SiDU A4"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nominal Pengeluaran (Rp)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-base font-extrabold text-rose-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Tambahan / Nomor Nota
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Nota toko kertas #9842"
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
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-xs"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
