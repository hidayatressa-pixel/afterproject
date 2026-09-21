import React from 'react';
import logoImg from '../../assets/images/after_project_logo_1790002151078.jpg';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      img: 'w-8 h-8 rounded-lg',
      title: 'text-sm font-black tracking-tight',
      sub: 'text-[9px] tracking-wider',
    },
    md: {
      img: 'w-10 h-10 rounded-xl',
      title: 'text-base font-black tracking-tight',
      sub: 'text-[10px] tracking-widest',
    },
    lg: {
      img: 'w-12 h-12 rounded-2xl',
      title: 'text-lg font-black tracking-tight',
      sub: 'text-[11px] tracking-widest',
    },
    xl: {
      img: 'w-16 h-16 rounded-2xl',
      title: 'text-2xl font-black tracking-tight',
      sub: 'text-xs tracking-widest',
    },
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* High-definition generated brand icon emblem */}
      <div className="relative shrink-0">
        <img
          src={logoImg}
          alt="AFTER PROJECT Brand Logo"
          referrerPolicy="no-referrer"
          className={`${sizeMap[size].img} object-cover shadow-sm ring-1 ${
            isLight ? 'ring-slate-700/80' : 'ring-slate-200/80'
          }`}
        />
        <div className="absolute -inset-0.5 rounded-xl bg-amber-500/10 -z-10 blur-xs" />
      </div>

      <div className="flex flex-col min-w-0">
        <span
          className={`${sizeMap[size].title} font-heading leading-tight ${
            isLight ? 'text-white' : 'text-slate-900'
          }`}
        >
          AFTER PROJECT
        </span>
        {showSubtitle && (
          <span
            className={`${sizeMap[size].sub} font-bold uppercase ${
              isLight ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            Fotocopy • Printing • ATK
          </span>
        )}
      </div>
    </div>
  );
};
