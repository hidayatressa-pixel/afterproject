import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Layers,
} from 'lucide-react';
import { PortfolioProject } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const PortfolioManager: React.FC = () => {
  const { portfolioProjects, savePortfolioProject, deletePortfolioProject, addToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioProject | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Aplikasi Kasir / POS');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [status, setStatus] = useState<'completed' | 'in_progress'>('completed');

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Aplikasi Kasir / POS');
    setClient('Toko Retail / UMKM');
    setDescription('');
    setTechStack('React, TypeScript, Tailwind CSS');
    setProjectUrl('');
    setStatus('completed');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PortfolioProject) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setClient(item.client || '');
    setDescription(item.description);
    setTechStack((item.technologies || []).join(', '));
    setProjectUrl(item.live_url || '');
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('error', 'Validasi Gagal', 'Judul proyek tidak boleh kosong.');
      return;
    }

    try {
      const techArray = techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      savePortfolioProject({
        id: editingItem ? editingItem.id : undefined,
        title: title.trim(),
        category: category.trim(),
        client: client.trim() || undefined,
        description: description.trim(),
        technologies: techArray,
        live_url: projectUrl.trim() || undefined,
        status,
        is_demo: false,
      });

      setIsModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan', err.message);
    }
  };

  const handleDelete = (item: PortfolioProject) => {
    if (confirm(`Hapus proyek portfolio "${item.title}"?`)) {
      deletePortfolioProject(item.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Manajemen Portfolio Digital Solutions
          </h2>
          <p className="text-xs text-slate-500">
            Kelola portofolio aplikasi web, landing page, dan sistem digital sekunder yang ditampilkan pada showcase website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Proyek Portfolio</span>
        </button>
      </div>

      {/* List / Empty State */}
      {portfolioProjects.length === 0 ? (
        <EmptyState
          id="empty-admin-portfolio"
          icon={<Code className="w-8 h-8" />}
          title="Belum ada portofolio digital terdaftar."
          description="Tambahkan rekam jejak pembuatan website, sistem kasir toko, atau landing page UMKM yang pernah dikerjakan oleh After Project Digital Solutions."
          actionText="+ Tambah Proyek Pertama"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioProjects.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">
                    {item.status === 'completed' ? 'Selesai' : 'Dalam Pengerjaan'}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  {item.title}
                </h3>

                {item.client && (
                  <p className="text-[11px] font-semibold text-slate-500">
                    Klien: {item.client}
                  </p>
                )}

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-2">
                  {(item.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                {item.live_url ? (
                  <a
                    href={item.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Kunjungi Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Internal Project</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="Edit Proyek"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Digital Solutions
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  {editingItem ? 'Edit Proyek Portofolio' : 'Tambah Proyek Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Proyek *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Web Profil Usaha Laundry Berkah"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Aplikasi Kasir / POS">Aplikasi Kasir / POS</option>
                    <option value="Website Profil Usaha">Website Profil Usaha</option>
                    <option value="Landing Page Promosi">Landing Page Promosi</option>
                    <option value="Sistem Informasi Arsip">Sistem Informasi Arsip</option>
                    <option value="Aplikasi Web Custom">Aplikasi Web Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Klien / Mitra
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Contoh: Toko Berkah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Proyek
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kebutuhan klien, fitur utama, dan solusi yang dibangun..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teknologi (Pisahkan koma)
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="React, TypeScript, Tailwind CSS, Vite, Supabase"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL Live / Demo
                  </label>
                  <input
                    type="url"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="completed">Selesai (Completed)</option>
                    <option value="in_progress">Dalam Pengerjaan</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
