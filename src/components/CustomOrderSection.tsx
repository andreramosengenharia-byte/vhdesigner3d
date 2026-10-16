import React, { useState } from 'react';
import { Sparkles, MessageCircle, CheckCircle2, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getBallPackPrice, BALL_VOLUME_TIERS } from '../data/products';

const BALL_COLORS = [
  { name: 'Branco', hex: '#FFFFFF', bgGradient: 'from-slate-200 via-white to-slate-100' },
  { name: 'Verde', hex: '#15803D', bgGradient: 'from-emerald-950 via-emerald-600 to-emerald-400' },
  { name: 'Dourado', hex: '#D49A25', bgGradient: 'from-amber-600 via-yellow-500 to-amber-300' },
  { name: 'Vermelho', hex: '#DC2626', bgGradient: 'from-rose-800 via-red-600 to-rose-400' },
];

export const CustomOrderSection: React.FC = () => {
  const [customName, setCustomName] = useState<string>('Aline');
  const [selectedColor, setSelectedColor] = useState<string>('Branco');
  const [quantity, setQuantity] = useState<number>(6); // Pedido mínimo 6 peças
  const [clientName, setClientName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);

  const totalEstimated = getBallPackPrice(quantity);
  const activeColorObj = BALL_COLORS.find((c) => c.name === selectedColor) || BALL_COLORS[0];

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const message =
      `Olá, VHDESIGNER3d! Quero encomendar os Enfeites de Árvore em Formato de Floco de Neve com Nome Personalizado:\n\n` +
      `Cliente: ${clientName || 'Não informado'}\n` +
      `Produto: Enfeite de Árvore em Formato de Floco de Neve Personalizado 3D (Ø 8cm × 4mm)\n` +
      `Nome(s) / Gravação: "${customName}"\n` +
      `Cor: ${selectedColor}\n` +
      `Quantidade: ${quantity} unidades\n` +
      `Valor Total do Lote: R$ ${totalEstimated.toFixed(2).replace('.', ',')}\n` +
      (notes ? `Observações: ${notes}\n\n` : `\n`) +
      `Poderiam me passar a confirmação do pedido e prazo de envio?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5513988437321?text=${encoded}`, '_blank');

    setIsSent(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <section id="personalize" className="relative scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#061d15] via-[#08241b] to-[#04140e]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Fabricação Sob Demanda</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white leading-tight">
            Enfeite de Árvore com Formato de Floco de Neve
          </h2>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-amber-400/40 text-xs text-amber-300 font-mono">
            <span>Dimensões: Ø 8 cm de diâmetro × 4 mm de espessura</span>
          </div>
          <p className="mt-3 text-sm text-emerald-200/80 leading-relaxed">
            Eternize os nomes que você ama na árvore de Natal! <strong className="text-amber-300">Não precisa ser apenas família</strong>: personalize com nomes dos filhos, netos, amigos, pets ou empresas. Pedido mínimo em lotes a partir de 6 peças com desconto progressivo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <form
            onSubmit={handleSendToWhatsApp}
            className="lg:col-span-7 rounded-2xl border border-emerald-900/60 bg-[#062016]/90 p-6 sm:p-8 shadow-xl space-y-5"
          >
            {/* Custom Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>1. Nome(s) a Gravar na Mandala 3D</span>
                <span className="text-[11px] text-amber-300 lowercase font-normal">qualquer nome</span>
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Aline, Arthur, Sofia, Bob (Pet), Família..."
                className="w-full bg-[#041810] border border-emerald-900 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-emerald-300/80 mt-1">
                💡 Para mais de 1 nome no kit, você pode separar por vírgulas ou detalhar no campo de observações abaixo.
              </p>
            </div>

            {/* Color selection - Clean names: Branco, Verde, Dourado, Vermelho */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                2. Cor do Floco: <span className="text-amber-300 font-bold">{selectedColor}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BALL_COLORS.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-emerald-900/80 text-amber-200 shadow-sm ring-1 ring-amber-400'
                          : 'border-emerald-900 bg-[#041810] text-slate-300 hover:border-emerald-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Tier Quick Selector (6 por 39,90 | 12 por 74,90 | 18 por 109,99 | 24 por 149,90) */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. Escolha o Lote (Mínimo 6 Peças):</span>
                </span>
                <span className="text-[11px] text-amber-300 font-bold">
                  {quantity} peças = R$ {totalEstimated.toFixed(2).replace('.', ',')}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BALL_VOLUME_TIERS.slice(0, 4).map((tier) => (
                  <button
                    key={tier.qty}
                    type="button"
                    onClick={() => setQuantity(tier.qty)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      quantity === tier.qty
                        ? 'border-amber-400 bg-emerald-900/90 text-amber-200 font-bold ring-1 ring-amber-400 shadow-sm'
                        : 'border-emerald-900 bg-[#041810] text-slate-300 hover:border-emerald-700'
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-100">{tier.qty} peças</span>
                    <span className="text-[11px] text-amber-300 font-semibold block mt-0.5">
                      R$ {tier.price.toFixed(2).replace('.', ',')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Client Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                  Ajuste de Peças (em lotes de 6)
                </label>
                <div className="flex items-center rounded-xl border border-emerald-900 bg-[#041810] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(6, quantity - 6))}
                    className="w-10 h-8 flex items-center justify-center text-slate-300 hover:text-white font-bold"
                  >
                    -6
                  </button>
                  <span className="flex-1 text-center font-bold text-amber-300 text-sm tabular-nums">
                    {quantity} peças
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 6)}
                    className="w-10 h-8 flex items-center justify-center text-slate-300 hover:text-white font-bold"
                  >
                    +6
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome para o pedido"
                  className="w-full bg-[#041810] border border-emerald-900 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                Observações / Lista de nomes (opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: 2 com Aline, 2 com Arthur, 1 com Sofia, 1 com Bob..."
                className="w-full bg-[#041810] border border-emerald-900 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 text-slate-950" />
              <span>Pedir no WhatsApp (13) 98843-7321</span>
            </button>
            {isSent && (
              <p className="text-center text-xs text-emerald-300 font-medium animate-pulse flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Conversa aberta no WhatsApp! Responderemos em minutos.
              </p>
            )}
          </form>

          {/* Right: Live Preview Box & Technical Assurance */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#092b1e] to-[#04150f] p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60">
                <span className="text-xs font-mono uppercase text-amber-400">Prévia do Enfeite 3D (Ø 8 cm × 4 mm)</span>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  Alta Definição 3D
                </span>
              </div>

              {/* Realistic Snowflake Mandala Mockup */}
              <div className="my-6 flex flex-col items-center justify-center py-6 bg-[#03100a]/80 rounded-xl border border-emerald-950 relative overflow-hidden">
                {/* Hanging string */}
                <div className="w-[1.5px] h-6 bg-amber-200/80 mb-1" />

                <div className="relative">
                  <svg viewBox="0 0 200 200" className="w-36 h-36 filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.7)]">
                    {/* Hanging Loop */}
                    <circle cx="100" cy="14" r="5" fill="none" stroke={activeColorObj.hex} strokeWidth="2.5" />

                    {/* Outer Snowflake Crystals */}
                    <g stroke={activeColorObj.hex} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <g key={deg} transform={`rotate(${deg} 100 100)`}>
                          <line x1="100" y1="36" x2="100" y2="18" />
                          <polyline points="93,28 100,21 107,28" />
                          <polyline points="95,33 100,28 105,33" />
                        </g>
                      ))}
                    </g>

                    {/* Concentric Double Circles */}
                    <circle cx="100" cy="100" r="64" fill="none" stroke={activeColorObj.hex} strokeWidth="4.5" />
                    <circle cx="100" cy="100" r="56" fill="none" stroke={activeColorObj.hex} strokeWidth="2" opacity="0.75" />

                    {/* Engraved name */}
                    <text
                      x="100"
                      y="112"
                      textAnchor="middle"
                      fontFamily="cursive, serif"
                      fontSize="36"
                      fontStyle="italic"
                      fontWeight="bold"
                      fill={activeColorObj.hex}
                      stroke="#04150f"
                      strokeWidth="1"
                      paintOrder="stroke fill"
                    >
                      {customName || 'Aline'}
                    </text>
                  </svg>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs font-semibold text-slate-200">
                    Enfeite Floco de Neve • Cor: <strong className="text-amber-300">{selectedColor}</strong>
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Nome gravado: <strong className="text-white">"{customName || 'Aline'}"</strong>
                  </span>
                  <span className="block text-[10px] text-amber-300/80 mt-1 font-mono">
                    Tamanho: 8 cm de diâmetro × 4 mm de espessura
                  </span>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-slate-400">Total do Lote ({quantity} peças):</span>
                  <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                    R$ {totalEstimated.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-emerald-400 block">
                    (R$ {(totalEstimated / quantity).toFixed(2).replace('.', ',')} por peça)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-medium block">Pedido Mínimo 6 Peças</span>
                  <span className="text-[10px] text-slate-400">Entrega rápida para o Natal</span>
                </div>
              </div>
            </div>

            {/* Quality badge */}
            <div className="rounded-xl border border-emerald-800/40 bg-[#061d15] p-4 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Acabamento de Alta Definição</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                As mandalas são fabricadas com encaixe para cordão natalino e gravação tridimensional profunda do nome, sem risco de desbotar ou descascar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
