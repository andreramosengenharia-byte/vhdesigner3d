import React, { useState } from 'react';
import { Star, ChevronDown, MessageSquare, HelpCircle } from 'lucide-react';

export const TestimonialsAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: 'Mariana Vasconcelos',
      location: 'São Paulo, SP',
      text: 'O Presépio Luminária com LED é simplesmente emocionante, trouxe uma atmosfera de paz maravilhosa para a nossa sala! E as mandalas com os nomes dos meus filhos na árvore ficaram perfeitas.',
      rating: 5,
      product: 'Presépio Luminária 3D com LED + Mandalas com Nome',
    },
    {
      name: 'Carlos Eduardo Ramos',
      location: 'Curitiba, PR',
      text: 'Comprei o letreiro personalizado com o nome da nossa família e a nova árvore decorativa de mesa. As peças são super firmes, ficam em pé perfeitamente e o acabamento é impecável!',
      rating: 5,
      product: 'Letreiro Feliz Natal Personalizado + Árvore Decorativa 3D',
    },
    {
      name: 'Juliana P. Albuquerque',
      location: 'Belo Horizonte, MG',
      text: 'O cesto porta-panetone do Papai Noel com o mini panetone incluso fez o maior sucesso como presente! E o kit de porta-guardanapos natalinos deixou nossa ceia digna de revista.',
      rating: 5,
      product: 'Cesto Porta-Panetone Noel + Kit Porta-Guardanapo',
    },
    {
      name: 'Rodrigo M. Silveira',
      location: 'Santos, SP',
      text: 'O Kit de Decorações Natalinas com o letreiro e as miniaturas é maravilhoso. Chegou super rápido e o atendimento pelo WhatsApp foi ágil e muito atencioso!',
      rating: 5,
      product: 'Kit de Decorações Natalinas (Letreiro + 5 Bonecos)',
    },
  ];

  const faqs = [
    {
      question: 'Qual é o prazo limite para garantir entrega antes do Natal?',
      answer: 'Despachamos pedidos para todo o Brasil. Para encomendas personalizadas (como as Bolas de Natal com Nome Gravado), recomendamos fechar seu pedido com antecedência pelo nosso WhatsApp (13) 98843-7321.',
    },
    {
      question: 'Qual é a qualidade e durabilidade das peças 3D?',
      answer: 'Nossas peças são produzidas com matéria-prima de altíssima qualidade e resistência mecânica. Proporcionam cores vivas, acabamento acetinado impecável e durabilidade para enfeitar e encantar por muitos Natais.',
    },
    {
      question: 'O material é resistente e durável para os próximos anos?',
      answer: 'Sim! Nossas peças são sólidas e feitas com preenchimento reforçado para que você possa guardá-las e utilizá-las novamente em todos os seus Natais. Devem apenas ser mantidas longe de calor excessivo (como fornos ou sol direto prolongado).',
    },
    {
      question: 'Vocês atendem encomendas de kits corporativos e lembrancinhas?',
      answer: 'Sim, produzimos letreiros e brindes de Natal para empresas e eventos com condições especiais. Fale conosco diretamente pelo WhatsApp (13) 98843-7321.',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Testimonials */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Depoimentos Reais</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-emerald-900/50 bg-[#07241a]/60 p-6 flex flex-col justify-between hover:border-amber-400/30 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-emerald-900/50">
                <div className="font-semibold text-xs text-white">{t.name}</div>
                <div className="text-[11px] text-emerald-400/80">{t.location} · {t.product}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dúvidas Frequentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Perguntas sobre as peças natalinas
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-emerald-900/60 bg-[#061e16] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-100 hover:text-amber-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-emerald-950/70">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
