import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      id="portfolio-toast"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-zinc-900/95 border border-[#ff2a2a]/60 text-white text-sm font-medium shadow-2xl shadow-[#ff2a2a]/30 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-zinc-400 hover:text-white text-xs px-1"
      >
        ✕
      </button>
    </div>
  );
};
