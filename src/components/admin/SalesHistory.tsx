import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Search,
  Printer,
  Eye,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Sale } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const SalesHistory: React.FC = () => {
  const { sales, setActiveReceiptSale, setAdminTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);

  // Filtered sales
  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return sales.filter((s) => {
      // Search
      const term = searchTerm.toLowerCase();
      const matchSearch =
        s.invoice_number.toLowerCase().includes(term) ||
        (s.customer_name && s.customer_name.toLowerCase().includes(term));

      // Payment
      const matchPayment =
        paymentFilter === 'all' ||
        s.payment_method.toLowerCase() === paymentFilter.toLowerCase();

      // Date
      let matchDate = true;
      if (dateFilter === 'today') {
        matchDate = s.created_at.startsWith(todayStr);
      } else if (dateFilter === 'week') {
        const saleDate = new Date(s.created_at);
        const diffDays = (now.getTime() - saleDate.getTime()) / (1000 * 3600 * 24);
        matchDate = diffDays <= 7;
      } else if (dateFilter === 'month') {
        const saleDate = new Date(s.created_at);
        matchDate =
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear();
      }

      return matchSearch && matchPayment && matchDate;
    });
  }, [sales, searchTerm, paymentFilter, dateFilter]);

  // Items for selected detail
  const detailItems = useMemo(() => {
    if (!selectedSaleDetail) return [];
    return selectedSaleDetail.items || [];
  }, [selectedSaleDetail]);

  // Total Turnover in current view
  const currentTurnover = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.total, 0);
  }, [filteredSales]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredSales.length === 0) return;
    const headers = ['No Invoice', 'Tanggal', 'Pelanggan', 'Metode Bayar', 'Subtotal', 'Diskon', 'Total'];
    const rows = filteredSales.map((s) => [
      s.invoice_number,
      new Date(s.created_at).toLocaleString('id-ID'),
      `"${s.customer_name || 'Pelanggan Umum'}"`,
      s.payment_method,
      s.subtotal,
      s.discount,
      s.total,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `penjualan_afterproject_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Riwayat Penjualan & Nota Struk
          </h2>
          <p className="text-xs text-slate-500">
            Total omzet pada filter ini:{' '}
            <strong className="text-slate-900 font-bold">
              Rp {currentTurnover.toLocaleString('id-ID')}
            </strong>{' '}
            ({filteredSales.length} transaksi)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredSales.length === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('pos')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor invoice atau nama pelanggan..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini Saja</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Pembayaran</option>
              <option value="cash">Tunai (Cash)</option>
              <option value="qris">QRIS</option>
              <option value="transfer">Transfer Bank</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table or Empty State */}
      {sales.length === 0 ? (
        <EmptyState
          id="empty-admin-sales"
          icon={<Receipt className="w-8 h-8" />}
          title="Belum ada transaksi penjualan yang tercatat."
          description="Database transaksi penjualan saat ini masih kosong. Buka modul Kasir (POS) untuk membuat transaksi pertama."
          actionText="Buka Kasir (POS)"
          onAction={() => setAdminTab('pos')}
        />
      ) : filteredSales.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Tidak ada nota transaksi yang cocok dengan filter Anda.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">No. Invoice & Tanggal</th>
                  <th className="py-3.5 px-4">Pelanggan</th>
                  <th className="py-3.5 px-4 text-center">Metode Bayar</th>
                  <th className="py-3.5 px-4 text-right">Subtotal</th>
                  <th className="py-3.5 px-4 text-right">Diskon</th>
                  <th className="py-3.5 px-4 text-right">Total Akhir</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        {sale.invoice_number}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(sale.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {sale.customer_name || 'Pelanggan Umum'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      Rp {sale.subtotal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                      {sale.discount > 0 ? `Rp ${sale.discount.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900 text-sm">
                      Rp {sale.total.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSaleDetail(sale)}
                          title="Lihat Rincian Item"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReceiptSale(sale);
                          }}
                          title="Cetak Struk Transaksi"
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sale Detail Breakdown Modal */}
      {selectedSaleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-amber-600">
                  Rincian Transaksi Kasir
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  {selectedSaleDetail.invoice_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSaleDetail(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Pelanggan:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedSaleDetail.customer_name || 'Pelanggan Umum'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Metode Bayar:</span>
                  <p className="font-bold uppercase text-slate-900 mt-0.5">
                    {selectedSaleDetail.payment_method}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {detailItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase text-amber-700 block">
                        {item.item_type === 'SERVICE' ? 'Layanan' : 'Barang ATK'}
                      </span>
                      <p className="font-bold text-slate-900">{item.description}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity} x Rp {item.unit_price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <span className="font-bold font-mono text-slate-900">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">
                    Rp {selectedSaleDetail.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                {selectedSaleDetail.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Diskon:</span>
                    <span className="font-mono">
                      -Rp {selectedSaleDetail.discount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-100">
                  <span>Total Tagihan:</span>
                  <span className="font-mono text-amber-700">
                    Rp {selectedSaleDetail.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSaleDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const s = selectedSaleDetail;
                    setSelectedSaleDetail(null);
                    setActiveReceiptSale(s);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Struk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
