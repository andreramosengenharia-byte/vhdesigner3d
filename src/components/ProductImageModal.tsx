import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { compressImageFile } from '../utils/imageStorage';
import { X, Upload, Check, Trash2, Sparkles, Loader2, Link as LinkIcon, Palette, Camera, Video, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductImageModalProps {
  product: Product | null;
  initialColorName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveImage: (productId: string, dataUrl: string, colorName?: string) => void;
  onRemoveImage: (productId: string, colorName?: string) => void;
  onSaveVideo?: (productId: string, videoUrlOrData: string) => void;
  onRemoveVideo?: (productId: string) => void;
  customImages?: Record<string, string>;
  customVideos?: Record<string, string>;
}

export const ProductImageModal: React.FC<ProductImageModalProps> = ({
  product,
  initialColorName,
  isOpen,
  onClose,
  onSaveImage,
  onRemoveImage,
  onSaveVideo,
  onRemoveVideo,
  customImages = {},
  customVideos = {},
}) => {
  const hasColorVariations = Boolean(product?.colors && product.colors.length > 0);
  const isSpinningTree = product?.id === 'vh-arvore-natal-giratoria-3d';

  // Mode: photo or video
  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('image');

  // Active color tab (for products with color variations)
  const [selectedColorName, setSelectedColorName] = useState<string>(() => {
    return initialColorName || product?.colors?.[0]?.name || 'Dourado';
  });

  const [preview, setPreview] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize preview whenever selected color or product changes
  useEffect(() => {
    if (!product || !isOpen) return;
    if (hasColorVariations) {
      const colorKey = `${product.id}__${selectedColorName}`;
      const existing =
        customImages[colorKey] ||
        product.colorImages?.[selectedColorName] ||
        customImages[product.id] ||
        product.imageUrl ||
        '';
      setPreview(existing);
    } else {
      const existing = customImages[product.id] || product.imageUrl || '';
      setPreview(existing);
    }

    const existingVideo = customVideos[product.id] || product.videoUrl || '';
    setVideoPreview(existingVideo);

    setUrlInput('');
    setVideoUrlInput('');
    setStatusMessage(null);
  }, [product?.id, selectedColorName, customImages, customVideos, hasColorVariations, isOpen]);

  // When modal opens or initialColorName changes
  useEffect(() => {
    if (!product || !isOpen) return;
    if (initialColorName) {
      setSelectedColorName(initialColorName);
    } else if (hasColorVariations && product.colors && product.colors.length > 0) {
      setSelectedColorName(product.colors[0].name);
    }
  }, [isOpen, initialColorName, product?.id, hasColorVariations]);

  if (!isOpen || !product) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatusMessage('Otimizando imagem para alta definição...');
      const compressed = await compressImageFile(file, 1100, 0.82);
      setPreview(compressed);
      setStatusMessage(
        hasColorVariations
          ? `Foto pronta para salvar na cor ${selectedColorName}!`
          : `Foto pronta para salvar!`
      );
    } catch (err) {
      console.error(err);
      setStatusMessage('Erro ao carregar o arquivo. Tente outro formato.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setStatusMessage('Por favor, selecione um arquivo de vídeo com menos de 50MB.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Carregando vídeo gravado...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setVideoPreview(result);
      setIsProcessing(false);
      setStatusMessage('Vídeo carregado com sucesso! Clique em "Salvar Vídeo" para confirmar.');
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setStatusMessage('Erro ao ler o vídeo. Tente o formato MP4 ou WebM.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setPreview(urlInput.trim());
      setStatusMessage(
        hasColorVariations
          ? `Link aplicado na prévia para a cor ${selectedColorName}!`
          : `Link aplicado na prévia do produto!`
      );
    }
  };

  const handleApplyVideoUrl = () => {
    if (videoUrlInput.trim()) {
      setVideoPreview(videoUrlInput.trim());
      setStatusMessage('Link de vídeo aplicado na prévia! Clique em "Salvar Vídeo".');
    }
  };

  const handleSave = () => {
    if (!preview) return;
    if (hasColorVariations) {
      onSaveImage(product.id, preview, selectedColorName);
      setStatusMessage(`Foto salva com sucesso para a cor ${selectedColorName}!`);
    } else {
      onSaveImage(product.id, preview);
      setStatusMessage(`Foto do produto salva com sucesso!`);
    }
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 900);
  };

  const handleSaveVideoAction = () => {
    if (!videoPreview || !onSaveVideo) return;
    onSaveVideo(product.id, videoPreview);
    setStatusMessage('Vídeo salvo com sucesso na loja!');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 900);
  };

  const handleApplyToAllColors = () => {
    if (!preview || !hasColorVariations) return;
    product.colors.forEach((c) => {
      onSaveImage(product.id, preview, c.name);
    });
    // Also save as base image
    onSaveImage(product.id, preview);
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    setStatusMessage('Foto aplicada com sucesso a todas as 4 cores!');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1000);
  };

  const handleRemove = () => {
    if (hasColorVariations) {
      onRemoveImage(product.id, selectedColorName);
      setStatusMessage(`Foto da cor ${selectedColorName} removida.`);
    } else {
      onRemoveImage(product.id);
      setStatusMessage(`Foto do produto removida.`);
    }
    setPreview('');
    setTimeout(() => {
      setStatusMessage(null);
    }, 1200);
  };

  const handleRemoveVideoAction = () => {
    if (onRemoveVideo) {
      onRemoveVideo(product.id);
    }
    setVideoPreview('');
    setStatusMessage('Vídeo removido.');
    setTimeout(() => {
      setStatusMessage(null);
    }, 1200);
  };

  const currentColorObj = hasColorVariations
    ? product.colors.find((c) => c.name === selectedColorName)
    : null;
  const colorKey = hasColorVariations ? `${product.id}__${selectedColorName}` : product.id;
  const currentHasSavedPhoto = Boolean(
    hasColorVariations
      ? customImages[colorKey] || product.colorImages?.[selectedColorName]
      : customImages[product.id] || product.imageUrl
  );
  const currentHasSavedVideo = Boolean(customVideos[product.id] || product.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-amber-400/50 bg-[#07241a] p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-cinzel text-white truncate max-w-[340px]">
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-emerald-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Selector Tabs: Foto vs Vídeo (destaque especial para Árvore Giratória) */}
        <div className="flex items-center gap-2 p-1 bg-[#04160f] rounded-xl border border-emerald-900/60">
          <button
            type="button"
            onClick={() => setMediaTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              mediaTab === 'image'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Foto do Produto</span>
            {currentHasSavedPhoto && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Foto cadastrada" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMediaTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              mediaTab === 'video'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-amber-300" />
            <span>{isSpinningTree ? 'Vídeo da Árvore Girando' : 'Vídeo da Peça'}</span>
            {currentHasSavedVideo && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Vídeo cadastrado" />
            )}
          </button>
        </div>

        {/* ================= TAB 1: FOTO ================= */}
        {mediaTab === 'image' && (
          <div className="space-y-4">
            {/* Color Tabs (Only for products with variations: Letreiro & Kit de Decorações) */}
            {hasColorVariations && (
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Selecione a cor para adicionar/trocar a foto:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.colors.map((c) => {
                    const isSelected = selectedColorName === c.name;
                    const hasImg = Boolean(
                      customImages[`${product.id}__${c.name}`] || product.colorImages?.[c.name]
                    );

                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColorName(c.name)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-emerald-900/80 text-amber-200 shadow-md ring-1 ring-amber-400'
                            : 'border-emerald-900 bg-[#04160f] text-slate-300 hover:border-emerald-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </div>
                        {hasImg ? (
                          <span className="text-[10px] text-emerald-400 font-bold" title="Foto cadastrada">
                            ✓
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-normal">vazio</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Image Preview Box */}
            <div className="relative aspect-[4/3] min-h-[220px] w-full rounded-xl border border-emerald-800/80 bg-[#03110b] overflow-hidden flex items-center justify-center shadow-inner">
              {preview ? (
                <img
                  src={preview}
                  alt={`Prévia ${product.name}${hasColorVariations ? ` na cor ${selectedColorName}` : ''}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 space-y-2">
                  <Upload className="w-10 h-10 text-emerald-600 mx-auto opacity-70" />
                  <p className="text-xs font-semibold text-slate-300">
                    {hasColorVariations ? (
                      <>
                        Nenhuma foto cadastrada para a cor <strong className="text-amber-300">{selectedColorName}</strong>
                      </>
                    ) : (
                      <>Nenhuma foto real cadastrada ainda para este produto</>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {hasColorVariations
                      ? `Tire a foto da peça impressa em ${selectedColorName} e escolha o arquivo abaixo`
                      : `Tire a foto da sua peça impressa em 3D e envie pelo botão abaixo`}
                  </p>
                </div>
              )}

              {/* Color tag on preview */}
              {hasColorVariations ? (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 border border-white/20 text-xs text-white backdrop-blur-xs font-semibold">
                  <span
                    className="w-3 h-3 rounded-full border border-white/40"
                    style={{ backgroundColor: currentColorObj?.hex }}
                  />
                  <span>Cor: {selectedColorName}</span>
                </div>
              ) : (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 border border-white/20 text-xs text-white backdrop-blur-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Foto do Produto</span>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 backdrop-blur-xs">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <span className="text-xs text-amber-200 font-semibold">{statusMessage}</span>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-amber-400/60 bg-emerald-950/70 hover:bg-emerald-900/80 text-amber-200 text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>
                  {hasColorVariations
                    ? `Escolher foto do celular/computador para ${selectedColorName}`
                    : `Escolher foto do produto no celular/computador`}
                </span>
              </button>

              {/* URL Input option */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Ou cole o link direto da imagem (https://...)"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03110b] border border-emerald-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-xs text-amber-300 font-semibold transition-colors border border-emerald-700"
                >
                  Aplicar
                </button>
              </div>

              {/* Status feedback */}
              {statusMessage && (
                <p className="text-xs text-amber-300 font-medium text-center bg-black/40 py-1.5 px-3 rounded-lg border border-amber-500/30">
                  {statusMessage}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-emerald-900/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {currentHasSavedPhoto && (
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{hasColorVariations ? `Remover (${selectedColorName})` : 'Remover Foto'}</span>
                    </button>
                  )}
                  {hasColorVariations && preview && (
                    <button
                      type="button"
                      onClick={handleApplyToAllColors}
                      title="Salva essa mesma foto para Dourado, Vermelho, Branco e Verde"
                      className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 text-xs font-semibold transition-colors"
                    >
                      <span>Aplicar para todas as cores</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-slate-300 text-xs font-semibold transition-colors border border-emerald-900"
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    disabled={!preview || isProcessing}
                    onClick={handleSave}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md transition-all disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Salvar Foto</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VÍDEO (Árvore Giratória / Peça) ================= */}
        {mediaTab === 'video' && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800 text-xs text-emerald-200 leading-relaxed">
              {isSpinningTree ? (
                <>
                  <strong className="text-amber-300 font-bold block mb-1">🎬 Vídeo da Árvore de Natal Giratória 3D:</strong>
                  Grave um vídeo da árvore girando na mesa com a câmera do seu celular (ou escolha um arquivo MP4/WebM) e envie abaixo. O vídeo será reproduzido em looping contínuo na vitrine da loja!
                </>
              ) : (
                <>
                  <strong className="text-amber-300 font-bold block mb-1">🎬 Vídeo do Produto:</strong>
                  Envie um vídeo da sua peça impressa em 3D para encantar seus clientes mostrando os detalhes e o acabamento em movimento.
                </>
              )}
            </div>

            {/* Video Player Preview Box */}
            <div className="relative aspect-[4/3] min-h-[220px] w-full rounded-xl border border-rose-900/60 bg-black overflow-hidden flex items-center justify-center shadow-inner">
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 space-y-2">
                  <Video className="w-10 h-10 text-rose-500 mx-auto opacity-70 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-300">
                    Nenhum vídeo cadastrado ainda para este produto
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Envie o vídeo da peça gravado do celular para exibi-la em movimento!
                  </p>
                </div>
              )}

              {videoPreview && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 border border-rose-500/40 text-xs text-rose-200 backdrop-blur-xs font-semibold">
                  <Play className="w-3 h-3 text-red-400 fill-red-400" />
                  <span>Prévia do Vídeo</span>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 backdrop-blur-xs">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <span className="text-xs text-amber-200 font-semibold">{statusMessage}</span>
                </div>
              )}
            </div>

            {/* Video Upload Controls */}
            <div className="space-y-3">
              <input
                type="file"
                ref={videoFileInputRef}
                onChange={handleVideoFileChange}
                accept="video/mp4, video/webm, video/quicktime, video/ogg"
                className="hidden"
              />

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => videoFileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-rose-500/60 bg-rose-950/40 hover:bg-rose-950/60 text-rose-200 text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md"
              >
                <Video className="w-4 h-4 text-rose-400" />
                <span>Escolher vídeo do celular/computador (MP4, WebM, MOV)</span>
              </button>

              {/* URL Input option for video */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="Ou cole o link direto do vídeo (https://...mp4)"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03110b] border border-emerald-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyVideoUrl}
                  className="px-3 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-xs text-white font-semibold transition-colors border border-rose-700"
                >
                  Aplicar
                </button>
              </div>

              {/* Status feedback */}
              {statusMessage && (
                <p className="text-xs text-amber-300 font-medium text-center bg-black/40 py-1.5 px-3 rounded-lg border border-amber-500/30">
                  {statusMessage}
                </p>
              )}

              {/* Video Actions */}
              <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between gap-2">
                <div>
                  {currentHasSavedVideo && (
                    <button
                      type="button"
                      onClick={handleRemoveVideoAction}
                      className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Vídeo</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-slate-300 text-xs font-semibold transition-colors border border-emerald-900"
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    disabled={!videoPreview || isProcessing}
                    onClick={handleSaveVideoAction}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>Salvar Vídeo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
