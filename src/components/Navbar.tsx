import React from 'react';
import { ShoppingBag, Edit3 } from 'lucide-react';
import { ChristmasGarland } from './ChristmasGarland';
import { Logo } from './Logo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  customLogoUrl: string | null;
  onOpenLogoSettings: () => void;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  customLogoUrl,
  onOpenLogoSettings,
  isAdmin = false,
}) => {
  const [clickCount, setClickCount] = React.useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Secret triple-click on logo for owner to open logo settings
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setClickCount(0);
      onOpenLogoSettings();
    } else {
      setTimeout(() => setClickCount(0), 1000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-900/60 bg-[#061d15]/95 backdrop-blur-md">
      {/* Festoon fairy lights hanging along the top bar */}
      <ChristmasGarland />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3 pt-4">
        {/* Zone 1: Single text element Brand Zone with Logo */}
        <div className="group relative flex items-center gap-2">
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] shrink-0 cursor-pointer"
            title="VHDESIGNER3d"
          >
            <Logo customLogoUrl={customLogoUrl} size="md" />
          </a>

          {/* Quick Change Logo Button - ONLY visible to ADMIN/OWNER */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenLogoSettings}
              title="Painel do Dono: Clique para alterar a logo"
              className="hidden sm:flex items-center gap-1 opacity-80 hover:opacity-100 bg-emerald-950/90 hover:bg-emerald-900 border border-amber-400/60 text-[10px] text-amber-300 px-2 py-1 rounded-md transition-all ml-1 shadow-sm"
            >
              <Edit3 className="w-3 h-3 text-amber-400" />
              <span>Painel: Trocar Logo</span>
            </button>
          )}
        </div>

        {/* Zone 2: concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-emerald-100/80">
          <a
            href="#catalogo"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </a>
          <a
            href="#personalize"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Personalizar Bola com Nome
          </a>
          <a
            href="#sobre"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Qualidade
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Carrinho</span>
            <span className="rounded-full bg-slate-950 text-amber-300 px-1.5 py-0.2 text-[10px] font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
