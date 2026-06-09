import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDemo?: boolean;
}

export default function Logo({ className = '', size = 'md', isDemo = false }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  
  const sizes = {
    sm: 'w-8 h-8 text-[8px]',
    md: 'w-12 h-12 text-[10px]',
    lg: 'w-16 h-16 text-[12px]',
    xl: 'w-24 h-24 text-[14px]'
  };

  if (isDemo) {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-slate-200 shadow-md border-2 border-white/20 select-none ${sizes[size]} ${className}`}
        id="cng-logo"
      >
        <span className="font-black text-slate-500 uppercase tracking-tighter text-center leading-none">
          {size === 'sm' ? 'Logo' : 'Logotipo'}
        </span>
      </div>
    );
  }

  if (!imgError) {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 select-none ${sizes[size]} ${className}`}
        id="cng-logo"
      >
        <img 
          src="/Logo.png" 
          alt="CNG" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-[#7B68EE] shadow-lg border-2 border-white/20 select-none ${sizes[size]} ${className}`}
      id="cng-logo"
    >
      <div className="flex items-center justify-center leading-none gap-[0.05em]">
        <span className="font-black text-white tracking-tighter uppercase">CN</span>
        <span className="font-black text-white tracking-tighter uppercase">G</span>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/10 rounded-full -mr-4 -mt-4" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-black/5 rounded-full -ml-2 -mb-2" />
    </div>
  );
}
