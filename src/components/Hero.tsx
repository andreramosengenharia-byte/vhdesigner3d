import React from 'react';
import { Sparkles, ArrowRight, Palette, Layers, Box, Gift, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenCustomizer: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenCustomizer,
}) => {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background festive atmospheric glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Brand, Headlines and CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start z-10 text-left">
          {/* Subtle Brand Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-[#06241a]/90 backdrop-blur-md text-xs font-semibold text-amber-300 shadow-md mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
            <span className="tracking-wide uppercase font-cinzel">VHDESIGNER3d • Edição Especial de Natal</span>
          </div>

          {/* Main Title from Prompt */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-cinzel text-white tracking-tight leading-[1.12]">
            O Natal ganha uma{' '}
            <span className="gold-text-gradient drop-shadow-sm">
              nova dimensão.
            </span>
          </h1>

          {/* Subtitle from Prompt */}
          <p className="mt-6 text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed font-sans">
            Decorações e presentes criativos feitos em impressão 3D para tornar seu Natal ainda mais especial.
          </p>

          {/* Prompt CTAs: Botão principal "Explorar catálogo" + Botão secundário "Personalize sua ideia" */}
          <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onExploreCatalog}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explorar catálogo</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              type="button"
              onClick={onOpenCustomizer}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-emerald-700/80 bg-[#07261a]/90 hover:bg-[#0c3625] hover:border-amber-400/60 text-slate-100 font-semibold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Palette className="w-4 h-4 text-amber-300" />
              <span>Personalize sua ideia</span>
            </button>
          </div>

          {/* Christmas trust highlights */}
          <div className="mt-10 pt-6 border-t border-emerald-900/60 grid grid-cols-3 gap-4 w-full max-w-lg text-slate-300">
            <div>
              <span className="block text-lg font-bold text-amber-300 font-cinzel">Alta Precisão</span>
              <span className="text-[11px] text-slate-400">Acabamento Impecável</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-emerald-400 font-cinzel">Sob Demanda</span>
              <span className="text-[11px] text-slate-400">Peças Personalizadas</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-rose-400 font-cinzel">Brasil</span>
              <span className="text-[11px] text-slate-400">Envio para todo o país</span>
            </div>
          </div>
        </div>

        {/* Right Column: Christmas Tree with 3D Printed Ornaments & Gifts */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Glowing pedestal backing */}
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl border border-emerald-800/50 bg-gradient-to-b from-[#0b3322] via-[#072418] to-[#04130d] p-6 shadow-2xl overflow-hidden flex flex-col items-center justify-between">
            {/* Ambient Christmas fairy lights inside frame */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-6 left-8 w-16 h-16 rounded-full bg-amber-400/25 blur-xl animate-pulse" />
              <div className="absolute bottom-16 right-6 w-20 h-20 rounded-full bg-rose-500/25 blur-2xl" />
            </div>

            {/* Top Star of the Christmas Tree */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <svg className="w-12 h-12 text-amber-300 filter drop-shadow-[0_0_12px_#f59e0b] animate-pulse" viewBox="0 0 24 24">
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#FDE047" stroke="#D49A25" strokeWidth="1" />
                </svg>
              </div>

              {/* The Grand 3D Christmas Tree */}
              <svg className="w-64 sm:w-72 h-72 sm:h-80 filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.65)]" viewBox="0 0 260 300">
                <defs>
                  <linearGradient id="tree-pine-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14532D" />
                    <stop offset="50%" stopColor="#064E3B" />
                    <stop offset="100%" stopColor="#022C22" />
                  </linearGradient>
                  <linearGradient id="trunk-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#451A03" />
                    <stop offset="50%" stopColor="#78350F" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>
                </defs>

                {/* Trunk */}
                <rect x="115" y="240" width="30" height="40" rx="3" fill="url(#trunk-grad)" />

                {/* Layer 1 (Top Tier) */}
                <polygon points="130,25 175,85 85,85" fill="url(#tree-pine-grad)" stroke="#15803D" strokeWidth="1.5" />
                {/* Layer 2 */}
                <polygon points="130,70 195,145 65,145" fill="url(#tree-pine-grad)" stroke="#15803D" strokeWidth="1.5" />
                {/* Layer 3 */}
                <polygon points="130,125 215,205 45,205" fill="url(#tree-pine-grad)" stroke="#15803D" strokeWidth="1.5" />
                {/* Layer 4 (Base Tier) */}
                <polygon points="130,175 235,255 25,255" fill="url(#tree-pine-grad)" stroke="#15803D" strokeWidth="1.5" />

                {/* 3D Printed Geometric Baubles on Tree */}
                {/* Gold Silk Bauble */}
                <circle cx="105" cy="110" r="10" fill="#D49A25" stroke="#FFE5A3" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
                <path d="M100 110 L110 110 M105 105 L105 115" stroke="#FFE5A3" strokeWidth="1" />

                {/* Ruby Voronoi Bauble */}
                <circle cx="155" cy="125" r="11" fill="#991B1B" stroke="#FCA5A5" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
                <polygon points="155,118 162,125 155,132 148,125" fill="none" stroke="#FCA5A5" strokeWidth="1" />

                {/* Snow White Bauble */}
                <circle cx="85" cy="175" r="11" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />

                {/* Gold Bauble 2 */}
                <circle cx="170" cy="180" r="12" fill="#D49A25" stroke="#FFE5A3" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
                <polygon points="170,172 178,180 170,188 162,180" fill="none" stroke="#FFE5A3" strokeWidth="1" />

                {/* Red Bauble 3 */}
                <circle cx="125" cy="165" r="10" fill="#991B1B" stroke="#FCA5A5" strokeWidth="1.5" />

                {/* Lower Tier Ornaments */}
                <circle cx="60" cy="235" r="12" fill="#D49A25" stroke="#FFE5A3" strokeWidth="1.5" />
                <circle cx="195" cy="235" r="12" fill="#991B1B" stroke="#FCA5A5" strokeWidth="1.5" />
                <circle cx="130" cy="225" r="11" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

                {/* Twinkling micro fairy lights on branches */}
                <circle cx="120" cy="55" r="3" fill="#FEF08A" filter="drop-shadow(0 0 5px #FBBF24)" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="140" cy="95" r="3" fill="#F87171" filter="drop-shadow(0 0 5px #EF4444)" />
                <circle cx="110" cy="140" r="3.5" fill="#FEF08A" filter="drop-shadow(0 0 5px #FBBF24)" />
                <circle cx="150" cy="155" r="3" fill="#6EE7B7" filter="drop-shadow(0 0 5px #10B981)" />
                <circle cx="100" cy="205" r="3.5" fill="#FEF08A" filter="drop-shadow(0 0 5px #FBBF24)" />
                <circle cx="165" cy="215" r="3.5" fill="#F87171" filter="drop-shadow(0 0 5px #EF4444)" />
              </svg>
            </div>

            {/* Christmas Gift Boxes surrounding the pine base */}
            <div className="relative z-10 w-full flex items-end justify-center gap-3 -mt-4">
              {/* Gift 1: Crimson box with Gold Ribbon */}
              <div className="relative w-16 h-14 bg-gradient-to-tr from-rose-950 via-rose-800 to-rose-700 rounded-lg shadow-xl border border-rose-600/40 flex items-center justify-center">
                <div className="absolute inset-y-0 w-3 bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
                <div className="absolute inset-x-0 h-3 bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
                <div className="absolute -top-2 w-4 h-3 rounded-full border-2 border-amber-400 bg-amber-500" />
              </div>

              {/* Gift 2: Gold Silk box with Emerald Ribbon */}
              <div className="relative w-20 h-18 bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-400 rounded-lg shadow-2xl border border-amber-300/50 flex items-center justify-center">
                <div className="absolute inset-y-0 w-3.5 bg-emerald-900" />
                <div className="absolute inset-x-0 h-3.5 bg-emerald-900" />
                <div className="absolute -top-2.5 w-5 h-4 rounded-full border-2 border-emerald-900 bg-emerald-800" />
              </div>

              {/* Gift 3: Forest Pine box with Gold Ribbon */}
              <div className="relative w-14 h-12 bg-gradient-to-tr from-emerald-950 via-emerald-800 to-emerald-700 rounded-lg shadow-lg border border-emerald-600/30 flex items-center justify-center">
                <div className="absolute inset-y-0 w-2.5 bg-amber-400" />
                <div className="absolute inset-x-0 h-2.5 bg-amber-400" />
                <div className="absolute -top-1.5 w-3.5 h-2.5 rounded-full border-2 border-amber-400 bg-amber-500" />
              </div>
            </div>

            {/* Floating 3D Badge on tree card */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-xl bg-black/70 px-3 py-1.5 border border-amber-400/30 backdrop-blur-md text-[11px] font-mono text-amber-200">
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Impressão 3D VHDESIGNER3d</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
