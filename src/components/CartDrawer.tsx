import React, { useState } from 'react';
import { CartItem } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { getBallPackPrice } from '../data/products';
import { X, Trash2, ShoppingBag, Tag, Check, MessageCircle, QrCode, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BRAND_CONFIG } from '../config/branding';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, colorName: string, delta: number, customText?: string) => void;
  onRemoveItem: (productId: string, colorName: string, customText?: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState<boolean>(false);
  const [copiedPix, setCopiedPix] = useState<boolean>(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    if (item.product.id === 'vh-bolinhas-floco-nome-personalizado') {
      return sum + getBallPackPrice(item.quantity);
    }
    return sum + item.product.price * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'NATAL3D' || clean === 'VHDESIGNER10') {
      setDiscountPercent(10);
      setCouponSuccess('Cupom de 10% OFF aplicado com sucesso!');
      setCouponError('');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setCouponError('Cupom inválido. Tente NATAL3D');
      setCouponSuccess('');
    }
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    let message = `Olá, VHDESIGNER3d! Gostaria de fechar meu pedido de Natal:\n\n`;
    items.forEach((item, index) => {
      const itemTotal =
        item.product.id === 'vh-bolinhas-floco-nome-personalizado'
          ? getBallPackPrice(item.quantity)
          : item.product.price * item.quantity;

      message += `Item ${index + 1}: ${item.product.name}\n`;
      if (item.product.colors && item.product.colors.length > 0) {
        message += `Cor: ${item.selectedColor.name}\n`;
      }
      if (item.customText) {
        message += `Nome/Gravação: "${item.customText}"\n`;
      }
      message += `Quantidade: ${item.quantity} ${item.quantity > 1 ? 'unidades' : 'unidade'}\n`;
      message += `Preço: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
    });

    message += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    if (discountAmount > 0) {
      message += `Desconto Cupom (${discountPercent}%): -R$ ${discountAmount.toFixed(2).replace('.', ',')}\n`;
    }
    message += `Total Final: R$ ${finalTotal.toFixed(2).replace('.', ',')}\n\n`;
    message += `Poderiam confirmar minha encomenda? Realizarei o pagamento via Pix (Chave: ${BRAND_CONFIG.pixKey}).`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5513988437321?text=${encoded}`, '_blank');
  };

  const handleDirectPixCheckout = () => {
    setShowCheckoutSuccess(true);
    setCopiedPix(false);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(BRAND_CONFIG.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <aside className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md bg-[#061d15] border-l border-emerald-900 text-slate-100 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-emerald-900/70 flex items-center justify-between bg-[#04150f]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold font-cinzel text-white">
                Carrinho de Natal ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-emerald-950 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-900 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-base font-semibold text-slate-200">Seu carrinho está vazio</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Explore nossas decorações e presentes 3D para dar vida ao seu Natal!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 px-4 py-2 rounded-lg bg-emerald-800 text-amber-200 text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const itemTotal =
                  item.product.id === 'vh-bolinhas-floco-nome-personalizado'
                    ? getBallPackPrice(item.quantity)
                    : item.product.price * item.quantity;
                const step = item.product.quantityStep || 1;
                const min = item.product.minQuantity || 1;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedColor.name}-${item.customText || ''}-${idx}`}
                    className="flex gap-3 p-3 rounded-xl border border-emerald-900/40 bg-[#07241a]/60 items-center justify-between"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-emerald-950 bg-[#03110b]">
                      <ProductArtwork product={item.product} selectedColorHex={item.selectedColor.hex} hideBadge={true} />
                    </div>

                    {/* Item info */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-slate-100 truncate">
                        {item.product.name}
                      </h4>
                      {item.customText && (
                        <p className="text-[11px] text-amber-300 font-medium truncate">
                          ✍️ "{item.customText}"
                        </p>
                      )}
                      {item.product.colors && item.product.colors.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 mt-0.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block shrink-0"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="truncate">{item.selectedColor.name}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-400/90 mt-0.5">
                          <span>Design Original</span>
                        </div>
                      )}
                      <div className="text-xs font-bold text-amber-300 tabular-nums mt-1">
                        R$ {itemTotal.toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center rounded-md border border-emerald-800 bg-[#051c14] text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedColor.name, -step, item.customText)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-amber-200 tabular-nums font-semibold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedColor.name, step, item.customText)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id, item.selectedColor.name, item.customText)}
                        className="text-slate-500 hover:text-rose-400 text-xs transition-colors p-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-emerald-900 bg-[#04150f] space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Cupom: NATAL3D"
                    className="w-full bg-[#082a1e] border border-emerald-900 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-200 text-xs font-semibold transition-colors"
                >
                  Aplicar
                </button>
              </form>
              {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-emerald-950">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto Natalino ({discountPercent}%):</span>
                    <span className="tabular-nums">-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-emerald-950">
                  <span>Total do Pedido:</span>
                  <span className="text-amber-300 tabular-nums">
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Enviar Pedido pelo WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectPixCheckout}
                  className="w-full py-2 px-4 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Simular Pagamento Instantâneo Pix</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Pix Simulation Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-amber-400/50 bg-[#061e16] p-6 text-center text-slate-100 shadow-2xl space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500">
              <Check className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-cinzel text-amber-300">
                Pedido Pré-Registrado!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Total: <strong className="text-white">R$ {finalTotal.toFixed(2).replace('.', ',')}</strong>
              </p>
            </div>

            {/* Simulated Pix QR Code */}
            <div className="mx-auto w-40 h-40 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                <rect x="10" y="10" width="25" height="25" fill="#061e16" />
                <rect x="65" y="10" width="25" height="25" fill="#061e16" />
                <rect x="10" y="65" width="25" height="25" fill="#061e16" />
                <rect x="15" y="15" width="15" height="15" fill="#FFF" />
                <rect x="70" y="15" width="15" height="15" fill="#FFF" />
                <rect x="15" y="70" width="15" height="70" fill="#FFF" />
                <rect x="42" y="20" width="16" height="60" fill="#061e16" opacity="0.8" />
              </svg>
            </div>

            {/* Pix Key Box with Copy Button */}
            <div className="rounded-xl border border-emerald-900/80 bg-[#03130d] p-3 text-left space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Chave Pix ({BRAND_CONFIG.pixType}):</span>
                <span className="text-[10px] text-emerald-400 font-semibold">VHDESIGNER3d</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-[#020b07] border border-emerald-950 p-2 rounded-lg">
                <span className="font-mono text-xs font-bold text-amber-200 select-all truncate">
                  {BRAND_CONFIG.pixKey}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-[10px] font-semibold shrink-0 transition-colors"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Após transferir, envie o comprovante para nosso WhatsApp <strong className="text-emerald-300">(13) 98843-7321</strong> para início da confecção!
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowCheckoutSuccess(false);
                onClearCart();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-200 font-semibold text-xs tracking-wide transition-colors"
            >
              Concluir e Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
