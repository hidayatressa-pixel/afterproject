import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Archive,
  ArchiveRestore,
  Filter,
  X,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  PackageOpen,
} from 'lucide-react';
import { Product } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const ProductManager: React.FC = () => {
  const { products, categories, saveProduct, archiveProduct, restoreProduct, addToast, loadDemoData, isDemoMode } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [minimumStock, setMinimumStock] = useState<number>(5);
  const [unit, setUnit] = useState('pcs');
  const [description, setDescription] = useState('');

  // Open Create Modal
  const handleOpenCreate = () => {
    const defaultCat = categories.find((c) => c.type === 'atk');
    const autoSku = `ATK-${Date.now().toString().slice(-4)}`;
    setEditingProduct(null);
    setName('');
    setSku(autoSku);
    setBarcode(Date.now().toString().slice(-10));
    setCategoryId(defaultCat ? defaultCat.id : 'cat-tulis');
    setPurchasePrice(1000);
    setSellingPrice(2500);
    setStock(10);
    setMinimumStock(5);
    setUnit('pcs');
    setDescription('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSku(prod.sku);
    setBarcode(prod.barcode);
    setCategoryId(prod.category_id);
    setPurchasePrice(prod.purchase_price);
    setSellingPrice(prod.selling_price);
    setStock(prod.stock);
    setMinimumStock(prod.minimum_stock);
    setUnit(prod.unit);
    setDescription(prod.description || '');
    setIsModalOpen(true);
  };

  // Save Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('error', 'Validasi Gagal', 'Nama produk tidak boleh kosong.');
      return;
    }

    try {
      saveProduct({
        id: editingProduct ? editingProduct.id : undefined,
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim(),
        category_id: categoryId,
        purchase_price: purchasePrice,
        selling_price: sellingPrice,
        stock: stock,
        minimum_stock: minimumStock,
        unit: unit.trim() || 'pcs',
        description: description.trim(),
        status: editingProduct ? editingProduct.status : 'active',
      });

      setIsModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan', err.message);
    }
  };

  // Archive / Restore
  const handleToggleArchive = (prod: Product) => {
    if (prod.status === 'active') {
      if (confirm(`Arsipkan produk "${prod.name}"? Produk tidak akan muncul di kasir dan katalog publik, namun riwayat transaksi tetap aman.`)) {
        archiveProduct(prod.id);
      }
    } else {
      restoreProduct(prod.id);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.barcode.toLowerCase().includes(term);

      const matchCat = selectedCategory === 'all' || p.category_id === selectedCategory;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, statusFilter]);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'ATK';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Manajemen Produk ATK & Inventori
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data stok kertas, pulpen, buku, dan arsip dengan aman.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama barang, SKU, barcode..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="active">Status: Aktif Saja</option>
              <option value="archived">Status: Diarsipkan</option>
              <option value="all">Status: Semua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table or Empty State */}
      {products.length === 0 ? (
        <EmptyState
          id="empty-admin-products"
          icon={<PackageOpen className="w-8 h-8" />}
          title="Belum ada produk terdaftar."
          description="Database produk masih kosong dalam mode produksi. Silakan tambahkan produk baru atau muat data simulasi demo toko."
          actionText="+ Tambah Produk Pertama"
          onAction={handleOpenCreate}
          secondaryActionText={!isDemoMode ? 'Muat Data Demo ATK' : undefined}
          onSecondaryAction={loadDemoData}
        />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Tidak ada produk yang sesuai dengan filter pencarian Anda.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Info Produk & SKU</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4 text-right">Harga Beli</th>
                  <th className="py-3.5 px-4 text-right">Harga Jual</th>
                  <th className="py-3.5 px-4 text-center">Stok / Min</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minimum_stock && p.stock > 0;
                  const isOut = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                          <span>SKU: {p.sku}</span>
                          <span>•</span>
                          <span>Barcode: {p.barcode}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {getCategoryName(p.category_id)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        Rp {p.purchase_price.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        Rp {p.selling_price.toLocaleString('id-ID')}
                        <span className="text-[10px] text-slate-500 font-normal ml-1">
                          /{p.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-slate-800'
                          }`}
                        >
                          {p.stock} {p.unit}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Min: {p.minimum_stock}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {p.status === 'active' ? 'Aktif' : 'Arsip'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Produk"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleArchive(p)}
                            title={p.status === 'active' ? 'Arsipkan' : 'Aktifkan Kembali'}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            {p.status === 'active' ? (
                              <Archive className="w-3.5 h-3.5 text-rose-600" />
                            ) : (
                              <ArchiveRestore className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Form Inventori
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  {editingProduct ? 'Edit Data Produk' : 'Tambah Produk ATK Baru'}
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
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kertas HVS SiDU A4 75gsm (1 Rim)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    SKU (Kode Barang)
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Satuan (Unit)
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="pcs / rim / pack / box"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Harga Modal / Beli (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Harga Jual Kasir (Rp)
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jumlah Stok Sekarang
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Batas Minimum Stok
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minimumStock}
                    onChange={(e) => setMinimumStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan warna, ukuran, atau spesifikasi khusus..."
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
