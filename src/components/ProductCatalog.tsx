import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, ProductColorOption } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { Search, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product, initialColor?: ProductColorOption) => void;
  onAddToCart: (product: Product, color: ProductColorOption) => void;
  onUpdateProductImage?: (productId: string, imageUrl: string, colorName?: string) => void;
  onOpenImageModal?: (product: Product, colorName?: string) => void;
  onDirectUpload?: (productId: string, file: File, colorName?: string) => void;
  customImages?: Record<string, string>;
  customVideos?: Record<string, string>;
  isAdmin?: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onAddToCart,
  onUpdateProductImage,
  onOpenImageModal,
  onDirectUpload,
  customImages = {},
  customVideos = {},
  isAdmin = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'popular'>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.map((p) => ({
      ...p,
      imageUrl: customImages[p.id] || p.imageUrl || '',
    }));

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="catalogo" className="relative scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Coleção Festiva 2026</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white leading-tight">
          Catálogo de Decorações Natalinas 3D
        </h2>
        <p className="mt-3 text-sm text-emerald-200/80 leading-relaxed">
          Peças exclusivas com acabamento de alta qualidade em ouro nobre, rubi e pinheiro que trazem a magia do Natal para sua casa.
        </p>
      </div>

      {/* Control Bar: Categories, Search & Sort */}
      <div className="space-y-4 mb-8">
        {/* Category Tabs (Segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? PRODUCTS.length
                : PRODUCTS.filter((p) => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-[#08241b] text-slate-300 hover:text-white hover:bg-[#0c3326] border border-emerald-900/60'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-950 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-emerald-900/40">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por enfeite, mini árvore, presépio, vela..."
              className="w-full bg-[#061d15] border border-emerald-900/70 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort & Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
            <span className="tabular-nums">
              Mostrando <strong className="text-amber-300">{filteredProducts.length}</strong> itens
            </span>

            <div className="flex items-center gap-1.5 bg-[#061d15] border border-emerald-900/70 rounded-xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#061d15]">Destaques</option>
                <option value="price-asc" className="bg-[#061d15]">Menor Preço</option>
                <option value="price-desc" className="bg-[#061d15]">Maior Preço</option>
                <option value="popular" className="bg-[#061d15]">Mais Avaliados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Helper Tip for photo customization on thumbnails - ONLY visible in Admin Mode */}
        {isAdmin && (
          <div className="flex items-center justify-between flex-wrap gap-2 rounded-xl border border-amber-500/40 bg-[#04160f]/95 px-3.5 py-2.5 text-xs text-slate-300 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                📷
              </span>
              <span className="text-slate-200 text-xs">
                <strong>Modo Lojista (Fotos por Cor):</strong> Clique nas bolinhas de cor (<span className="text-amber-300 font-semibold">Dourado, Vermelho, Branco, Verde</span>) e depois no botão <span className="text-amber-300 font-bold bg-black/50 px-1.5 py-0.5 rounded border border-amber-400/30">+ Foto</span> para cadastrar imagens reais. <em>Clientes comuns não visualizam esta barra nem os botões de upload!</em>
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado
            </span>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-900 bg-[#061e16]/60 p-12 text-center text-slate-400">
          <p className="text-base font-semibold text-slate-200">Nenhum produto encontrado</p>
          <p className="text-xs text-slate-400 mt-1">
            Não encontramos peças correspondentes a "{searchQuery}".
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 text-amber-200 text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar filtros</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onOpenImageModal={onOpenImageModal}
              onDirectUpload={onDirectUpload}
              customImages={customImages}
              customVideos={customVideos}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </section>
  );
};
