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
      
      {/* 1. Subtle Cyber Dot Grid Matrix - Clean Dark Mode Only */}
      <div 
        className="hidden dark:block absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-35 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_35%,#000_50%,transparent_100%)]" 
      />

      {/* 2. Interactive Ambient Cursor Spotlight Glow - Dark Mode */}
      <div
        className="hidden dark:block absolute inset-0 transition-opacity duration-300 opacity-90"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 50%)`
        }}
      />

      {/* 3. Floating Aurora Glowing Orbs (Deep Cyan, Electric Indigo, Neon Violet) - Dark Mode Only */}
      <div className="hidden dark:block">
        {/* Orb 1: Electric Cyan (Top Left drift) */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[130px] animate-float-1 will-change-transform" />

        {/* Orb 2: Deep Indigo / Cobalt (Top Right / Center drift) */}
        <div className="absolute top-1/4 -right-24 w-[550px] h-[550px] rounded-full bg-indigo-600/25 blur-[140px] animate-float-2 will-change-transform" />

        {/* Orb 3: Violet / Neon Purple (Bottom Center / Left drift) */}
        <div className="absolute -bottom-24 left-1/3 w-[480px] h-[480px] rounded-full bg-purple-600/20 blur-[130px] animate-float-3 will-change-transform" />
      </div>

    </div>
  );
}
