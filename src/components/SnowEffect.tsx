import React, { useEffect, useRef, useState } from 'react';
import { Snowflake, Pause, Play } from 'lucide-react';

export const SnowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const flakeCount = Math.min(65, Math.floor(width / 24));
    interface Flake {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      swing: number;
      swingSpeed: number;
    }

    const flakes: Flake[] = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.9 + 0.4,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.25,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.swing += f.swingSpeed;
        f.y += f.speedY;
        f.x += Math.sin(f.swing) * 0.4 + f.speedX;

        if (f.y > height) {
          f.y = -10;
          f.x = Math.random() * width;
        }
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  return (
    <>
      {isActive && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-70"
          aria-hidden="true"
        />
      )}
      <button
        type="button"
        onClick={() => setIsActive(!isActive)}
        title={isActive ? 'Pausar efeito de neve' : 'Ativar efeito de neve'}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 rounded-full border border-emerald-800/60 bg-[#062016]/90 px-3 py-1.5 text-xs font-medium text-emerald-200/90 shadow-lg backdrop-blur-md transition-all hover:border-amber-400/50 hover:bg-[#092b1f] hover:text-amber-200"
      >
        <Snowflake className={`h-3.5 w-3.5 text-amber-300 ${isActive ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
        <span>{isActive ? 'Neve Ativa' : 'Neve Pausada'}</span>
        {isActive ? <Pause className="h-3 w-3 opacity-70" /> : <Play className="h-3 w-3 opacity-70" />}
      </button>
    </>
  );
};
