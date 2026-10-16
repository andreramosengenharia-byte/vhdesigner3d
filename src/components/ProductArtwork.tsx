import React from 'react';
import { Product } from '../types';

interface ProductArtworkProps {
  product: Product;
  selectedColorName?: string;
  selectedColorHex?: string;
  className?: string;
  hideBadge?: boolean;
  customImages?: Record<string, string>;
  customVideos?: Record<string, string>;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  product,
  selectedColorName,
  selectedColorHex,
  className = 'w-full h-full min-h-[220px]',
  hideBadge = false,
  customImages,
  customVideos,
}) => {
  const [imageError, setImageError] = React.useState<boolean>(false);
  const [videoError, setVideoError] = React.useState<boolean>(false);
  const primaryColor = selectedColorHex || product.colors?.[0]?.hex || '#D49A25';

  // Check if there is a video (custom uploaded or specified in product)
  const rawVideoUrl = customVideos?.[product.id] || product.videoUrl;
  // Normalize path if user typed "public/..." so Vite serves it correctly
  const effectiveVideoUrl = rawVideoUrl
    ? rawVideoUrl.startsWith('public/')
      ? `/${rawVideoUrl.replace(/^public\//, '')}`
      : rawVideoUrl
    : null;

  // 1. Check if there is an image specifically for this color variation:
  const colorKey = selectedColorName ? `${product.id}__${selectedColorName}` : null;
  const rawImageUrl =
    (colorKey && customImages?.[colorKey]) ||
    (selectedColorName && product.colorImages?.[selectedColorName]) ||
    customImages?.[product.id] ||
    product.imageUrl ||
    '';
  const effectiveImageUrl = rawImageUrl.startsWith('public/')
    ? `/${rawImageUrl.replace(/^public\//, '')}`
    : rawImageUrl;

  React.useEffect(() => {
    setImageError(false);
  }, [effectiveImageUrl]);

  React.useEffect(() => {
    setVideoError(false);
  }, [effectiveVideoUrl]);

  // If a video is available and valid for this product (e.g. Árvore Giratória), prioritize playing the video!
  if (effectiveVideoUrl && !videoError) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-black ${className}`}>
        <video
          src={effectiveVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        {!hideBadge && (
          <div className="absolute bottom-2.5 right-3 text-[11px] font-semibold tracking-tight text-amber-300 bg-black/80 px-2.5 py-0.5 rounded-full border border-amber-400/50 backdrop-blur-xs shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Vídeo em Ação</span>
          </div>
        )}
      </div>
    );
  }

  // If a real product image was specified or uploaded for this color or product
  if (effectiveImageUrl && !imageError) {
    const isColorSpecific = Boolean(colorKey && customImages?.[colorKey]);
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#082218] via-[#051710] to-[#020b07] ${className}`}>
        <img
          src={effectiveImageUrl}
          alt={`${product.name} - ${selectedColorName || ''}`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        {!hideBadge && (
          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/90 bg-black/75 px-2 py-0.5 rounded border border-amber-500/40 backdrop-blur-xs shadow-md flex items-center gap-1">
            <span>Foto Real</span>
            {selectedColorName && isColorSpecific && (
              <span className="text-emerald-300 font-sans">({selectedColorName})</span>
            )}
          </div>
        )}
      </div>
    );
  }

  switch (product.imageTheme) {
    case 'spiral_tree':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#082218] via-[#051710] to-[#020b07] ${className}`}>
          {/* Holiday Warm Lights Bokeh Backdrop */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-4 left-6 h-12 w-12 rounded-full bg-amber-400/30 blur-xl" />
            <div className="absolute bottom-6 right-8 h-16 w-16 rounded-full bg-rose-500/20 blur-xl" />
            <div className="absolute top-1/2 left-1/3 h-20 w-20 rounded-full bg-emerald-400/20 blur-2xl" />
          </div>

          {/* Pine needles decoration in background */}
          <svg className="absolute -bottom-4 -left-6 w-32 h-32 opacity-25 text-emerald-950" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10 80 Q 40 40 80 10 Q 60 50 20 90 Z" />
            <path d="M20 90 Q 50 50 90 20 Q 70 60 30 100 Z" />
          </svg>

          {/* 3D Spiral Christmas Tree with Layer lines & LED core */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Golden Star Topper */}
            <svg className="w-8 h-8 filter drop-shadow-[0_0_8px_#fde047] mb-0.5 animate-pulse" viewBox="0 0 24 24">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#FDE047" stroke="#D49A25" strokeWidth="1" />
            </svg>

            {/* Spiral Tree Geometry */}
            <svg className="w-40 h-52 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" viewBox="0 0 200 260">
              <defs>
                <linearGradient id={`grad-spiral-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF" stopOpacity="0.4" />
                  <stop offset="30%" stopColor={primaryColor} />
                  <stop offset="85%" stopColor="#0B130E" />
                </linearGradient>
                <linearGradient id="led-core" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <pattern id="fdm-lines" width="100" height="4" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Internal glowing LED core column */}
              <rect x="94" y="20" width="12" height="210" rx="6" fill="url(#led-core)" opacity="0.85" filter="drop-shadow(0 0 12px #FBBF24)" />

              {/* 3D Spiral Ribs & Conical Tiers */}
              <path d="M 100 25 Q 120 40 100 55 Q 75 70 100 85 Q 130 100 100 120 Q 65 140 100 165 Q 140 190 100 215 Q 55 240 100 250" 
                    fill="none" stroke={`url(#grad-spiral-${product.id})`} strokeWidth="18" strokeLinecap="round" />
              
              {/* Helical Counter-Rib for 3D depth */}
              <path d="M 100 35 Q 80 50 100 65 Q 125 80 100 100 Q 70 120 100 145 Q 135 170 100 195 Q 60 220 100 240" 
                    fill="none" stroke={primaryColor} strokeWidth="14" strokeOpacity="0.85" strokeLinecap="round" />

              {/* Texture layer */}
              <ellipse cx="100" cy="245" rx="55" ry="12" fill="#030805" opacity="0.6" />
            </svg>
          </div>

          {/* 3D Print Quality badge overlay */}
          <div className="absolute bottom-2.5 right-3 text-[11px] font-medium tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Alta Definição
          </div>
        </div>
      );

    case 'baubles':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#160608] via-[#0d1712] to-[#040e09] ${className}`}>
          {/* Bokeh lights */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-2 right-4 h-14 w-14 rounded-full bg-amber-400/20 blur-xl" />
            <div className="absolute bottom-2 left-6 h-12 w-12 rounded-full bg-rose-600/30 blur-lg" />
          </div>

          {/* Hanging Ribbon and Cap */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Red velvet ribbon */}
            <div className="w-1.5 h-10 bg-gradient-to-b from-rose-700 via-rose-600 to-amber-500" />
            
            {/* Metallic Ornament Cap */}
            <div className="w-8 h-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 rounded-t-sm shadow-md flex items-center justify-center">
              <div className="w-4 h-1 bg-amber-700 rounded-full" />
            </div>

            {/* 3D Voronoi Sphere */}
            <svg className="w-44 h-44 filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.7)]" viewBox="0 0 160 160">
              <defs>
                <radialGradient id={`bauble-rad-${product.id}`} cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                  <stop offset="25%" stopColor={primaryColor} />
                  <stop offset="70%" stopColor="#4A0404" />
                  <stop offset="100%" stopColor="#1A0202" />
                </radialGradient>
                <filter id="glow-inner">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Sphere Base Shading */}
              <circle cx="80" cy="80" r="70" fill={`url(#bauble-rad-${product.id})`} />

              {/* Voronoi / Geometric Lattice overlay */}
              <g stroke="rgba(255, 235, 175, 0.75)" strokeWidth="2.5" fill="none">
                <polygon points="80,20 105,40 95,70 65,70 55,40" />
                <polygon points="105,40 135,55 130,85 95,70" />
                <polygon points="95,70 130,85 115,115 80,105" />
                <polygon points="65,70 80,105 50,115 35,85" />
                <polygon points="55,40 65,70 35,85 25,55" />
                <polygon points="80,105 115,115 95,140 65,140 50,115" />
                {/* Facet vertex connector nodes */}
                <circle cx="80" cy="20" r="2.5" fill="#FFE5A3" />
                <circle cx="105" cy="40" r="2.5" fill="#FFE5A3" />
                <circle cx="55" cy="40" r="2.5" fill="#FFE5A3" />
                <circle cx="95" cy="70" r="3" fill="#FFE5A3" />
                <circle cx="65" cy="70" r="3" fill="#FFE5A3" />
                <circle cx="80" cy="105" r="3" fill="#FFE5A3" />
              </g>

              {/* Specular Highlight */}
              <ellipse cx="60" cy="48" rx="18" ry="10" fill="white" opacity="0.35" transform="rotate(-25 60 48)" />
            </svg>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Silk Shimmer
          </div>
        </div>
      );

    case 'lantern':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#10101c] via-[#091a14] to-[#040e0a] ${className}`}>
          {/* Candle light ambient bloom */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-amber-500/25 blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
          </div>

          {/* 3D Lithophane Lantern Cylinder */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Crown Rim */}
            <div className="w-28 h-3 rounded-t-md bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 shadow" />

            {/* Lithophane Body with Carved Christmas Scene */}
            <div className="w-24 h-36 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-50 rounded-xs shadow-2xl relative overflow-hidden flex items-center justify-center border-x border-amber-300/40">
              {/* Internal glowing light effect */}
              <div className="absolute inset-0 bg-radial from-amber-300/90 via-amber-400/50 to-amber-600/30" />

              {/* Litophane carved silhouettes */}
              <svg className="w-20 h-28 relative z-10 text-amber-950/75" viewBox="0 0 100 140" fill="currentColor">
                {/* Bethlehem Star on top */}
                <path d="M50 8 L54 22 L68 26 L54 30 L50 44 L46 30 L32 26 L46 22 Z" fill="#78350F" />
                {/* Silhouette of Nativity arch & Holy Family */}
                <path d="M20 135 L20 80 Q50 45 80 80 L80 135 Z" fill="none" stroke="#78350F" strokeWidth="3" />
                <path d="M30 135 C30 110, 45 105, 45 135 Z" />
                <path d="M55 135 C55 100, 70 95, 70 135 Z" />
                <circle cx="48" cy="125" r="5" fill="#451A03" />
                {/* Star dots in background */}
                <circle cx="25" cy="50" r="1.5" />
                <circle cx="75" cy="45" r="1.5" />
                <circle cx="35" cy="30" r="1.2" />
                <circle cx="65" cy="30" r="1.2" />
              </svg>
            </div>

            {/* Base Pedestal */}
            <div className="w-32 h-4 rounded-b-md bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 shadow-xl border-t border-amber-600/40" />
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            LED Inclusa
          </div>
        </div>
      );

    case 'nativity':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#081822] via-[#06241a] to-[#040e0b] ${className}`}>
          {/* Subtle star in the night sky */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <svg className="w-10 h-10 text-amber-300 filter drop-shadow-[0_0_10px_#f59e0b] animate-pulse" viewBox="0 0 24 24">
              <path d="M12 2 L14 9 L21 11 L14 13 L12 20 L10 13 L3 11 L10 9 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Low-Poly Minimalist Nativity Group */}
          <div className="relative z-10 flex items-end justify-center gap-2 pt-10">
            {/* St. Joseph Faceted */}
            <svg className="w-16 h-36 filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]" viewBox="0 0 60 140">
              <defs>
                <linearGradient id="poly-joseph" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="50%" stopColor={primaryColor} />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>
              {/* Aureola */}
              <circle cx="30" cy="18" r="14" fill="none" stroke="#FDE68A" strokeWidth="2.5" />
              {/* Faceted Body */}
              <polygon points="30,22 42,40 18,40" fill="#FFFBEB" />
              <polygon points="18,40 42,40 48,90 12,90" fill="url(#poly-joseph)" />
              <polygon points="12,90 48,90 44,135 16,135" fill={primaryColor} />
              {/* Facet lines */}
              <line x1="30" y1="40" x2="30" y2="135" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
            </svg>

            {/* Baby Jesus in Manger */}
            <svg className="w-14 h-20 filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] -mx-1" viewBox="0 0 50 60">
              <polygon points="25,5 33,18 17,18" fill="#FDE68A" />
              <polygon points="10,25 40,25 35,45 15,45" fill="#D97706" />
              <polygon points="15,45 35,45 38,55 12,55" fill="#92400E" />
              <circle cx="25" cy="18" r="8" fill="#FEF3C7" />
            </svg>

            {/* Mary Faceted */}
            <svg className="w-14 h-30 filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]" viewBox="0 0 60 120">
              <defs>
                <linearGradient id="poly-mary" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
              </defs>
              <circle cx="30" cy="16" r="12" fill="none" stroke="#FDE68A" strokeWidth="2.5" />
              <polygon points="30,20 40,36 20,36" fill="#FFFBEB" />
              <polygon points="20,36 40,36 45,80 15,80" fill="url(#poly-mary)" />
              <polygon points="15,80 45,80 42,118 18,118" fill="#CBD5E1" />
              <line x1="30" y1="36" x2="28" y2="118" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />
            </svg>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            7 Peças
          </div>
        </div>
      );

    case 'star':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#181105] via-[#0e1d14] to-[#040e08] ${className}`}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />
          </div>

          {/* 3D Faceted Star Topper */}
          <div className="relative z-10 flex flex-col items-center">
            <svg className="w-40 h-40 filter drop-shadow-[0_12px_24px_rgba(217,119,6,0.4)]" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="star-facet-light" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="star-facet-dark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>

              {/* 8-pointed 3D Star Facets */}
              {/* North Ray */}
              <polygon points="80,10 80,80 65,55" fill="url(#star-facet-light)" />
              <polygon points="80,10 80,80 95,55" fill="url(#star-facet-dark)" />
              {/* South Ray */}
              <polygon points="80,150 80,80 95,105" fill="url(#star-facet-light)" />
              <polygon points="80,150 80,80 65,105" fill="url(#star-facet-dark)" />
              {/* East Ray */}
              <polygon points="150,80 80,80 105,65" fill="url(#star-facet-light)" />
              <polygon points="150,80 80,80 105,95" fill="url(#star-facet-dark)" />
              {/* West Ray */}
              <polygon points="10,80 80,80 55,95" fill="url(#star-facet-light)" />
              <polygon points="10,80 80,80 55,65" fill="url(#star-facet-dark)" />
              {/* Diagonal Rays */}
              <polygon points="125,35 80,80 100,50" fill="url(#star-facet-light)" />
              <polygon points="125,125 80,80 115,95" fill="url(#star-facet-dark)" />
              <polygon points="35,125 80,80 60,110" fill="url(#star-facet-light)" />
              <polygon points="35,35 80,80 45,65" fill="url(#star-facet-dark)" />

              {/* Center Diamond */}
              <polygon points="80,68 92,80 80,92 68,80" fill="#FEF9C3" filter="drop-shadow(0 0 6px #FFF)" />
            </svg>

            {/* Tree Branch Mount Spring */}
            <div className="w-6 h-6 border-2 border-dashed border-amber-600/70 rounded-full -mt-2" />
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Silk Dourado
          </div>
        </div>
      );

    case 'reindeer':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a1f18] via-[#051710] to-[#020b06] ${className}`}>
          <div className="relative z-10 flex items-center justify-center pt-2">
            <svg className="w-40 h-44 filter drop-shadow-[0_14px_22px_rgba(0,0,0,0.6)]" viewBox="0 0 160 180">
              <defs>
                <linearGradient id="reindeer-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFEAA7" />
                  <stop offset="50%" stopColor={primaryColor} />
                  <stop offset="100%" stopColor="#59320A" />
                </linearGradient>
              </defs>
              {/* Antlers Polygons */}
              <path d="M 65 35 L 50 15 L 42 22 L 55 38 L 40 45 L 68 50 Z" fill="#FDE68A" />
              <path d="M 95 35 L 110 15 L 118 22 L 105 38 L 120 45 L 92 50 Z" fill="#F59E0B" />
              {/* Low Poly Head */}
              <polygon points="80,38 95,58 65,58" fill="#FDE68A" />
              <polygon points="65,58 95,58 88,85 72,85" fill="url(#reindeer-grad)" />
              <polygon points="72,85 88,85 80,95" fill="#B45309" />
              {/* Neck & Chest */}
              <polygon points="70,85 90,85 105,120 55,120" fill="url(#reindeer-grad)" />
              <polygon points="55,120 105,120 115,160 45,160" fill="#92400E" />
              {/* Facet lines */}
              <line x1="80" y1="58" x2="80" y2="160" stroke="#FFF" strokeWidth="1" strokeOpacity="0.25" />
            </svg>
          </div>
          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Low-Poly
          </div>
        </div>
      );

    case 'custom_ball':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1c080d] via-[#102016] to-[#040e08] ${className}`}>
          {/* Bokeh */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-2 left-6 h-14 w-14 rounded-full bg-amber-400/20 blur-xl" />
            <div className="absolute bottom-4 right-6 h-12 w-12 rounded-full bg-emerald-500/20 blur-lg" />
          </div>

          {/* Hanging Custom Ornament */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-1.5 h-8 bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
            <div className="w-8 h-3.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 rounded-t-sm" />

            {/* Spherical Base */}
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-tr from-rose-950 via-rose-800 to-rose-600 shadow-[0_16px_28px_rgba(0,0,0,0.6)] border-2 border-amber-400/40">
              {/* 3D Embossed Name Plate in Silk Gold */}
              <div className="flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-amber-500 rotate-[-4deg]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900 font-semibold">FAMÍLIA</span>
                <span className="text-base font-bold text-amber-950 font-serif leading-none tracking-tight">SILVA</span>
                <span className="text-[9px] text-amber-800 font-medium">★ 2026 ★</span>
              </div>
              {/* Highlight */}
              <div className="absolute top-4 left-6 w-8 h-4 rounded-full bg-white/30 rotate-[-35deg] blur-[1px]" />
            </div>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Nome Gravado
          </div>
        </div>
      );

    case 'snowflakes':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#081824] via-[#071f1a] to-[#040e0b] ${className}`}>
          <div className="relative z-10 flex items-center justify-center">
            <svg className="w-40 h-40 filter drop-shadow-[0_8px_18px_rgba(255,255,255,0.2)]" viewBox="0 0 120 120">
              {/* 6-fold Fractal Snowflake */}
              <g stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" fill="none">
                {/* 6 Main Arms */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <g key={i} transform={`rotate(${angle} 60 60)`}>
                    <line x1="60" y1="60" x2="60" y2="12" />
                    {/* Branchlets */}
                    <line x1="60" y1="40" x2="50" y2="30" />
                    <line x1="60" y1="40" x2="70" y2="30" />
                    <line x1="60" y1="26" x2="52" y2="18" />
                    <line x1="60" y1="26" x2="68" y2="18" />
                    <circle cx="60" cy="12" r="2" fill="#FFE5A3" stroke="none" />
                  </g>
                ))}
                {/* Center Hexagon Core */}
                <polygon points="60,52 67,56 67,64 60,68 53,64 53,56" fill="#F8FAFC" opacity="0.9" />
              </g>
            </svg>
          </div>
          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Kit 6 Modelos
          </div>
        </div>
      );

    case 'village':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0e1624] via-[#091b15] to-[#030c08] ${className}`}>
          {/* Ambient Warm Windows Glow */}
          <div className="relative z-10 flex items-end justify-center gap-1.5 pt-4">
            {/* Alpine House 1 */}
            <div className="w-16 h-28 bg-gradient-to-b from-slate-100 to-slate-300 rounded-t-xs relative shadow-lg">
              {/* Steep Roof */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[36px] border-l-transparent border-r-[36px] border-r-transparent border-b-[28px] border-b-rose-900" />
              {/* Glowing window */}
              <div className="absolute top-4 left-3 w-4 h-5 bg-amber-300 rounded-t-xs shadow-[0_0_8px_#f59e0b]" />
              <div className="absolute top-4 right-3 w-4 h-5 bg-amber-300 rounded-t-xs shadow-[0_0_8px_#f59e0b]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-8 bg-amber-950 rounded-t-xs" />
            </div>

            {/* Alpine Tower House 2 */}
            <div className="w-14 h-34 bg-gradient-to-b from-amber-50 to-amber-200 rounded-t-xs relative shadow-xl">
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[36px] border-b-emerald-900" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-amber-300 rounded-t-xs shadow-[0_0_8px_#f59e0b]" />
              <div className="absolute top-14 left-1/2 -translate-x-1/2 w-4 h-6 bg-amber-300 rounded-t-xs shadow-[0_0_8px_#f59e0b]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-8 bg-amber-950 rounded-t-xs" />
            </div>

            {/* Alpine House 3 */}
            <div className="w-12 h-22 bg-gradient-to-b from-slate-100 to-slate-200 rounded-t-xs relative shadow-md">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[24px] border-b-amber-700" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-5 bg-amber-300 rounded-t-xs shadow-[0_0_8px_#f59e0b]" />
            </div>
          </div>
          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            3 Casinhas + LED
          </div>
        </div>
      );

    case 'snowman':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#091f24] via-[#071d18] to-[#040e0b] ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            {/* Top Hat */}
            <div className="w-8 h-10 bg-slate-900 rounded-t-xs relative">
              <div className="absolute -bottom-1 -left-2 w-12 h-2 bg-slate-950 rounded-full" />
              <div className="absolute bottom-1 left-0 right-0 h-1.5 bg-rose-600" />
            </div>
            {/* Head */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-white to-slate-200 relative shadow-md -mt-1 flex items-center justify-center">
              {/* Eyes */}
              <div className="absolute top-5 left-4 w-2 h-2 rounded-full bg-slate-900" />
              <div className="absolute top-5 right-4 w-2 h-2 rounded-full bg-slate-900" />
              {/* Carrot Nose */}
              <div className="w-5 h-2 bg-amber-500 rounded-r-full rotate-6 shadow-xs mt-1" />
            </div>
            {/* Red Scarf */}
            <div className="w-20 h-4 bg-rose-600 rounded-full shadow-md z-10 -mt-2" />
            {/* Body */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white to-slate-300 shadow-xl -mt-2 flex flex-col items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-900" />
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>
          </div>
          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Flexi Articulado
          </div>
        </div>
      );

    case 'cookie_cutter':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#220e10] via-[#122018] to-[#040e09] ${className}`}>
          <div className="relative z-10 flex items-center justify-center">
            <svg className="w-36 h-36 filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
              {/* Tree cookie cutter silhouette blade */}
              <path
                d="M50 15 L62 35 L55 35 L68 55 L60 55 L75 75 L55 75 L55 85 L45 85 L45 75 L25 75 L40 55 L32 55 L45 35 L38 35 Z"
                fill="none"
                stroke={primaryColor}
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M50 15 L62 35 L55 35 L68 55 L60 55 L75 75 L55 75 L55 85 L45 85 L45 75 L25 75 L40 55 L32 55 L45 35 L38 35 Z"
                fill="none"
                stroke="#FFE5A3"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute bottom-2.5 right-3 text-[11px] font-medium tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Design Natalino
          </div>
        </div>
      );

    case 'personalized_tree_sign':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a2217] via-[#051710] to-[#020b07] ${className}`}>
          {/* Bokeh lights */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-3 left-6 h-14 w-14 rounded-full bg-amber-400/25 blur-xl" />
            <div className="absolute bottom-4 right-6 h-16 w-16 rounded-full bg-rose-500/25 blur-xl" />
          </div>

          {/* 3D Sign Mockup */}
          <div className="relative z-10 flex flex-col items-center max-w-[240px] w-full px-2">
            <svg viewBox="0 0 280 180" className="w-full filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)]">
              {/* Left Pine Tree */}
              <g transform="translate(18, 15)">
                {/* Tree tiers in emerald green */}
                <polygon points="45,28 62,56 52,56 70,88 58,88 80,126 10,126 32,88 20,88 38,56 28,56" fill="#15803D" stroke="#0D5025" strokeWidth="2" />
                {/* White snow dots on tree */}
                <circle cx="36" cy="62" r="2.5" fill="#FFF" />
                <circle cx="56" cy="74" r="2.5" fill="#FFF" />
                <circle cx="28" cy="100" r="3" fill="#FFF" />
                <circle cx="48" cy="108" r="3" fill="#FFF" />
                <circle cx="68" cy="114" r="3" fill="#FFF" />
                {/* Yellow Star at tree apex */}
                <polygon points="45,10 49,22 62,22 51,30 55,42 45,34 35,42 39,30 28,22 41,22" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
              </g>

              {/* Script "Feliz" in Red with green outline */}
              <g transform="translate(100, 32)">
                <text x="0" y="38" fontFamily="sans-serif" fontSize="42" fontStyle="italic" fontWeight="900" fill="#DC2626" stroke="#15803D" strokeWidth="4" paintOrder="stroke fill">
                  Feliz
                </text>
              </g>

              {/* Bold "NATAL" in White */}
              <g transform="translate(95, 82)">
                <text x="0" y="44" fontFamily="sans-serif" fontSize="50" fontWeight="900" letterSpacing="4" fill="#FFFFFF" stroke="#04150e" strokeWidth="3" paintOrder="stroke fill">
                  NATAL
                </text>
              </g>

              {/* Green Base Stand with Personalized Engraving */}
              <rect x="25" y="142" width="230" height="24" rx="4" fill="#15803D" stroke="#0E5E2B" strokeWidth="2" />
              <rect x="40" y="146" width="200" height="16" rx="3" fill="#0D5326" />
              <text x="140" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="9.5" fontWeight="bold" fill="#FDE047" letterSpacing="1">
                Família Silva | 2026
              </text>
            </svg>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/90 bg-black/75 px-2 py-0.5 rounded border border-amber-500/40 backdrop-blur-xs shadow-md">
            Personalizável
          </div>
        </div>
      );

    case 'snowflake_name_mandala':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#061d15] via-[#092b1e] to-[#04140e] ${className}`}>
          {/* Bokeh lights like Christmas Tree branches */}
          <div className="absolute inset-0 opacity-45">
            <div className="absolute top-2 left-8 h-16 w-16 rounded-full bg-amber-400/20 blur-xl" />
            <div className="absolute bottom-2 right-8 h-16 w-16 rounded-full bg-emerald-400/25 blur-xl" />
          </div>

          {/* Hanging string */}
          <div className="absolute top-0 w-[1.5px] h-7 bg-amber-200/70" />

          {/* Detailed Snowflake Mandala with Cursive Name */}
          <div className="relative z-10 flex flex-col items-center justify-center mt-3">
            <svg viewBox="0 0 200 200" className="w-40 h-40 filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.7)]">
              {/* Hanging Loop */}
              <circle cx="100" cy="14" r="5" fill="none" stroke={primaryColor} strokeWidth="2.5" />

              {/* Outer Ring of Snowflake Crystals */}
              <g stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <g key={deg} transform={`rotate(${deg} 100 100)`}>
                    <line x1="100" y1="36" x2="100" y2="18" />
                    <polyline points="93,28 100,21 107,28" />
                    <polyline points="95,33 100,28 105,33" />
                  </g>
                ))}
              </g>

              {/* Concentric Double Circles */}
              <circle cx="100" cy="100" r="64" fill="none" stroke={primaryColor} strokeWidth="4.5" />
              <circle cx="100" cy="100" r="56" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.75" />

              {/* Central Name suspended in 3D: "Aline" or customizable name */}
              <text
                x="100"
                y="112"
                textAnchor="middle"
                fontFamily="cursive, serif"
                fontSize="38"
                fontStyle="italic"
                fontWeight="bold"
                fill={primaryColor}
                stroke="#04150f"
                strokeWidth="1"
                paintOrder="stroke fill"
              >
                Aline
              </text>
            </svg>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/90 bg-black/75 px-2 py-0.5 rounded border border-amber-500/40 backdrop-blur-xs shadow-md">
            Nome Gravado 3D
          </div>
        </div>
      );

    case 'napkin_rings_set':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0c2419] via-[#071912] to-[#030e09] ${className}`}>
          {/* Festive table glow */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-4 left-6 h-12 w-12 rounded-full bg-amber-400/25 blur-xl" />
            <div className="absolute bottom-6 right-8 h-16 w-16 rounded-full bg-rose-500/20 blur-xl" />
          </div>

          {/* 6 Napkin Rings Display on Rolled Napkins */}
          <div className="relative z-10 w-full px-3 py-2 flex flex-col items-center">
            <svg viewBox="0 0 280 160" className="w-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
              {/* 6 Rolled Napkins with 3D Silhouette Rings on top */}
              {[
                { x: 24, name: 'Snowman', icon: 'M 24 38 A 6 6 0 1 0 24 26 A 4 4 0 1 0 24 18 M 18 18 L 30 18' },
                { x: 68, name: 'Star', icon: 'M 68 18 L 72 27 L 82 27 L 74 33 L 77 43 L 68 37 L 59 43 L 62 33 L 54 27 L 64 27 Z' },
                { x: 112, name: 'Noel', icon: 'M 104 28 Q 112 18 120 28 L 118 36 Q 112 42 106 36 Z M 112 18 Q 115 14 118 18' },
                { x: 156, name: 'Gift', icon: 'M 148 24 L 164 24 L 164 40 L 148 40 Z M 156 24 L 156 40 M 148 32 L 164 32 M 151 20 Q 156 16 161 20' },
                { x: 200, name: 'Reindeer', icon: 'M 194 36 Q 200 24 204 32 L 208 30 M 198 22 L 202 26' },
                { x: 244, name: 'Antlers', icon: 'M 238 34 Q 244 38 250 34 M 238 28 L 234 20 M 250 28 L 254 20' },
              ].map((ring, idx) => (
                <g key={idx}>
                  {/* Rolled Napkin (Cream white cylinder) */}
                  <rect x={ring.x - 12} y="54" width="24" height="78" rx="10" fill="#F5F5F0" stroke="#DDD" strokeWidth="1" />
                  <ellipse cx={ring.x} cy="126" rx="10" ry="4" fill="#E5E5DC" />

                  {/* Ring Band encircling the napkin */}
                  <rect x={ring.x - 14} y="50" width="28" height="10" rx="3" fill={primaryColor} stroke="#000" strokeWidth="0.8" />

                  {/* Silhouette Figure in Selected Color */}
                  <path d={ring.icon} fill={primaryColor} stroke="#FFE5A3" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ))}
            </svg>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/90 bg-black/75 px-2 py-0.5 rounded border border-amber-500/40 backdrop-blur-xs shadow-md">
            Kit 6 Peças
          </div>
        </div>
      );

    case 'decorative_tree':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a140a] via-[#101b12] to-[#050e08] ${className}`}>
          {/* Holiday warm bokeh background */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-2 left-6 h-16 w-16 rounded-full bg-amber-400/20 blur-xl" />
            <div className="absolute top-8 right-6 h-12 w-12 rounded-full bg-rose-500/25 blur-lg" />
            <div className="absolute bottom-4 left-10 h-14 w-14 rounded-full bg-yellow-300/15 blur-lg" />
          </div>

          {/* 3D Decorative Pine Tree Mockup */}
          <div className="relative z-10 flex flex-col items-center">
            <svg viewBox="0 0 200 240" className="w-36 h-44 filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.7)]">
              {/* Radial table light glow */}
              <ellipse cx="100" cy="225" rx="60" ry="12" fill="#030805" opacity="0.6" />

              {/* Wooden fluted trunk base */}
              <g id="tree-trunk">
                <polygon points="80,225 120,225 114,195 86,195" fill="#5c2c10" stroke="#3d1b06" strokeWidth="1.5" />
                {/* Fluted lines on trunk */}
                <line x1="88" y1="225" x2="91" y2="195" stroke="#3d1b06" strokeWidth="1.5" />
                <line x1="96" y1="225" x2="97" y2="195" stroke="#7a3d16" strokeWidth="1.5" />
                <line x1="104" y1="225" x2="103" y2="195" stroke="#7a3d16" strokeWidth="1.5" />
                <line x1="112" y1="225" x2="109" y2="195" stroke="#3d1b06" strokeWidth="1.5" />
              </g>

              {/* Tier 4 (Bottom-most widest scalloped branches) */}
              <g id="tier-4">
                <path d="M 50,198 C 50,165 75,150 100,150 C 125,150 150,165 150,198 C 140,206 130,198 120,202 C 110,206 100,200 90,204 C 80,200 70,206 60,200 C 54,202 50,200 50,198 Z" 
                      fill="#156e35" stroke="#0e4a23" strokeWidth="1.5" />
                {/* Vertical needle ridges */}
                <path d="M 65,198 Q 78,170 100,152" fill="none" stroke="#22964b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 85,202 Q 92,175 100,152" fill="none" stroke="#22964b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 100,202 L 100,152" fill="none" stroke="#2cd46c" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 115,202 Q 108,175 100,152" fill="none" stroke="#12572a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 135,198 Q 122,170 100,152" fill="none" stroke="#0e4722" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Tier 3 (Middle-lower) */}
              <g id="tier-3">
                <path d="M 58,162 C 58,135 78,122 100,122 C 122,122 142,135 142,162 C 134,168 126,162 118,166 C 110,168 100,164 92,167 C 82,164 74,168 66,163 Z" 
                      fill="#197a3c" stroke="#105228" strokeWidth="1.5" />
                <path d="M 72,163 Q 84,140 100,124" fill="none" stroke="#28ad57" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 90,165 Q 95,142 100,124" fill="none" stroke="#28ad57" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 100,165 L 100,124" fill="none" stroke="#3bf27d" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 110,165 Q 105,142 100,124" fill="none" stroke="#145e2f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 128,163 Q 116,140 100,124" fill="none" stroke="#105027" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Tier 2 (Middle-upper) */}
              <g id="tier-2">
                <path d="M 68,128 C 68,105 82,94 100,94 C 118,94 132,105 132,128 C 124,133 116,128 108,132 C 100,133 92,129 84,132 C 76,129 70,133 68,128 Z" 
                      fill="#1d8c44" stroke="#125a2c" strokeWidth="1.5" />
                <path d="M 80,130 Q 90,110 100,96" fill="none" stroke="#34c767" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 100,132 L 100,96" fill="none" stroke="#48f58b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 120,130 Q 110,110 100,96" fill="none" stroke="#146631" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Tier 1 (Top cone) */}
              <g id="tier-1">
                <path d="M 78,96 C 78,74 88,64 100,64 C 112,64 122,74 122,96 C 114,100 106,96 100,99 C 94,96 86,100 78,96 Z" 
                      fill="#229e4d" stroke="#166632" strokeWidth="1.5" />
                <path d="M 88,96 Q 94,80 100,66" fill="none" stroke="#48f58b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 100,98 L 100,66" fill="none" stroke="#68ff9e" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 112,96 Q 106,80 100,66" fill="none" stroke="#177338" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* 3D Golden Star on Top with faceted shading */}
              <g id="golden-star" transform="translate(100, 52)">
                <polygon points="0,-24 7,-8 23,-8 11,4 16,19 0,9 -16,19 -11,4 -23,-8 -7,-8" 
                         fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                {/* Star center facet highlights */}
                <polygon points="0,-24 0,0 -7,-8" fill="#fbbf24" />
                <polygon points="23,-8 0,0 7,-8" fill="#fde68a" />
                <polygon points="16,19 0,0 11,4" fill="#d97706" />
                <polygon points="-16,19 0,0 0,9" fill="#b45309" />
                <polygon points="-23,-8 0,0 -11,4" fill="#d97706" />
              </g>
            </svg>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/90 bg-black/75 px-2 py-0.5 rounded border border-amber-500/40 backdrop-blur-xs shadow-md">
            Árvore Decorativa
          </div>
        </div>
      );

    case 'nativity_lamp':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1c1208] via-[#121c15] to-[#060e0a] ${className}`}>
          {/* Warm background glow from lamp */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-amber-400/30 blur-2xl animate-pulse" />
            <div className="h-24 w-24 rounded-full bg-yellow-200/25 blur-xl" />
          </div>

          {/* 3D Nativity Arch Lamp Mockup */}
          <div className="relative z-10 flex flex-col items-center max-w-[240px] w-full px-2">
            <svg viewBox="0 0 260 200" className="w-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
              {/* Table shadow */}
              <ellipse cx="130" cy="192" rx="100" ry="8" fill="#000" opacity="0.6" />

              {/* White Luminary Base Stand */}
              <rect x="25" y="174" width="210" height="16" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
              <rect x="30" y="176" width="200" height="4" fill="#ffffff" />

              {/* Outer Semicircular Arch Dome */}
              <path d="M 40,174 A 90,90 0 0,1 220,174 Z" fill="#ffffff" stroke="#e5e7eb" strokeWidth="3" />
              <path d="M 48,174 A 82,82 0 0,1 212,174 Z" fill="#fdfbf7" opacity="0.95" />

              {/* Inner Warm LED Glow Chamber */}
              <circle cx="130" cy="148" r="42" fill="url(#warm-nativity-glow)" />

              {/* SVG Defs for warm inner light */}
              <defs>
                <radialGradient id="warm-nativity-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#fde047" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Star of Bethlehem at Arch Apex */}
              <g transform="translate(130, 92)">
                <polygon points="0,-16 4,-5 15,-5 7,2 10,13 0,6 -10,13 -7,2 -15,-5 -4,-5" 
                         fill="#fde047" stroke="#eab308" strokeWidth="1" />
                <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                {/* Light rays from star */}
                <line x1="0" y1="14" x2="0" y2="30" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
              </g>

              {/* Stable Silhouettes inside arch */}
              <g stroke="#ffffff" strokeWidth="2.5" fill="#ffffff" strokeLinecap="round" strokeLinejoin="round">
                {/* Roof beam */}
                <polyline points="95,145 130,118 165,145" fill="none" strokeWidth="4" />
                {/* Vertical posts */}
                <line x1="105" y1="145" x2="105" y2="174" strokeWidth="3" />
                <line x1="155" y1="145" x2="155" y2="174" strokeWidth="3" />
              </g>

              {/* Silhouettes of Holy Family & Nativity Figures (White 3D Layered Look) */}
              {/* Joseph on left */}
              <g fill="#ffffff">
                <circle cx="112" cy="136" r="4" />
                <path d="M 108,142 C 108,142 112,142 116,142 C 117,152 118,162 118,174 L 106,174 C 106,162 107,152 108,142 Z" />
                <line x1="105" y1="134" x2="104" y2="174" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Mary kneeling on right */}
              <g fill="#ffffff">
                <circle cx="148" cy="142" r="3.5" />
                <path d="M 144,148 C 144,148 152,148 152,154 C 152,160 154,166 156,174 L 140,174 C 140,166 142,156 144,148 Z" />
              </g>

              {/* Manger with Baby Jesus & Halo in the center */}
              <g>
                {/* Glowing halo behind baby */}
                <circle cx="130" cy="156" r="10" fill="#fef08a" opacity="0.8" />
                {/* Manger box */}
                <path d="M 122,162 L 138,162 L 135,174 L 125,174 Z" fill="#ffffff" />
                {/* Criss-cross legs */}
                <line x1="122" y1="162" x2="124" y2="174" stroke="#e5e7eb" strokeWidth="1.5" />
                <line x1="138" y1="162" x2="136" y2="174" stroke="#e5e7eb" strokeWidth="1.5" />
                {/* Swaddled Baby Jesus */}
                <ellipse cx="130" cy="160" rx="5" ry="3" fill="#ffffff" />
                <circle cx="128" cy="158" r="2.5" fill="#fef9c3" />
              </g>

              {/* Left Wise Men silhouettes */}
              <g fill="#f3f4f6" opacity="0.95">
                <circle cx="68" cy="144" r="3.5" />
                <path d="M 64,150 C 64,150 72,150 72,156 C 72,162 74,168 76,174 L 62,174 Z" />
                <circle cx="84" cy="147" r="3.5" />
                <path d="M 80,152 C 80,152 88,152 88,158 C 88,164 89,169 90,174 L 78,174 Z" />
              </g>

              {/* Right Shepherd and Sheep */}
              <g fill="#f3f4f6" opacity="0.95">
                <circle cx="178" cy="143" r="3.5" />
                <path d="M 174,148 C 174,148 182,148 182,154 C 182,160 184,166 186,174 L 172,174 Z" />
                {/* Little lamb */}
                <ellipse cx="168" cy="168" rx="6" ry="4" fill="#ffffff" />
                <circle cx="164" cy="166" r="2.5" fill="#ffffff" />
              </g>
            </svg>
          </div>

          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/90 bg-black/75 px-2 py-0.5 rounded border border-amber-500/40 backdrop-blur-xs shadow-md">
            Luminária LED
          </div>
        </div>
      );

    case 'napkin_ring':
    default:
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#180a0e] via-[#091b14] to-[#040e09] ${className}`}>
          <div className="relative z-10 flex items-center justify-center">
            <svg className="w-36 h-36 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]" viewBox="0 0 120 120">
              <ellipse cx="60" cy="65" rx="42" ry="26" fill="none" stroke={primaryColor} strokeWidth="12" />
              <ellipse cx="60" cy="65" rx="42" ry="26" fill="none" stroke="#FFE5A3" strokeWidth="2" strokeOpacity="0.8" />
              {/* Top Pine Motif Ornament */}
              <polygon points="60,20 72,42 48,42" fill={primaryColor} stroke="#FFE5A3" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tracking-tight text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-xs">
            Mesa Posta
          </div>
        </div>
      );
  }
};
