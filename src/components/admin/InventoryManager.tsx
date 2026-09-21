import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  Plus,
  History,
  Search,
  Filter,
  X,
  FileSpreadsheet,
  ImagePlus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { StockMovementType, Product } from '../../types';

export const InventoryManager: React.FC = () => {
  const { products, stockMovements, recordStockAdjustment, saveProduct, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'stocks' | 'movements'>('stocks');
  const [searchTerm, setSearchTerm] = useState('');
  const [movementFilter, setMovementFilter] = useState<string>('all');

  // Modal Stock Adjustment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<StockMovementType>('STOCK_IN');
  const [qtyChange, setQtyChange] = useState<number>(10);
  const [notes, setNotes] = useState('');
  const [imageProduct, setImageProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleOpenAdjustment = (prod: Product, defaultType: StockMovementType = 'STOCK_IN') => {
    setSelectedProduct(prod);
    setMovementType(defaultType);
    setQtyChange(defaultType === 'STOCK_IN' ? 20 : 1);
    setNotes(defaultType === 'STOCK_IN' ? 'Restock pasokan supplier' : 'Penyesuaian stok fisik (Opname)');
    setIsModalOpen(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (qtyChange <= 0) {
      addToast('error', 'Jumlah Tidak Valid', 'Masukkan jumlah perubahan stok lebih dari 0.');
      return;
    }

    try {
      recordStockAdjustment(selectedProduct.id, movementType, qtyChange, notes);
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      addToast('error', 'Gagal Menyesuaikan Stok', err.message);
    }
  };

  const handleImageFile = (file?: File) => {
    if (!file || !imageProduct) return;
    if (!file.type.startsWith('image/')) {
      addToast('error', 'File Tidak Valid', 'Pilih file gambar JPG, PNG, WEBP, atau format gambar lain.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast('error', 'Gambar Terlalu Besar', 'Ukuran gambar maksimal 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const saveProductImage = () => {
    if (!imageProduct || !imagePreview) return;
    saveProduct({ ...imageProduct, image: imagePreview });
    setImageProduct(null);
    setImagePreview('');
    addToast('success', 'Gambar Produk Disimpan', 'Gambar disimpan bersama data produk tanpa Firebase Storage.');
  };

  const togglePublicCatalog = (product: Product) => {
    saveProduct({ ...product, show_on_public: product.show_on_public === false });
    addToast('success', 'Katalog Publik Diperbarui', product.show_on_public === false ? 'Produk ditampilkan di website.' : 'Produk disembunyikan dari website.');
  };

  const getProductName = (prodId: string) => {
    const p = products.find((prod) => prod.id === prodId);
    return p ? p.name : 'Produk Terhapus';
  };

  // Filtered Stock Movements
  const filteredMovements = useMemo(() => {
    return stockMovements.filter((m) => {
      const pName = (m.product_name || getProductName(m.product_id)).toLowerCase();
      const matchSearch = pName.includes(searchTerm.toLowerCase()) || (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchType = movementFilter === 'all' || m.type === movementFilter;
      return matchSearch && matchType;
    });
  }, [stockMovements, products, searchTerm, movementFilter]);

  const getMovementBadge = (type: StockMovementType) => {
    switch (type) {
      case 'STOCK_IN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Stok Masuk</span>;
      case 'SALE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Penjualan Kasir</span>;
      case 'ADJUSTMENT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Penyesuaian (Opname)</span>;
      case 'RETURN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">Retur Pembelian</span>;
      case 'DAMAGED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Rusak / Cacat</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Inventori & Kartu Mutasi Stok
          </h2>
          <p className="text-xs text-slate-500">
            Setiap perubahan stok tercatat secara otomatis untuk mencegah selisih barang dan kehilangan fisik.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'stocks'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stok Barang ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'movements'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-600" />
            <span>Riwayat Mutasi ({stockMovements.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'stocks' ? (
        /* STOCKS TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Produk</th>
                  <th className="py-3.5 px-4 text-center">Katalog Public</th>
                  <th className="py-3.5 px-4 text-center">Stok Fisik Saat Ini</th>
                  <th className="py-3.5 px-4 text-center">Batas Minimum</th>
                  <th className="py-3.5 px-4 text-center">Status Inventori</th>
                  <th className="py-3.5 px-4 text-center">Gambar & Mutasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const isOut = p.stock <= 0;
                  const isLow = p.stock <= p.minimum_stock && p.stock > 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <ImagePlus className="w-4 h-4 text-slate-400" />}
                          </div>
                          <div>
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          SKU: {p.sku} • Barcode: {p.barcode}
                        </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button type="button" onClick={() => togglePublicCatalog(p)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10px] font-bold ${p.show_on_public === false ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {p.show_on_public === false ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {p.show_on_public === false ? 'Disembunyikan' : 'Tampil'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-extrabold text-sm text-slate-900">
                          {p.stock} {p.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                        {p.minimum_stock} {p.unit}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isOut ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Habis Total
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            Perlu Restock Segera
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Stok Aman
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button type="button" onClick={() => { setImageProduct(p); setImagePreview(p.image || ''); }} className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors flex items-center gap-1">
                            <ImagePlus className="w-3 h-3" /><span>Gambar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenAdjustment(p, 'STOCK_IN')}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-[11px] border border-emerald-200 transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Restock Masuk</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenAdjustment(p, 'ADJUSTMENT')}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-200 transition-colors"
                          >
                            Koreksi / Rusak
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
      ) : (
        /* STOCK MOVEMENTS LOG VIEW */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama produk di mutasi..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
              />
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={movementFilter}
                onChange={(e) => setMovementFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
              >
                <option value="all">Semua Jenis Mutasi</option>
                <option value="STOCK_IN">Stok Masuk</option>
                <option value="SALE">Penjualan Kasir</option>
                <option value="ADJUSTMENT">Penyesuaian Opname</option>
                <option value="DAMAGED">Barang Rusak</option>
                <option value="RETURN">Retur</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4">Nama Produk</th>
                    <th className="py-3.5 px-4 text-center">Jenis Mutasi</th>
                    <th className="py-3.5 px-4 text-center">Perubahan</th>
                    <th className="py-3.5 px-4 text-center">Sebelum &rarr; Sesudah</th>
                    <th className="py-3.5 px-4">Keterangan / Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMovements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        Belum ada data riwayat mutasi stok.
                      </td>
                    </tr>
                  ) : (
                    filteredMovements.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                          {new Date(m.created_at).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {getProductName(m.product_id)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getMovementBadge(m.type)}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          <span
                            className={
                              m.quantity > 0 && m.type === 'STOCK_IN'
                                ? 'text-emerald-700'
                                : 'text-rose-600'
                            }
                          >
                            {m.type === 'STOCK_IN' ? `+${m.quantity}` : `-${m.quantity}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600">
                          {m.previous_stock} &rarr; <strong>{m.new_stock}</strong>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {m.notes || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {imageProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div><span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Gambar Katalog Public</span><h3 className="font-extrabold text-base text-slate-900">{imageProduct.name}</h3></div>
              <button onClick={() => { setImageProduct(null); setImagePreview(''); }} className="p-1.5 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="aspect-video rounded-2xl bg-slate-50 border border-dashed border-slate-300 overflow-hidden flex items-center justify-center">
                {imagePreview ? <img src={imagePreview} alt="Preview produk" className="w-full h-full object-contain" /> : <div className="text-center text-slate-400"><ImagePlus className="w-8 h-8 mx-auto mb-2" /><span className="text-xs">Belum ada gambar</span></div>}
              </div>
              <label className="block">
                <span className="block text-xs font-bold text-slate-700 mb-1.5">Upload gambar produk (maks. 2 MB)</span>
                <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-bold file:text-slate-700 hover:file:bg-slate-200" />
              </label>
              <p className="text-[11px] text-slate-500">Gambar yang disimpan di Stock otomatis dipakai pada katalog produk website publik.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => { setImageProduct(null); setImagePreview(''); }} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">Batal</button>
                <button disabled={!imagePreview} onClick={saveProductImage} className="px-4 py-2 rounded-xl bg-amber-600 disabled:bg-slate-300 text-white text-xs font-bold">Simpan Gambar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stock In / Adjustment */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Form Mutasi Stok
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Stok Saat Ini:</span>
                <span className="font-mono text-sm font-extrabold text-slate-900">
                  {selectedProduct.stock} {selectedProduct.unit}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jenis Mutasi
                </label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="STOCK_IN">Stok Masuk (Restock Pembelian)</option>
                  <option value="ADJUSTMENT">Penyesuaian Opname Fisik</option>
                  <option value="DAMAGED">Barang Rusak / Cacat</option>
                  <option value="RETURN">Retur ke Supplier</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jumlah Perubahan ({selectedProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={qtyChange}
                  onChange={(e) => setQtyChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan / Keterangan
                </label>
                <input
                  type="text"
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Beli dari Supplier Grosir Jaya"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  Simpan Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
