import React, { useState } from 'react';
import logoPngAsset from '../../assets/landsafe-ai-logo.png';

interface LandSafeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showGlow?: boolean;
  alt?: string;
  variant?: 'auto' | 'image' | 'vector';
}

/**
 * Built-in crisp vector SVG emblem for LandSafe AI.
 * Guaranteed 100% visibility with zero network latency or asset path failures.
 */
const LandSafeVectorEmblem: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} drop-shadow-md select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      {/* Outer shield gradient */}
      <linearGradient id="lsRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00b4d8" />
        <stop offset="35%" stopColor="#0077b6" />
        <stop offset="70%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>

      {/* Shield dark core */}
      <linearGradient id="lsCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0a192f" />
        <stop offset="50%" stopColor="#061220" />
        <stop offset="100%" stopColor="#020812" />
      </linearGradient>

      {/* Mountain & terrain slope */}
      <linearGradient id="lsMountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0f766e" />
      </linearGradient>

      {/* AI Pulse wave */}
      <linearGradient id="lsPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>

    {/* Outer Hexagonal Shield Ring */}
    <path
      d="M50 4 L88 24 L88 64 L50 96 L12 64 L12 24 Z"
      fill="url(#lsCoreGrad)"
      stroke="url(#lsRingGrad)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Inner Subtle Ring */}
    <path
      d="M50 12 L80 28 L80 60 L50 86 L20 60 L20 28 Z"
      fill="none"
      stroke="#1e3a5f"
      strokeWidth="1.5"
      opacity="0.8"
    />

    {/* Mountain Slope Peak (Geotechnical Terrain) */}
    <path
      d="M50 24 L68 54 L56 54 L62 68 L38 68 L44 54 L32 54 Z"
      fill="url(#lsMountainGrad)"
      opacity="0.95"
    />

    {/* Ridge Accent Line */}
    <path
      d="M50 24 L50 68"
      stroke="#bae6fd"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.9"
    />

    {/* Left AI Telemetry Node */}
    <circle cx="28" cy="44" r="3.2" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
    <path d="M28 44 L38 54" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.85" />

    {/* Right AI Telemetry Node */}
    <circle cx="72" cy="44" r="3.2" fill="#34d399" stroke="#047857" strokeWidth="1" />
    <path d="M72 44 L62 54" stroke="#34d399" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.85" />

    {/* Bottom Base Wave / Foundation */}
    <path
      d="M32 76 C42 72, 58 72, 68 76"
      stroke="url(#lsPulseGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Top Beacon Pulse */}
    <circle cx="50" cy="18" r="2.5" fill="#67e8f9" />
  </svg>
);

export const LandSafeLogo: React.FC<LandSafeLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = false,
  alt = 'LandSafe AI Logo',
  variant = 'auto',
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);

  const sizeMap: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const dimensionClasses = typeof size === 'number' ? '' : sizeMap[size] || sizeMap.md;
  const inlineStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  // Fallback cascade for image sources
  const imageCandidates = [
    logoPngAsset,
    '/logo.png',
    '/landsafe-ai-logo.png',
    '/landsafe-ai-logo.svg',
  ];

  const handleImageError = () => {
    if (currentSrcIndex < imageCandidates.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
    } else {
      setImageFailed(true);
    }
  };

  const showVectorOnly = variant === 'vector' || imageFailed;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimensionClasses} ${className}`}
      style={inlineStyle}
    >
      {/* Subtle brand glow matching cyan & emerald palette */}
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 to-emerald-500/30 blur-md -z-10 pointer-events-none" />
      )}

      {showVectorOnly ? (
        <LandSafeVectorEmblem className="w-full h-full" />
      ) : (
        <>
          {/* Instant Vector placeholder while image buffers to prevent layout shift */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LandSafeVectorEmblem className="w-full h-full opacity-80" />
            </div>
          )}

          {/* High-Resolution LandSafe AI Official Logo */}
          <img
            src={imageCandidates[currentSrcIndex]}
            alt={alt}
            className={`w-full h-full object-contain drop-shadow-md transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        </>
      )}
    </div>
  );
};

