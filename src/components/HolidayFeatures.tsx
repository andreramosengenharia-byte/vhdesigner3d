import React from 'react';
import { Layers, Sparkles, Leaf, Gift, Clock, ShieldCheck } from 'lucide-react';

export const HolidayFeatures: React.FC = () => {
  const features = [
    {
      icon: Layers,
      title: 'Alta Definição e Precisão',
      description: 'Acabamento suave e contínuo com riqueza nos mínimos detalhes, revelando curvas elegantes e design refinado.',
      color: 'text-amber-400',
    },
    {
      icon: Sparkles,
      title: 'Cores Vivas e Metalizadas',
      description: 'Cores natalinas profundas com brilho acetinado em dourado, rubi, branco e verde sob as luzes de Natal.',
      color: 'text-rose-400',
    },
    {
      icon: Leaf,
      title: 'Alta Durabilidade e Resistência',
      description: 'Peças sólidas com estrutura reforçada e altíssima durabilidade, feitas para brilhar e encantar por muitos Natais.',
      color: 'text-emerald-400',
    },
    {
      icon: Gift,
      title: 'Embalagem Especial com Laço',
      description: 'Todas as peças saem do nosso ateliê embaladas em caixas decoradas com laço de cetim e cartão natalino, prontas para presentear.',
      color: 'text-amber-300',
    },
  ];

  return (
    <section id="sobre" className="relative scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-emerald-900/50">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Qualidade & Compromisso</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white leading-tight">
          A arte da impressão 3D na VHDESIGNER3d
        </h2>
        <p className="mt-3 text-sm text-emerald-200/80 leading-relaxed">
          Combinamos engenharia de ponta, design paramétrico e acabamento artesanal para que seu Natal brilhe com decorações memoráveis e colecionáveis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div
              key={index}
              className="rounded-2xl border border-emerald-900/60 bg-[#07241a]/60 p-6 flex flex-col justify-between hover:border-amber-400/40 transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center mb-4">
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="text-base font-bold text-white font-cinzel">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
