import React from 'react';
import { Printer, X, CheckCircle, Share2, MessageCircle } from 'lucide-react';
import { Sale, StoreSettings } from '../../types';
import logoImg from '../../assets/images/after_project_logo_1790002151078.jpg';

interface ReceiptModalProps {
  sale: Sale | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, settings, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWA = () => {
    const summary = `*STRUK PEMBAYARAN - ${settings.store_name}*\n` +
      `No: ${sale.invoice_number}\n` +
      `Tanggal: ${new Date(sale.created_at).toLocaleString('id-ID')}\n` +
      `Pelanggan: ${sale.customer_name || 'Umum'}\n` +
      `--------------------------------\n` +
      sale.items.map((it) => `${it.description} x${it.quantity} = Rp ${it.subtotal.toLocaleString('id-ID')}`).join('\n') +
      `\n--------------------------------\n` +
      `Subtotal: Rp ${sale.subtotal.toLocaleString('id-ID')}\n` +
      (sale.discount > 0 ? `Diskon: -Rp ${sale.discount.toLocaleString('id-ID')}\n` : '') +
      `*TOTAL: Rp ${sale.total.toLocaleString('id-ID')}*\n` +
      `Metode: ${sale.payment_method} (${sale.payment_status})\n\n` +
      `Terima kasih telah berkunjung di ${settings.store_name}!`;

    const encoded = encodeURIComponent(summary);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 font-heading">Struk Transaksi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body (The Printable Area) */}
        <div className="overflow-y-auto p-6 bg-slate-100 flex justify-center">
          <div
            id="printable-receipt"
            className="bg-white p-6 shadow-xs rounded-xl border border-slate-200 w-full max-w-[340px] text-slate-800 font-mono text-xs leading-relaxed"
          >
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300 flex flex-col items-center">
              <img
                src={logoImg}
                alt="Store Logo"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover mb-1.5 grayscale contrast-125"
              />
              <h2 className="text-base font-extrabold tracking-wider text-slate-900 uppercase">
                {settings.store_name}
              </h2>
              <p className="text-[11px] text-slate-600 font-sans font-medium">{settings.main_tagline}</p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">{settings.address}</p>
              <p className="text-[10px] text-slate-500 font-sans">WA / Telp: {settings.phone}</p>
            </div>

            {/* Transaction Meta */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Nota:</span>
                <span className="font-bold">{sale.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu:</span>
                <span>{new Date(sale.created_at).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kasir:</span>
                <span>{sale.cashier_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-semibold">{sale.customer_name || 'Pelanggan Umum'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-2">
              {sale.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-medium text-slate-900 line-clamp-1">{item.description}</div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>
                      {item.quantity} x Rp {item.unit_price.toLocaleString('id-ID')}
                    </span>
                    <span className="font-bold text-slate-900">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>Rp {sale.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Diskon:</span>
                  <span>-Rp {sale.discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>Rp {sale.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold text-slate-900">{sale.payment_method}</span>
              </div>
              {sale.payment_method === 'CASH' && sale.cash_received !== undefined && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tunai Diterima:</span>
                    <span>Rp {sale.cash_received.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-900">
                    <span className="text-slate-500">Kembalian:</span>
                    <span>Rp {(sale.cash_change || 0).toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-600 font-bold">{sale.payment_status}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 text-[10px] text-slate-500 font-sans leading-relaxed">
              <p>{settings.receipt_footer_note}</p>
              <p className="mt-1 font-semibold text-slate-700">*** AFTER PROJECT ***</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleShareWA}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Kirim WA
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Cetak Struk
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
