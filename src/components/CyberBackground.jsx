import React, { useEffect, useState } from 'react';

export default function CyberBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      // Throttle mouse updates using requestAnimationFrame for 60fps lock
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transform-gpu" aria-hidden="true">
      
      {/* 1. Cyber Dot Grid Matrix with Radial Vignette Fade */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 dark:opacity-70 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_35%,#000_40%,transparent_100%)]" 
      />

      {/* 2. Interactive Ambient Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-60 dark:opacity-80"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.07), transparent 45%)`
        }}
      />

      {/* 3. Floating Aurora Glowing Orbs (Deep Cyan, Indigo, Violet) */}
      {/* Orb 1: Deep Cyan / Electric Blue (Top Left drift) */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent blur-[120px] animate-float-1 will-change-transform" />

      {/* Orb 2: Deep Indigo / Cobalt (Top Right / Center drift) */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-indigo-600/20 via-blue-500/15 to-transparent blur-[140px] animate-float-2 will-change-transform" />

      {/* Orb 3: Violet / Neon Rose (Bottom Center / Left drift) */}
      <div className="absolute -bottom-40 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-600/15 via-rose-500/10 to-transparent blur-[130px] animate-float-3 will-change-transform" />

      {/* 4. Peripheral Subtle Edge Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,13,22,0.4)_100%)] dark:block hidden" />

    </div>
  );
}
