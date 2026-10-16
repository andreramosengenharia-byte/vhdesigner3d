import React, { useState } from 'react';
import { BRAND_CONFIG } from '../config/branding';

interface LogoProps {
  customLogoUrl?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  customLogoUrl,
  className = '',
  size = 'md',
}) => {
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  // Generous height dimensions for high visual impact
  const heights = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16 md:h-20',
    lg: 'h-20 sm:h-24 md:h-28',
    xl: 'h-28 sm:h-32 md:h-36',
  };

  const candidates = [
    customLogoUrl,
    BRAND_CONFIG.logoUrl,
    '/logo.png',
    '/logo.svg',
  ].filter(Boolean) as string[];

  const activeLogo = candidates.find((url) => !failedUrls.has(url)) || null;

  return (
    <div className={`flex items-center ${className}`}>
      {activeLogo ? (
        <img
          src={activeLogo}
          alt={BRAND_CONFIG.name}
          className={`${heights[size]} w-auto max-w-[280px] sm:max-w-[340px] object-contain filter drop-shadow-[0_4px_12px_rgba(212,154,37,0.35)] transition-transform duration-200 hover:scale-[1.03]`}
          onError={() => {
            setFailedUrls((prev) => new Set(prev).add(activeLogo));
          }}
        />
      ) : (
        <span className="text-2xl sm:text-3xl font-extrabold font-cinzel tracking-tight gold-text-gradient">
          {BRAND_CONFIG.name}
        </span>
      )}
    </div>
  );
};
