import React, { useState, useEffect } from 'react';
import { Product, ProductColorOption, CartItem } from './types';
import { BRAND_CONFIG } from './config/branding';
import { SnowEffect } from './components/SnowEffect';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomOrderSection } from './components/CustomOrderSection';
import { HolidayFeatures } from './components/HolidayFeatures';
import { TestimonialsAndFaq } from './components/TestimonialsAndFaq';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductImageModal } from './components/ProductImageModal';
import { CartDrawer } from './components/CartDrawer';
import { LogoSettingsModal } from './components/LogoSettingsModal';
import { Footer } from './components/Footer';
import { MessageCircle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  saveProductImageToDB,
  loadAllProductImagesFromDB,
  removeProductImageFromDB,
  saveProductVideoToDB,
  loadAllProductVideosFromDB,
  removeProductVideoFromDB,
  compressImageFile,
} from './utils/imageStorage';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    initialColor?: ProductColorOption;
  } | null>(null);
  const [imageModalData, setImageModalData] = useState<{
    product: Product;
    colorName?: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true' || localStorage.getItem('vhdesigner3d_admin') === 'true';
    }
    return false;
  });

  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vhdesigner3d_custom_logo');
      if (saved && saved !== '/logo.png') return saved;
    }
    return BRAND_CONFIG.logoUrl || '/logo.svg';
  });

  const handleToggleAdmin = () => {
    setIsAdmin((prev) => {
      const next = !prev;
      localStorage.setItem('vhdesigner3d_admin', String(next));
      setToastMessage(
        next
          ? 'Modo Lojista ativado! Agora você pode cadastrar e trocar fotos reais dos produtos.'
          : 'Modo Lojista desativado. Visualizando a loja como seus clientes verão (sem botões de foto).'
      );
      setTimeout(() => setToastMessage(null), 3500);
      return next;
    });
  };

  // Keyboard shortcut (Alt + L) for owner to toggle admin settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        handleToggleAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Store of custom images: key can be `${productId}__${colorName}` or `${productId}`
  const [customProductImages, setCustomProductImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('vhdesigner3d_product_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Store of custom videos (e.g. Árvore de Natal Giratória 3D)
  const [customProductVideos, setCustomProductVideos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('vhdesigner3d_product_videos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync from server /api/media + IndexedDB + LocalStorage (PROTECTING user photos from being overwritten)
  useEffect(() => {
    // 1. First load from IndexedDB (source of truth for large user-uploaded photos)
    loadAllProductImagesFromDB().then((idbImages) => {
      if (idbImages && Object.keys(idbImages).length > 0) {
        setCustomProductImages((prev) => ({ ...prev, ...idbImages }));

        // Ensure user photos are also saved to server in the background
        for (const [key, imageUrl] of Object.entries(idbImages)) {
          if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') || !imageUrl.includes('unsplash.com'))) {
            fetch('/api/media/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key, imageUrl }),
            }).catch(() => {});
          }
        }
      }
    });

    loadAllProductVideosFromDB().then((videos) => {
      if (videos && Object.keys(videos).length > 0) {
        setCustomProductVideos((prev) => ({ ...prev, ...videos }));
      }
    });

    // 2. Fetch shared media from server, carefully merging so default unsplash never clobbers user uploads
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        // Logo handling
        if (data?.logoUrl) {
          setCustomLogoUrl(data.logoUrl);
          localStorage.setItem('vhdesigner3d_custom_logo', data.logoUrl);
        } else {
          const localLogo = localStorage.getItem('vhdesigner3d_custom_logo');
          if (localLogo && localLogo !== '/logo.png' && localLogo !== '/logo.svg') {
            fetch('/api/media/logo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ logoUrl: localLogo }),
            }).catch(() => {});
          }
        }

        // Images handling
        if (data?.images && Object.keys(data.images).length > 0) {
          setCustomProductImages((prev) => {
            const next = { ...prev };
            for (const [key, serverUrl] of Object.entries(data.images as Record<string, string>)) {
              const prevUrl = prev[key];
              const isPrevUserUpload = Boolean(
                prevUrl &&
                (prevUrl.startsWith('data:') || prevUrl.startsWith('blob:') || !prevUrl.includes('unsplash.com'))
              );
              const isServerUserUpload = Boolean(
                serverUrl &&
                (serverUrl.startsWith('data:') || serverUrl.startsWith('blob:') || !serverUrl.includes('unsplash.com'))
              );

              // Server user upload always applies; otherwise keep local user upload
              if (isServerUserUpload) {
                next[key] = serverUrl;
              } else if (!isPrevUserUpload && serverUrl) {
                next[key] = serverUrl;
              }
            }
            return next;
          });
        }

        // Videos handling
        if (data?.videos && Object.keys(data.videos).length > 0) {
          setCustomProductVideos((prev) => ({ ...data.videos, ...prev }));
        }
      })
      .catch((err) => console.log('Server sync status:', err));
  }, []);

  const handleUpdateProductImage = async (
    productId: string,
    imageUrl: string,
    colorName?: string
  ) => {
    const key = colorName ? `${productId}__${colorName}` : productId;

    // 1. Immediately update state
    setCustomProductImages((prev) => {
      const next = { ...prev, [key]: imageUrl };
      // Also set base image if none exists
      if (!next[productId]) {
        next[productId] = imageUrl;
      }
      return next;
    });

    // 2. Persist in IndexedDB + LocalStorage
    await saveProductImageToDB(key, imageUrl);
    if (colorName) {
      const stored = await loadAllProductImagesFromDB();
      if (!stored[productId]) {
        await saveProductImageToDB(productId, imageUrl);
      }
    }

    // 3. Sync to server so mobile devices receive the photo
    try {
      fetch('/api/media/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, imageUrl }),
      }).catch((e) => console.warn('Server image sync error:', e));
    } catch {
      // ignore
    }

    setToastMessage(`Foto salva com sucesso${colorName ? ` para a cor ${colorName}` : ''}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveProductImage = async (productId: string, colorName?: string) => {
    const key = colorName ? `${productId}__${colorName}` : productId;

    setCustomProductImages((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    await removeProductImageFromDB(key);

    try {
      fetch(`/api/media/image/${encodeURIComponent(key)}`, { method: 'DELETE' }).catch((e) =>
        console.warn('Server image delete error:', e)
      );
    } catch {
      // ignore
    }

    setToastMessage(`Foto${colorName ? ` da cor ${colorName}` : ''} removida.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateProductVideo = async (productId: string, videoUrl: string) => {
    setCustomProductVideos((prev) => ({ ...prev, [productId]: videoUrl }));
    await saveProductVideoToDB(productId, videoUrl);

    try {
      fetch('/api/media/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, videoUrl }),
      }).catch((e) => console.warn('Server video sync error:', e));
    } catch {
      // ignore
    }

    setToastMessage('Vídeo da árvore giratória salvo com sucesso!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveProductVideo = async (productId: string) => {
    setCustomProductVideos((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    await removeProductVideoFromDB(productId);

    try {
      fetch(`/api/media/video/${encodeURIComponent(productId)}`, { method: 'DELETE' }).catch((e) =>
        console.warn('Server video delete error:', e)
      );
    } catch {
      // ignore
    }

    setToastMessage('Vídeo removido.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDirectUpload = async (productId: string, file: File, colorName?: string) => {
    try {
      setToastMessage(`Otimizando foto${colorName ? ` da cor ${colorName}` : ''}...`);
      const compressed = await compressImageFile(file, 1000, 0.82);
      await handleUpdateProductImage(productId, compressed, colorName);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setToastMessage('Erro ao carregar a imagem. Tente outro formato.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleSaveLogo = (newUrl: string | null) => {
    setCustomLogoUrl(newUrl);
    if (newUrl) {
      localStorage.setItem('vhdesigner3d_custom_logo', newUrl);
      fetch('/api/media/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: newUrl }),
      }).catch((e) => console.warn('Server logo save error:', e));
    } else {
      localStorage.removeItem('vhdesigner3d_custom_logo');
      fetch('/api/media/logo', { method: 'DELETE' }).catch(() => {});
    }
  };

  // Cart total count
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add to cart handler with color-specific image enrichment and customText
  const handleAddToCart = (
    product: Product,
    color: ProductColorOption,
    quantity: number = 1,
    customText?: string
  ) => {
    const colorKey = `${product.id}__${color.name}`;
    const specificImage = customProductImages[colorKey] || customProductImages[product.id] || product.imageUrl || '';

    const productWithImage: Product = {
      ...product,
      imageUrl: specificImage,
    };

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedColor.name === color.name &&
          (i.customText || '') === (customText || '')
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          product: productWithImage,
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product: productWithImage, selectedColor: color, quantity, customText }];
      }
    });

    const hasVariations = product.colors && product.colors.length > 0;
    const textSnippet = customText ? ` ("${customText}")` : '';
    setToastMessage(
      hasVariations
        ? `"${product.name}" (${color.name})${textSnippet} adicionado ao carrinho!`
        : `"${product.name}"${textSnippet} adicionado ao carrinho!`
    );
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.85 } });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (
    productId: string,
    colorName: string,
    delta: number,
    customText?: string
  ) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor.name === colorName &&
            (item.customText || '') === (customText || '')
          ) {
            const min = item.product.minQuantity || 1;
            const nextQty = item.quantity + delta;
            return nextQty >= min ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string, colorName: string, customText?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor.name === colorName &&
            (item.customText || '') === (customText || '')
          )
      )
    );
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Navigation scroll helpers
  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCustomizer = () => {
    document.getElementById('personalize')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#061b14] text-slate-100 flex flex-col selection:bg-rose-700 selection:text-white relative">
      {/* 1. Snow Effect on Canvas with user toggle */}
      <SnowEffect />

      {/* Admin Notice Banner - Visible only in Admin Mode to reassure owner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between flex-wrap gap-2 shadow-lg z-50 sticky top-0 border-b border-amber-300">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Painel do Lojista Ativo
            </span>
            <span className="text-slate-950 text-xs font-medium">
              Você pode alterar fotos, vídeos e a logo. <strong>Seus clientes normais NÃO verão nenhum botão de "+ Foto" no site publicado!</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 border border-slate-950/40 px-2.5 py-1 rounded text-xs font-bold transition-colors"
            >
              Trocar Logo
            </button>
            <button
              type="button"
              onClick={handleToggleAdmin}
              className="bg-slate-950 text-amber-300 hover:bg-slate-900 px-3 py-1 rounded text-xs font-bold transition-colors shadow-sm"
            >
              Ver como Cliente
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Navigation Bar with Garland Lights */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        customLogoUrl={customLogoUrl}
        onOpenLogoSettings={() => setIsLogoModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* 3. Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={scrollToCatalog}
          onOpenCustomizer={scrollToCustomizer}
        />

        {/* Catalog Section */}
        <ProductCatalog
          onSelectProduct={(p, initialColor) => setSelectedProduct({ product: p, initialColor })}
          onAddToCart={handleAddToCart}
          customImages={customProductImages}
          customVideos={customProductVideos}
          onUpdateProductImage={handleUpdateProductImage}
          onOpenImageModal={(p, colorName) => setImageModalData({ product: p, colorName })}
          onDirectUpload={handleDirectUpload}
          isAdmin={isAdmin}
        />

        {/* Custom Order / Bola de Natal com Nome Personalizado Section */}
        <CustomOrderSection />

        {/* Quality and Pillars */}
        <HolidayFeatures />

        {/* Testimonials & FAQs */}
        <TestimonialsAndFaq />
      </main>

      {/* 4. Footer */}
      <Footer
        customLogoUrl={customLogoUrl}
        onOpenLogoSettings={() => setIsLogoModalOpen(true)}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
      />

      {/* Logo Settings & Upload Modal */}
      {isLogoModalOpen && (
        <LogoSettingsModal
          isOpen={true}
          onClose={() => setIsLogoModalOpen(false)}
          currentLogo={customLogoUrl}
          onSaveLogo={handleSaveLogo}
        />
      )}

      {/* Product Image & Video Upload Modal */}
      {imageModalData && (
        <ProductImageModal
          isOpen={true}
          product={imageModalData.product}
          initialColorName={imageModalData.colorName}
          customImages={customProductImages}
          customVideos={customProductVideos}
          onClose={() => setImageModalData(null)}
          onSaveImage={handleUpdateProductImage}
          onRemoveImage={handleRemoveProductImage}
          onSaveVideo={handleUpdateProductVideo}
          onRemoveVideo={handleRemoveProductVideo}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct.product}
          initialColor={selectedProduct.initialColor}
          customImages={customProductImages}
          customVideos={customProductVideos}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onUpdateImage={handleUpdateProductImage}
          onSaveVideo={handleUpdateProductVideo}
          onRemoveVideo={handleRemoveProductVideo}
          onOpenImageModal={(p, colorName) => setImageModalData({ product: p, colorName })}
          onRemoveImage={handleRemoveProductImage}
          isAdmin={isAdmin}
        />
      )}

      {/* Cart Drawer with dynamic live images */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems.map((item) => {
          const colorKey = `${item.product.id}__${item.selectedColor.name}`;
          const currentImg =
            customProductImages[colorKey] ||
            customProductImages[item.product.id] ||
            item.product.imageUrl ||
            '';
          return {
            ...item,
            product: {
              ...item.product,
              imageUrl: currentImg,
            },
          };
        })}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-amber-400/40 bg-[#07241a]/95 px-4 py-3 text-xs font-semibold text-amber-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-3 w-3" />
          </span>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-xs text-amber-400 underline font-bold hover:text-white"
          >
            Ver Carrinho
          </button>
        </div>
      )}

      {/* Floating WhatsApp Quick Action Button with (13) 98843-7321 */}
      <a
        href="https://wa.me/5513988437321?text=Ol%C3%A1%20VHDESIGNER3d!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20as%20pe%C3%A7as%20de%20Natal."
        target="_blank"
        rel="noopener noreferrer"
        title="Fale conosco no WhatsApp (13) 98843-7321"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-emerald-500 bg-gradient-to-r from-emerald-600 to-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-xl shadow-emerald-950/70 hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-4 h-4 text-emerald-100" />
        <span className="hidden sm:inline">WhatsApp (13) 98843-7321</span>
      </a>
    </div>
  );
}
