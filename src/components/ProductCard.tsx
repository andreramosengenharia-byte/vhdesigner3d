import React, { useState, useRef } from 'react';
import { Product, ProductColorOption } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { Plus, Eye, Check, Camera, Star, Video, Ruler } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, initialColor?: ProductColorOption) => void;
  onAddToCart: (product: Product, color: ProductColorOption) => void;
  onOpenImageModal?: (product: Product, colorName?: string) => void;
  onDirectUpload?: (productId: string, file: File, colorName?: string) => void;
  customImages?: Record<string, string>;
  customVideos?: Record<string, string>;
  isAdmin?: boolean;
}

const DEFAULT_FALLBACK_COLOR: ProductColorOption = { name: 'Padrão', hex: '#D49A25' };

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onOpenImageModal,
  onDirectUpload,
  customImages,
  customVideos,
  isAdmin = false,
}) => {
  const hasColorVariations = product.colors && product.colors.length > 0;
  const [selectedColor, setSelectedColor] = useState<ProductColorOption>(
    hasColorVariations ? product.colors[0] : DEFAULT_FALLBACK_COLOR
  );
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isCustomizable) {
      onSelectProduct(product, selectedColor);
      return;
    }
    onAddToCart(product, selectedColor);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1400);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file && onDirectUpload) {
      onDirectUpload(product.id, file, hasColorVariations ? selectedColor.name : undefined);
    }
  };

  const colorKey = hasColorVariations ? `${product.id}__${selectedColor.name}` : product.id;
  const hasSpecificColorImage = Boolean(customImages?.[colorKey] || product.colorImages?.[selectedColor.name]);
  const hasAnyImage = Boolean(hasSpecificColorImage || customImages?.[product.id] || product.imageUrl);
  const hasVideo = Boolean(customVideos?.[product.id] || product.videoUrl);

  return (
    <article
      onClick={() => onSelectProduct(product, hasColorVariations ? selectedColor : undefined)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-emerald-900/50 bg-[#072017]/90 transition-all duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_12px_24px_rgba(4,22,14,0.6)] cursor-pointer"
    >
      {/* Hidden fast file input for direct upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      {/* Visual Product Showcase Slot - Fixed min-h so it never collapses on mobile phones */}
      <div className="relative w-full aspect-[4/3] min-h-[220px] sm:min-h-[240px] shrink-0 overflow-hidden border-b border-emerald-950/80 bg-[#04130d] flex items-center justify-center">
        <ProductArtwork
          product={product}
          selectedColorName={hasColorVariations ? selectedColor.name : undefined}
          selectedColorHex={hasColorVariations ? selectedColor.hex : undefined}
          customImages={customImages}
          customVideos={customVideos}
          className="w-full h-full min-h-[220px]"
        />

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
          <span className="flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-black/75 px-3 py-1.5 text-xs font-semibold text-amber-200 shadow-lg">
            <Eye className="h-3.5 w-3.5" />
            <span>Ver Detalhes</span>
          </span>
        </div>

        {/* Upload/Change Product Photo/Video button - ONLY visible for Admin */}
        {isAdmin && (onOpenImageModal || onDirectUpload) && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenImageModal) {
                  onOpenImageModal(product, hasColorVariations ? selectedColor.name : undefined);
                } else if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              title={
                product.id === 'vh-arvore-natal-giratoria-3d'
                  ? 'Painel do Dono: Adicionar ou trocar foto/vídeo da árvore giratória'
                  : hasColorVariations
                  ? `Painel do Dono: Adicionar ou trocar foto para a cor ${selectedColor.name}`
                  : `Painel do Dono: Adicionar ou trocar foto do produto`
              }
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold shadow-lg backdrop-blur-xs transition-all hover:scale-105 active:scale-95 border ${
                hasVideo || hasSpecificColorImage || hasAnyImage
                  ? 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border-emerald-400/60 ring-1 ring-emerald-500/30'
                  : 'bg-black/85 hover:bg-black/95 text-amber-300 border-amber-400/60 ring-1 ring-amber-400/20'
              }`}
            >
              {hasVideo ? (
                <Video className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Camera className={`w-3.5 h-3.5 ${hasSpecificColorImage || hasAnyImage ? 'text-emerald-400' : 'text-amber-400'}`} />
              )}
              <span>
                {hasVideo
                  ? 'Vídeo / Foto'
                  : hasColorVariations
                  ? hasSpecificColorImage
                    ? `Foto (${selectedColor.name})`
                    : `+ Foto (${selectedColor.name})`
                  : hasAnyImage
                  ? 'Trocar Foto'
                  : '+ Adicionar Foto'}
              </span>
            </button>
          </div>
        )}

        {/* Discount / Bestseller Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
          {hasVideo && (
            <span className="text-[10px] font-bold text-rose-200 bg-rose-950/90 px-2 py-0.5 rounded border border-rose-500/60 shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>Vídeo Ativo</span>
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] font-bold text-amber-200 bg-rose-900/90 px-2 py-0.5 rounded border border-rose-500/50 shadow-md">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-amber-400/30">
              Destaque
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Category kicker */}
          <div className="text-[11px] font-medium uppercase tracking-wider text-emerald-400/90">
            {product.categoryLabel}
          </div>

          {/* Product Title */}
          <h3 className="mt-1 text-base font-semibold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Dimensions Badge */}
          {product.dimensions && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-200 bg-[#03140e] border border-amber-400/30 rounded-lg px-2.5 py-1 w-fit shadow-xs">
              <Ruler className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono font-semibold tracking-tight">{product.dimensions}</span>
            </div>
          )}

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 text-[11px] font-bold text-slate-200 tabular-nums">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">({product.reviewsCount} avaliações)</span>
          </div>
        </div>

        {/* Bottom row: Color selector (or Original badge), Price & Add button */}
        <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between gap-2">
          {hasColorVariations ? (
            /* Colors quick swatch - Simple names: Dourado, Vermelho, Branco, Verde */
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.colors.map((c) => {
                const cKey = `${product.id}__${c.name}`;
                const cHasPhoto = Boolean(customImages?.[cKey] || product.colorImages?.[c.name]);
                const isSelected = selectedColor.name === c.name;

                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    title={`Cor: ${c.name}${cHasPhoto ? ' (Foto cadastrada)' : ''}`}
                    className={`relative w-5 h-5 rounded-full border transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-110 shadow-sm'
                        : 'border-white/30 hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {cHasPhoto && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                    )}
                  </button>
                );
              })}
              <span className="ml-1 text-[11px] font-medium text-slate-300">
                {selectedColor.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-emerald-400/90 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                Design Original
              </span>
            </div>
          )}

          {/* Price & Add to cart button */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through block tabular-nums -mb-0.5">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              {product.minQuantity ? (
                <div>
                  <span className="text-[10px] text-slate-400 block -mb-0.5">A partir de</span>
                  <span className="text-base font-bold text-amber-300 tabular-nums">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-emerald-400 block -mt-0.5 font-medium">({product.minQuantity} peças)</span>
                </div>
              ) : (
                <span className="text-base font-bold text-amber-300 tabular-nums">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Adicionar ${product.name} ao carrinho`}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                isAddedFeedback
                  ? 'border-emerald-500 bg-emerald-600 text-white'
                  : 'border-amber-400/50 bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/10'
              }`}
            >
              {isAddedFeedback ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
