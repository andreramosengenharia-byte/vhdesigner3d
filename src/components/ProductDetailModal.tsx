import React, { useState, useEffect } from 'react';
import { Product, ProductColorOption } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { compressImageFile } from '../utils/imageStorage';
import { getBallPackPrice } from '../data/products';
import { X, Check, ShoppingBag, ShieldCheck, Clock, Sparkles, MessageCircle, Camera, Trash2, Edit3, Tag, Star, Video, Ruler } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  initialColor?: ProductColorOption;
  onClose: () => void;
  onAddToCart: (product: Product, color: ProductColorOption, quantity: number, customText?: string) => void;
  onUpdateImage?: (productId: string, imageUrl: string, colorName?: string) => void;
  onOpenImageModal?: (product: Product, colorName?: string) => void;
  onRemoveImage?: (productId: string, colorName?: string) => void;
  onSaveVideo?: (productId: string, videoUrl: string) => void;
  onRemoveVideo?: (productId: string) => void;
  customImages?: Record<string, string>;
  customVideos?: Record<string, string>;
  isAdmin?: boolean;
}

const DEFAULT_FALLBACK_COLOR: ProductColorOption = { name: 'Padrão', hex: '#D49A25' };

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColor,
  onClose,
  onAddToCart,
  onUpdateImage,
  onOpenImageModal,
  onRemoveImage,
  onSaveVideo,
  onRemoveVideo,
  customImages,
  customVideos,
  isAdmin = false,
}) => {
  const hasColorVariations = Boolean(product?.colors && product.colors.length > 0);
  const minQty = product?.minQuantity || 1;
  const stepQty = product?.quantityStep || 1;

  const [selectedColor, setSelectedColor] = useState<ProductColorOption>(() => {
    return initialColor || (hasColorVariations && product?.colors ? product.colors[0] : DEFAULT_FALLBACK_COLOR);
  });
  const [quantity, setQuantity] = useState<number>(minQty);
  const [customText, setCustomText] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!product) return;
    if (initialColor) {
      setSelectedColor(initialColor);
    } else if (hasColorVariations && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    } else {
      setSelectedColor(DEFAULT_FALLBACK_COLOR);
    }
    setQuantity(product.minQuantity || 1);
    setCustomText('');
  }, [product?.id, initialColor, hasColorVariations]);

  if (!product) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateImage) {
      try {
        const compressed = await compressImageFile(file, 1000, 0.82);
        onUpdateImage(product.id, compressed, hasColorVariations ? selectedColor.name : undefined);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Price calculation (handles volume pricing for bolinhas)
  const isBallPack = product.id === 'vh-bolinhas-floco-nome-personalizado';
  const calculatedTotalPrice = isBallPack
    ? getBallPackPrice(quantity)
    : product.price * quantity;

  const handleAdd = () => {
    onAddToCart(product, selectedColor, quantity, customText);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  const handleWhatsAppOrder = () => {
    const colorLine = hasColorVariations ? `\nCor escolhida: ${selectedColor.name}` : '';
    const customLine = customText ? `\nNome / Gravação: "${customText}"` : '';
    const message =
      `Olá, VHDESIGNER3d! Gostaria de encomendar para o Natal:\n\n` +
      `Produto: ${product.name}${colorLine}${customLine}\n` +
      `Quantidade: ${quantity} ${quantity > 1 ? 'unidades' : 'unidade'}\n` +
      `Valor Total: R$ ${calculatedTotalPrice.toFixed(2).replace('.', ',')}\n\n` +
      `Poderiam me passar a confirmação do pedido e prazo de envio?`;
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/5513988437321?text=${text}`, '_blank');
  };

  const colorKey = hasColorVariations ? `${product.id}__${selectedColor.name}` : product.id;
  const hasVideo = Boolean(customVideos?.[product.id] || product.videoUrl);
  const hasSpecificPhoto = Boolean(
    hasColorVariations
      ? customImages?.[colorKey] || product.colorImages?.[selectedColor.name]
      : customImages?.[product.id] || product.imageUrl
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-emerald-900 bg-[#061e16] shadow-2xl text-slate-100 max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 transition-colors border border-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left: Product Artwork Gallery - min-h ensured for mobile phones */}
        <div className="w-full md:w-1/2 bg-[#04140e] flex flex-col justify-between border-b md:border-b-0 md:border-r border-emerald-950">
          <div className="relative w-full aspect-square min-h-[280px] sm:min-h-[340px] shrink-0 overflow-hidden flex items-center justify-center">
            <ProductArtwork
              product={product}
              selectedColorName={hasColorVariations ? selectedColor.name : undefined}
              selectedColorHex={hasColorVariations ? selectedColor.hex : undefined}
              customImages={customImages}
              customVideos={customVideos}
              className="w-full h-full min-h-[280px]"
            />
            <div className="absolute top-3 left-3 bg-emerald-950/90 text-amber-300 text-xs px-2.5 py-1 rounded-md border border-amber-400/30 font-medium">
              {product.categoryLabel}
            </div>

            {/* Owner Photo/Video Controls - ONLY visible when isAdmin is true */}
            {isAdmin && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenImageModal) {
                      onOpenImageModal(product, hasColorVariations ? selectedColor.name : undefined);
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-black/85 hover:bg-black/95 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-400/50 shadow-lg backdrop-blur-xs transition-transform hover:scale-105"
                >
                  {hasVideo ? (
                    <Video className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>
                    {hasVideo
                      ? 'Adicionar / Trocar Vídeo e Foto'
                      : hasColorVariations
                      ? hasSpecificPhoto
                        ? `Trocar Foto (${selectedColor.name})`
                        : `+ Foto (${selectedColor.name})`
                      : hasSpecificPhoto
                      ? 'Trocar Foto Real'
                      : '+ Foto Real'}
                  </span>
                </button>

                {hasSpecificPhoto && onRemoveImage && (
                  <button
                    type="button"
                    onClick={() => onRemoveImage(product.id, hasColorVariations ? selectedColor.name : undefined)}
                    title="Remover foto"
                    className="flex items-center gap-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 px-2 py-1.5 text-xs font-medium text-rose-300 border border-rose-500/40 shadow backdrop-blur-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info & Purchase Module */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VHDESIGNER3d Especial de Natal</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white leading-tight">
              {product.name}
            </h2>

            {/* Price block */}
            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl font-bold text-amber-300 tabular-nums">
                R$ {calculatedTotalPrice.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  R$ {(isBallPack ? (product.originalPrice / 6) * quantity : product.originalPrice * quantity).toFixed(2).replace('.', ',')}
                </span>
              )}
              {isBallPack && (
                <span className="text-xs text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-700">
                  Kit com {quantity} peças
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-bold text-amber-200 bg-rose-950/90 px-2 py-0.5 rounded border border-rose-500/50 shadow-sm">
                  Economize {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Rating display */}
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold ml-1 text-slate-100">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{product.reviewsCount} avaliações verificadas</span>
            </div>

            {/* Full Description */}
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Dimensions & Specifications Card */}
            {product.dimensions && (
              <div className="mt-4 rounded-xl border border-amber-400/40 bg-[#041910] p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-amber-400" />
                    <span>Medidas & Especificações:</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                    Precisão 3D
                  </span>
                </div>
                <div className="bg-[#02100a] border border-emerald-900/80 rounded-lg p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Dimensões:</span>
                    <strong className="text-amber-200 font-mono text-sm">{product.dimensions}</strong>
                  </div>
                  {product.weight && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-950">
                      <span className="text-slate-400">Peso aproximado:</span>
                      <span className="text-slate-200 font-mono">{product.weight}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-950">
                      <span className="text-slate-400">Material:</span>
                      <span className="text-emerald-300 font-medium">{product.material}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customization input for personalized products */}
            {product.isCustomizable && (
              <div className="mt-4 rounded-xl border border-amber-400/40 bg-[#041910] p-3 space-y-1.5">
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Nome(s) / Gravação Personalizada:</span>
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={product.customTextPlaceholder || 'Ex: Aline, Arthur, Sofia, Pets, Família...'}
                  className="w-full bg-[#03110b] border border-emerald-900 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                />
                <p className="text-[11px] text-emerald-300/90 leading-tight">
                  ✨ <em>Não precisa ser só de família!</em> Você pode personalizar com qualquer nome individual, pets, amigos ou empresas.
                </p>
              </div>
            )}

            {/* Volume Pricing Tiers for Bolinhas */}
            {product.volumePricing && (
              <div className="mt-4 space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Desconto Progressivo em Lotes:</span>
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {product.volumePricing.map((tier) => (
                    <button
                      key={tier.qty}
                      type="button"
                      onClick={() => setQuantity(tier.qty)}
                      className={`text-left p-2 rounded-lg border text-xs transition-all ${
                        quantity === tier.qty
                          ? 'border-amber-400 bg-emerald-900/80 text-amber-200 font-bold ring-1 ring-amber-400'
                          : 'border-emerald-900 bg-[#04160f] text-slate-300 hover:border-emerald-700'
                      }`}
                    >
                      <span className="block text-slate-100 font-semibold">{tier.qty} peças</span>
                      <span className="text-[11px] text-amber-300">R$ {tier.price.toFixed(2).replace('.', ',')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection ONLY for products with variations */}
            {hasColorVariations ? (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Cor: <span className="text-amber-300 font-bold">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor.name === c.name;
                    const cKey = `${product.id}__${c.name}`;
                    const cHasPhoto = Boolean(customImages?.[cKey] || product.colorImages?.[c.name]);

                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-emerald-900/70 text-amber-200 shadow-sm ring-1 ring-amber-400'
                            : 'border-emerald-900 bg-[#07251a] hover:border-emerald-700 text-slate-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                        {cHasPhoto && (
                          <span className="text-[10px] text-emerald-400" title="Foto cadastrada nesta cor">
                            📷
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-300 bg-[#04160e] p-2.5 rounded-lg border border-emerald-900/60">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Modelo Exclusivo com Acabamento e Cores Originais</span>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-3 border-t border-emerald-900/60">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Quantidade:</span>
                {minQty > 1 && (
                  <span className="text-[10px] text-amber-300 font-medium">Pedido mínimo: {minQty} peças</span>
                )}
              </div>
              <div className="flex items-center rounded-lg border border-emerald-800 bg-[#082a1d]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(minQty, quantity - stepQty))}
                  className="px-3 py-1 text-slate-300 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-amber-200 tabular-nums">
                  {quantity} {quantity === 1 ? 'peça' : 'peças'}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + stepQty)}
                  className="px-3 py-1 text-slate-300 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide transition-all ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98]'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Adicionado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Adicionar ao Carrinho</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-emerald-700 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs tracking-wide transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>Pedir no WhatsApp</span>
              </button>
            </div>

            {/* Delivery Assurance */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-300/80">
              <Clock className="h-3.5 w-3.5" />
              <span>Prazo especial: Produção expressa garantida para o Natal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
