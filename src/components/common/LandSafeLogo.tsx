import React from 'react';

interface LandSafeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showGlow?: boolean;
  alt?: string;
}

export const LandSafeLogo: React.FC<LandSafeLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = true,
  alt = 'LandSafe AI Official Logo',
}) => {
  const sizeMap: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dimensionClasses = typeof size === 'number' ? `w-[${size}px] h-[${size}px]` : sizeMap[size] || sizeMap.md;
  const inlineStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimensionClasses} ${className}`}
      style={inlineStyle}
    >
      {/* Subtle brand glow matching cyan & emerald palette */}
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-emerald-500/25 blur-md -z-10 pointer-events-none" />
      )}
      
      {/* Official LandSafe AI Logo Image */}
      <img
        src="/landsafe-ai-logo.png"
        alt={alt}
        className="w-full h-full object-contain rounded-full drop-shadow-md transition-transform duration-200"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
