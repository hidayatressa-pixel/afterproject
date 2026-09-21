import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { websiteContent, settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');

  const activeWhatsApp = settings?.whatsapp || websiteContent?.whatsapp_number || '081234567890';

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = activeWhatsApp.replace(/\D/g, '');
    const text = quickMessage.trim() || 'Halo AFTER PROJECT, saya ingin bertanya tentang layanan fotocopy, print, atau ATK.';
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
    setQuickMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end">
      {/* Quick Popup Box when clicked */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-fade-in text-slate-800">
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Chat AFTER PROJECT</h4>
                <p className="text-[11px] text-emerald-100">Buka • Biasanya membalas cepat</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 space-y-3 text-xs">
            <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-2xs text-slate-700 leading-relaxed">
              Halo! Ada dokumen yang ingin Anda cetak, fotocopy, atau butuh info produk ATK hari ini?
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setQuickMessage('Halo, saya ingin print dokumen via WhatsApp. Bagaimana caranya?');
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors text-[11px]"
              >
                Mau Print File
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickMessage('Halo, apakah stok kertas HVS dan ATK ready?');
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors text-[11px]"
              >
                Tanya Stok ATK
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickMessage('Halo, saya ingin konsultasi sistem / website usaha UMKM.');
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors text-[11px]"
              >
                Digital Solutions
              </button>
            </div>

            <form onSubmit={handleSend} className="relative pt-1">
              <input
                type="text"
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="Ketik pesan Anda..."
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-2.5 p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Primary Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 group relative"
        aria-label="WhatsApp Chat"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );
};
