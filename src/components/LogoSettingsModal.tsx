import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, RotateCcw, Check, Sparkles, FolderCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string | null;
  onSaveLogo: (url: string | null) => void;
}

export const LogoSettingsModal: React.FC<LogoSettingsModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSaveLogo,
}) => {
  const [inputUrl, setInputUrl] = useState(currentLogo || '');
  const [preview, setPreview] = useState<string | null>(currentLogo);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Por favor, selecione uma imagem menor que 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        setInputUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onSaveLogo(preview);
    setFeedback('Logo atualizada com sucesso!');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setPreview('/logo.svg');
    setInputUrl('/logo.svg');
    onSaveLogo('/logo.svg');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-400/40 bg-[#07241a] p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-bold font-cinzel text-white">
              Adicionar ou Trocar Logo da VHDESIGNER3d
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-emerald-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview of the Logo */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-emerald-900/80 bg-[#04150f]">
          <span className="text-[11px] font-mono uppercase text-slate-400 mb-3">Prévia em fundo escuro:</span>
          <div className="h-28 flex items-center justify-center max-w-sm w-full">
            {preview ? (
              <img
                src={preview}
                alt="Prévia da Logo"
                className="max-h-24 max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(212,154,37,0.35)]"
                onError={() => {
                  setPreview(null);
                  alert('Não foi possível carregar a imagem. Verifique a URL ou o arquivo.');
                }}
              />
            ) : (
              <span className="text-xs text-slate-500 italic">Nenhuma logo personalizada selecionada</span>
            )}
          </div>
        </div>

        {/* Method 1: Upload from device */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300">
            Opção 1: Enviar arquivo do seu computador
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-emerald-700 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 text-xs font-semibold transition-colors"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Escolher imagem (.PNG, .SVG, .JPG ou .WebP)</span>
          </button>
        </div>

        {/* Method 2: Image URL */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Opção 2: Ou colar link/URL da imagem
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setPreview(e.target.value);
              }}
              placeholder="https://exemplo.com/sua-logo.png"
              className="w-full bg-[#04150f] border border-emerald-900 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Method 3: Download & Vercel deployment */}
        <div className="rounded-xl border border-amber-400/30 bg-[#04130d] p-3.5 text-[11px] text-slate-300 space-y-2.5">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <FolderCode className="w-4 h-4 text-amber-400" />
            <span>Publicar ou Atualizar na Vercel:</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Todas as fotos dos produtos, a logo oficial e os arquivos já estão salvos e empacotados. Para que a sua Vercel atualize o site, baixe os arquivos atualizados:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href="/vhdesigner3d-completo.zip"
              download="vhdesigner3d-completo.zip"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 font-medium text-xs text-center transition-all shadow-sm"
            >
              <span>📦 Baixar Código (.ZIP)</span>
            </a>
            <a
              href="/vhdesigner3d-dist.zip"
              download="vhdesigner3d-dist.zip"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs text-center transition-all shadow-sm"
            >
              <span>⚡ Baixar Dist Pronto (.ZIP)</span>
            </a>
          </div>
          <p className="text-[10px] text-slate-400 pt-1">
            Dica: Se sua Vercel estiver conectada ao GitHub, basta substituir os arquivos e fazer o commit com a pasta <code className="text-amber-300 font-mono">public/</code> e <code className="text-amber-300 font-mono">src/data/products.ts</code>.
          </p>
        </div>

        {/* Feedback message */}
        {feedback && (
          <p className="text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
            <Check className="w-4 h-4" /> {feedback}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-emerald-900/80">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500"
            >
              Salvar Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
