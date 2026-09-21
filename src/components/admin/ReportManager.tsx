import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileBarChart,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Wallet,
  PieChart,
  Copy,
  PenTool,
} from 'lucide-react';

export const ReportManager: React.FC = () => {
  const { sales, expenses, products, services } = useApp();

  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter sales and expenses by date range
  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return sales.filter((s) => {
      const sDateStr = s.created_at.split('T')[0];
      if (dateRange === 'today') {
        return sDateStr === todayStr;
      }
      if (dateRange === 'week') {
        const diffDays = (now.getTime() - new Date(s.created_at).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (dateRange === 'month') {
        const d = new Date(s.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'custom') {
        return sDateStr >= startDate && sDateStr <= endDate;
      }
      return true;
    });
  }, [sales, dateRange, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return expenses.filter((e) => {
      if (dateRange === 'today') {
        return e.date === todayStr;
      }
      if (dateRange === 'week') {
        const diffDays = (now.getTime() - new Date(e.date).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (dateRange === 'month') {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'custom') {
        return e.date >= startDate && e.date <= endDate;
      }
      return true;
    });
  }, [expenses, dateRange, startDate, endDate]);

  // Financial Metrics
  const totalRevenue = useMemo(() => filteredSales.reduce((acc, s) => acc + s.total, 0), [filteredSales]);
  const totalExpense = useMemo(() => filteredExpenses.reduce((acc, e) => acc + e.amount, 0), [filteredExpenses]);
  const estimatedGrossProfit = totalRevenue - totalExpense;

  // Breakdown Products vs Services Revenue
  const { productRevenue, serviceRevenue } = useMemo(() => {
    let prodRev = 0;
    let servRev = 0;

    filteredSales.forEach((sale) => {
      sale.items?.forEach((item) => {
        if (item.item_type === 'PRODUCT' || (item.item_type as string) === 'product') {
          prodRev += item.subtotal;
        } else {
          servRev += item.subtotal;
        }
      });
    });

    return { productRevenue: prodRev, serviceRevenue: servRev };
  }, [filteredSales]);

  // Export Excel / CSV
  const handleExportCSV = () => {
    const rows = [
      ['LAPORAN KEUANGAN AFTER PROJECT'],
      ['Periode:', dateRange.toUpperCase()],
      ['Tanggal Dibuat:', new Date().toLocaleString('id-ID')],
      [],
      ['RINGKASAN'],
      ['Total Pendapatan (Penjualan):', totalRevenue],
      ['Total Pengeluaran (Beban):', totalExpense],
      ['Estimasi Laba Kotor:', estimatedGrossProfit],
      ['Penjualan ATK:', productRevenue],
      ['Penjualan Cetak & Jilid:', serviceRevenue],
      [],
      ['DAFTAR PENJUALAN'],
      ['No Invoice', 'Tanggal', 'Pelanggan', 'Metode Bayar', 'Total'],
      ...filteredSales.map((s) => [
        s.invoice_number,
        s.created_at,
        s.customer_name || 'Pelanggan Umum',
        s.payment_method,
        s.total,
      ]),
      [],
      ['DAFTAR PENGELUARAN'],
      ['Tanggal', 'Kategori', 'Keterangan', 'Nominal'],
      ...filteredExpenses.map((e) => [e.date, e.category, `"${e.description}"`, e.amount]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_keuangan_afterproject_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Laporan Keuangan & Analisis Laba
          </h2>
          <p className="text-xs text-slate-500">
            Rekap pendapatan dari penjualan ATK, fotocopy & print, beban toko, dan estimasi laba.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Excel / CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Filter Periode:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setDateRange('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRange === 'today'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRange === 'week'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRange === 'month'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRange === 'custom'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Kustom Tanggal
            </button>
          </div>
        </div>

        {dateRange === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300"
            />
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Omzet Pendapatan
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Dari {filteredSales.length} transaksi kasir
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Beban Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-600 font-heading mt-2">
            Rp {totalExpense.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Kertas, toner, listrik & operasional ({filteredExpenses.length} catatan)
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimasi Laba Kotor
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-2xl font-extrabold font-heading mt-2 ${
              estimatedGrossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            Rp {estimatedGrossProfit.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Selisih penerimaan terhadap biaya
          </p>
        </div>
      </div>

      {/* Breakdown: Product vs Service Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">
                Kontribusi Penjualan ATK
              </span>
              <p className="text-lg font-extrabold text-slate-900 font-heading">
                Rp {productRevenue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {totalRevenue > 0
              ? `${Math.round((productRevenue / totalRevenue) * 100)}%`
              : '0%'}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">
                Kontribusi Jasa Print & Fotocopy
              </span>
              <p className="text-lg font-extrabold text-slate-900 font-heading">
                Rp {serviceRevenue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {totalRevenue > 0
              ? `${Math.round((serviceRevenue / totalRevenue) * 100)}%`
              : '0%'}
          </span>
        </div>
      </div>

      {/* Printable Report Summary Header when printing */}
      <div className="hidden print:block text-center py-4 border-b border-slate-300">
        <h1 className="text-xl font-bold font-heading">AFTER PROJECT - LAPORAN KEUANGAN</h1>
        <p className="text-xs text-slate-600">
          Periode: {dateRange.toUpperCase()} | Dicetak: {new Date().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
};
