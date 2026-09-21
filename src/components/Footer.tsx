import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { PERSONAL_INFO } from '../data';
import { useBlackHoleWarp } from './BlackHoleTransition';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const { warpTo } = useBlackHoleWarp();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
        setShowScrollTop(window.scrollY > 250);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    warpTo('#home', 'HOME');
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <footer className="border-t border-zinc-800/80 bg-[#050508] py-10 relative">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        
        {/* Left copyright */}
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-zinc-300">
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">{PERSONAL_INFO.name}</span>. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-500 mt-1">
            <span>Diploma in CSE • Web Architect</span>
            {onReplayIntro && (
              <>
                <span>•</span>
                <button
                  type="button"
                  id="footer-replay-intro-btn"
                  onClick={onReplayIntro}
                  className="inline-flex items-center gap-1 hover:text-[#ff4d4d] text-zinc-400 font-mono transition-colors"
                  title="Reboot & Experience Loading Screen"
                >
                  <RotateCcw className="w-3 h-3 text-[#ff2a2a]" />
                  <span>Replay Intro</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Center Socials */}
        <div className="flex items-center gap-4 text-zinc-400">
          <a
            href={`https://wa.me/${PERSONAL_INFO.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors"
            title="WhatsApp"
          >
            <i className="fa-brands fa-whatsapp text-lg" />
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            title="LinkedIn"
          >
            <i className="fa-brands fa-linkedin-in text-lg" />
          </a>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="GitHub"
          >
            <i className="fa-brands fa-github text-lg" />
          </a>
          <a
            href={PERSONAL_INFO.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
            title="Twitter"
          >
            <i className="fa-brands fa-twitter text-lg" />
          </a>
        </div>

      </motion.div>

      {/* Floating Scroll-to-Top Button with Circular SVG Progress */}
      <button
        type="button"
        id="scroll-to-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-zinc-900/95 border border-[#ff2a2a]/40 shadow-xl shadow-black/80 flex items-center justify-center text-white z-40 transition-all duration-300 hover:scale-110 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <svg className="absolute w-12 h-12 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-zinc-800"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-[#ff2a2a] transition-all duration-100"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <ArrowUp className="w-5 h-5 text-[#ff2a2a]" />
      </button>
    </footer>
  );
};

