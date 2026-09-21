import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  MessageCircle,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  PackageX,
  PackageOpen,
  Plus,
} from 'lucide-react';
import { Product } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const ProductCatalog: React.FC = () => {
  const { products, categories, websiteContent, settings, setIsAdminLoginOpen, setAdminTab, setCurrentView, currentUser, loadDemoData } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock'>('all');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  const activeWhatsApp = settings.whatsapp || websiteContent.whatsapp_number || '';

  // Active products only for public catalog
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status === 'active' && p.show_on_public !== false);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      // Search
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory =
        selectedCategory === 'all' || product.category_id === selectedCategory;

      // Stock
      let matchesStock = true;
      if (stockFilter === 'in_stock') {
        matchesStock = product.stock > 0;
      } else if (stockFilter === 'low_stock') {
        matchesStock = product.stock > 0 && product.stock <= product.minimum_stock;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [activeProducts, searchQuery, selectedCategory, stockFilter]);

  const handleOrderWhatsApp = (product: Product) => {
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Halo AFTER PROJECT, saya ingin memesan produk ATK berikut:\n` +
      `• Nama: *${product.name}*\n` +
      `• Kode/SKU: ${product.sku}\n` +
      `• Harga: Rp ${product.selling_price.toLocaleString('id-ID')} / ${product.unit}\n\n` +
      `Apakah stoknya masih tersedia?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'ATK';
  };

  return (
    <section id="katalog-atk" className="pt-20 pb-24 md:pt-28 md:pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            Katalog Produk ATK
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Kebutuhan Alat Tulis & Perlengkapan Kantor
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Cari kebutuhan alat tulis sekolah, kertas, map arsip hingga perlengkapan kantor. Pesan langsung dengan cepat melalui WhatsApp.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 mb-12 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pulpen, kertas HVS, buku, tipe-x..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown (Mobile) / Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">Semua Kategori</option>
                {categories
                  .filter((c) => c.type === 'atk')
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div className="md:col-span-3">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">Semua Status Stok</option>
                <option value="in_stock">Hanya Yang Tersedia</option>
                <option value="low_stock">Stok Menipis</option>
              </select>
            </div>
          </div>

          {/* Quick Category Chips for Desktop/Tablet */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            {categories
              .filter((c) => c.type === 'atk')
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>

        {/* Product Cards Grid or Empty State */}
        {activeProducts.length === 0 ? (
          /* Empty State when Database is clean / initially empty */
          <div className="max-w-xl mx-auto">
            <EmptyState
              id="empty-products"
              title="Belum ada produk dalam katalog."
              description="Database produk saat ini masih bersih (Production Mode). Anda dapat menambahkan produk melalui menu Admin atau memuat data sampel demo."
              actionText={currentUser ? '+ Tambah Produk' : 'Login Admin untuk Tambah'}
              onAction={() => {
                if (currentUser) {
                  setCurrentView('admin');
                  setAdminTab('products');
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              secondaryActionText="Muat Data Demo ATK"
              onSecondaryAction={loadDemoData}
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="max-w-md mx-auto py-8">
            <EmptyState
              id="empty-filtered-products"
              title="Tidak ada produk yang cocok."
              description="Coba ubah kata kunci pencarian atau sesuaikan filter kategori dan stok Anda."
              actionText="Reset Filter"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStockFilter('all');
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= product.minimum_stock;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className="rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-200 group"
                >
                  <div>
                    {/* Visual Product Placeholder / Image Area */}
                    <div className="w-full h-40 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 border border-slate-200/60 mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-50/50 transition-colors">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors">
                          <PackageOpen className="w-10 h-10 stroke-[1.5]" />
                          <span className="text-[10px] font-mono mt-1 font-semibold text-slate-500">{product.sku}</span>
                        </div>
                      )}

                      {/* Stock Status Badge */}
                      <div className="absolute top-2.5 right-2.5">
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Habis
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Sisa {product.stock} {product.unit}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Tersedia
                          </span>
                        )}
                      </div>

                      {/* Category Pill */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 text-slate-700 backdrop-blur-xs shadow-2xs border border-slate-200/80">
                          {getCategoryName(product.category_id)}
                        </span>
                      </div>
                    </div>

                    {/* Product Name & Description */}
                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors mb-1.5 font-heading">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {product.description || 'Alat tulis dan kebutuhan dokumen berkualitas.'}
                    </p>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-500">Harga:</span>
                        <div className="text-base font-extrabold text-slate-900">
                          Rp {product.selling_price.toLocaleString('id-ID')}
                          <span className="text-xs font-medium text-slate-500 ml-1">
                            / {product.unit}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Stok: <strong className="text-slate-800">{product.stock}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProductDetail(product)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleOrderWhatsApp(product)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Pesan WA</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600">
                  {getCategoryName(selectedProductDetail.category_id)}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                  Detail Produk
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="w-full h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex flex-col items-center justify-center text-slate-400">
                {selectedProductDetail.image ? <img src={selectedProductDetail.image} alt={selectedProductDetail.name} className="w-full h-full object-contain" /> : <><PackageOpen className="w-12 h-12 stroke-1" /><span className="text-xs font-mono mt-2 font-bold text-slate-600">Barcode: {selectedProductDetail.barcode}</span></>}
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {selectedProductDetail.name}
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  SKU: {selectedProductDetail.sku}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedProductDetail.description || 'Tidak ada keterangan tambahan.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Harga Satuan:</span>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    Rp {selectedProductDetail.selling_price.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      / {selectedProductDetail.unit}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Status Stok:</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedProductDetail.stock > 0
                      ? `${selectedProductDetail.stock} ${selectedProductDetail.unit} siap`
                      : 'Stok Habis'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProductDetail;
                    setSelectedProductDetail(null);
                    handleOrderWhatsApp(prod);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pesan via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
