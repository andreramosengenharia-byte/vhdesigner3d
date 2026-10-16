import React from 'react';
import { MessageCircle, Heart, Sparkles, Send, Edit3, Lock, Unlock } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  customLogoUrl?: string | null;
  onOpenLogoSettings?: () => void;
  isAdmin?: boolean;
  onToggleAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  customLogoUrl,
  onOpenLogoSettings,
  isAdmin = false,
  onToggleAdmin,
}) => {
  return (
    <footer className="relative bg-[#04120c] border-t border-emerald-950 text-slate-400 text-xs overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Subtle festive pine background divider */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center">
              <Logo customLogoUrl={customLogoUrl} size="lg" />
            </a>
            {isAdmin && onOpenLogoSettings && (
              <button
                type="button"
                onClick={onOpenLogoSettings}
                className="text-[10px] text-amber-400 hover:text-amber-200 underline opacity-70 hover:opacity-100 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Painel: Trocar Logo</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Especialistas em fabricação digital e impressão 3D de alta precisão. Peças autorais, decorações natalinas e presentes personalizados para celebrar a magia do Natal.
          </p>
          <div className="pt-2 text-amber-300/90 flex items-center gap-2 text-xs font-serif italic">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>O Natal ganha uma nova dimensão em 3D.</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
            Navegação Festiva
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a href="#catalogo" className="hover:text-amber-300 transition-colors">
                Catálogo de Enfeites
              </a>
            </li>
            <li>
              <a href="#personalize" className="hover:text-amber-300 transition-colors">
                Personalize sua Ideia
              </a>
            </li>
            <li>
              <a href="#sobre" className="hover:text-amber-300 transition-colors">
                Qualidade & Sustentabilidade
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Orders */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
            Atendimento & Encomendas
          </h4>
          <p className="text-xs text-slate-300">
            WhatsApp: <strong className="text-amber-300">(13) 98843-7321</strong>
          </p>
          <a
            href="https://wa.me/5513988437321?text=Ol%C3%A1%20VHDESIGNER3d!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20pe%C3%A7as%20de%20Natal."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Falar no WhatsApp (13) 98843-7321</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} VHDESIGNER3d. Todos os direitos reservados. Feito para o Natal.</p>
        <div className="flex items-center gap-4">
          <p className="flex items-center justify-center gap-1">
            Feito com carinho natalino e tecnologia 3D no Brasil.
          </p>
          {onToggleAdmin && (
            <button
              type="button"
              onClick={onToggleAdmin}
              title="Atalho: Alt + L"
              className="text-slate-500 hover:text-amber-300 transition-colors flex items-center gap-1 text-[10px] opacity-60 hover:opacity-100"
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>Modo Lojista Ativo (Sair)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Acesso Lojista (Alt+L)</span>
                </>
              )}
            </button>
          )}
          {isAdmin && (
            <a
              href="/vhdesigner3d-completo.zip"
              download="vhdesigner3d-completo.zip"
              title="Baixar arquivos completos com todas as fotos para atualizar no GitHub / Vercel"
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 text-[10px] bg-emerald-950/90 border border-amber-400/50 px-2 py-1 rounded transition-colors shadow-sm"
            >
              <span>📦 Baixar Projeto (.ZIP) para Vercel</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
