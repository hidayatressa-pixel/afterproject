import React from 'react';
import { PackageOpen, ArrowRight, Plus } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id,
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white/70 shadow-xs ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1 font-heading">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
          >
            {secondaryActionText}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
