import React from 'react';

export const ChristmasGarland: React.FC = () => {
  // Array of 16 bulbs spanning across the top
  const bulbs = [
    { color: 'gold', delay: '0s' },
    { color: 'red', delay: '0.4s' },
    { color: 'green', delay: '0.8s' },
    { color: 'gold', delay: '1.2s' },
    { color: 'red', delay: '0.2s' },
    { color: 'gold', delay: '0.6s' },
    { color: 'green', delay: '1.0s' },
    { color: 'red', delay: '1.4s' },
    { color: 'gold', delay: '0.3s' },
    { color: 'green', delay: '0.7s' },
    { color: 'red', delay: '1.1s' },
    { color: 'gold', delay: '0.5s' },
    { color: 'green', delay: '0.9s' },
    { color: 'red', delay: '1.3s' },
    { color: 'gold', delay: '0.1s' },
    { color: 'green', delay: '0.8s' },
  ];

  return (
    <div className="pointer-events-none absolute top-0 left-0 right-0 z-30 overflow-hidden h-7">
      {/* Garland wire */}
      <svg className="w-full h-4 absolute top-0" preserveAspectRatio="none" viewBox="0 0 1000 24">
        <path
          d="M 0 4 Q 31 16, 62 4 Q 93 16, 125 4 Q 156 16, 187 4 Q 218 16, 250 4 Q 281 16, 312 4 Q 343 16, 375 4 Q 406 16, 437 4 Q 468 16, 500 4 Q 531 16, 562 4 Q 593 16, 625 4 Q 656 16, 687 4 Q 718 16, 750 4 Q 781 16, 812 4 Q 843 16, 875 4 Q 906 16, 937 4 Q 968 16, 1000 4"
          fill="none"
          stroke="#064e3b"
          strokeWidth="1.5"
          opacity="0.8"
        />
      </svg>

      {/* Bulbs hanging */}
      <div className="w-full flex justify-around px-2 relative pt-2">
        {bulbs.map((b, idx) => {
          let bulbBg = 'bg-amber-400 shadow-[0_0_8px_#fbbf24]';
          let animClass = 'anim-twinkle-gold';

          if (b.color === 'red') {
            bulbBg = 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
            animClass = 'anim-twinkle-red';
          } else if (b.color === 'green') {
            bulbBg = 'bg-emerald-400 shadow-[0_0_8px_#34d399]';
            animClass = 'anim-twinkle-green';
          }

          return (
            <div key={idx} className="flex flex-col items-center">
              <span className="w-1 h-1 bg-emerald-950 rounded-t-xs" />
              <span
                className={`w-2 h-3 rounded-full ${bulbBg} ${animClass}`}
                style={{ animationDelay: b.delay }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
