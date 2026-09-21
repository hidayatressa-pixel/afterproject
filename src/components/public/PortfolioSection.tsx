import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ExternalLink,
  Laptop,
  CheckCircle2,
  FolderGit2,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const PortfolioSection: React.FC = () => {
  const { portfolioProjects, isDemoMode, loadDemoData, currentUser, setCurrentView, setAdminTab, setIsAdminLoginOpen } = useApp();

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <FolderGit2 className="w-4 h-4 text-amber-600" />
            <span>Showcase Project Digital</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Portofolio & Konsep Solusi Digital
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Contoh arsitektur aplikasi dan website praktis yang dikembangkan untuk membantu otomatisasi usaha lokal dan UMKM.
          </p>
        </div>

        {/* Database Portfolio Content */}
        {portfolioProjects.length === 0 ? (
          <div className="max-w-xl mx-auto">
            <EmptyState
              id="empty-portfolio"
              icon={<Laptop className="w-7 h-7" />}
              title="Belum ada project yang ditampilkan."
              description="Database portofolio saat ini masih kosong (Production Mode). Anda dapat menambahkan dokumentasi project melalui admin atau mengaktifkan mode demo untuk melihat sampel."
              actionText={currentUser ? '+ Tambah Project' : 'Login Admin'}
              onAction={() => {
                if (currentUser) {
                  setCurrentView('admin');
                  setAdminTab('portfolio');
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              secondaryActionText="Lihat Sampel Project Demo"
              onSecondaryAction={loadDemoData}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl bg-slate-50 border border-slate-200 hover:border-amber-400 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-200 group"
              >
                <div>
                  {/* Visual Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900">
                      {project.category}
                    </span>
                    {project.is_demo && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Demo Preview
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-1.5 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>

                  {project.client && (
                    <p className="text-xs text-slate-500 font-medium mb-3">
                      Mitra / Kasus: <strong className="text-slate-700">{project.client}</strong>
                    </p>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white text-slate-600 border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {project.status === 'completed' ? 'Selesai & Berjalan' : 'Dalam Pengembangan'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(project.created_at).toLocaleDateString('id-ID', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
