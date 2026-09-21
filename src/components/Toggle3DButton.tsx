import React from 'react';
import { Box } from 'lucide-react';
import { useAnimation3D } from '../context/Animation3DContext';

interface Toggle3DButtonProps {
  variant?: 'compact' | 'pill' | 'button-pair';
  className?: string;
  idPrefix?: string;
}

export const Toggle3DButton: React.FC<Toggle3DButtonProps> = ({
  variant = 'pill',
  className = '',
  idPrefix = 'global',
}) => {
  const { is3DEnabled, toggle3D, set3DEnabled } = useAnimation3D();

  const handleToggle = () => {
    toggle3D();
  };

  const handleSet = (enabled: boolean) => {
    set3DEnabled(enabled);
  };

  if (variant === 'button-pair') {
    return (
      <div
        id={`${idPrefix}-3d-button-pair`}
        className={`inline-flex items-center p-1 rounded-xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-md ${className}`}
      >
        <span className="px-2.5 py-1 text-xs font-mono text-zinc-400 flex items-center gap-1.5 border-r border-zinc-800/80 mr-1">
          <Box className={`w-3.5 h-3.5 ${is3DEnabled ? 'text-[#ff2a2a]' : 'text-zinc-500'}`} />
          <span>3D FX:</span>
        </span>
        <button
          type="button"
          id={`${idPrefix}-3d-btn-on`}
          onClick={() => handleSet(true)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-200 flex items-center gap-1.5 ${
            is3DEnabled
              ? 'bg-[#ff2a2a] text-white shadow-md shadow-[#ff2a2a]/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${is3DEnabled ? 'bg-white' : 'bg-zinc-600'}`} />
          <span>ON</span>
        </button>
        <button
          type="button"
          id={`${idPrefix}-3d-btn-off`}
          onClick={() => handleSet(false)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-200 flex items-center gap-1.5 ${
            !is3DEnabled
              ? 'bg-zinc-800 text-white shadow-inner border border-zinc-700'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${!is3DEnabled ? 'bg-zinc-400' : 'bg-zinc-600'}`} />
          <span>OFF</span>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        id={`${idPrefix}-3d-toggle-compact`}
        onClick={handleToggle}
        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all duration-200 flex items-center gap-1.5 ${
          is3DEnabled
            ? 'bg-[#ff2a2a]/15 text-[#ff5252] border-[#ff2a2a]/40 hover:bg-[#ff2a2a]/25 shadow-sm shadow-[#ff2a2a]/20'
            : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/80'
        } ${className}`}
        title={is3DEnabled ? 'Click to Disable 3D Animations' : 'Click to Enable 3D Animations'}
      >
        <Box className={`w-3.5 h-3.5 ${is3DEnabled ? 'text-[#ff2a2a] animate-pulse' : 'text-zinc-500'}`} />
        <span>3D</span>
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            is3DEnabled ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-zinc-600'
          }`}
        />
      </button>
    );
  }

  // Default 'pill' variant
  return (
    <button
      type="button"
      id={`${idPrefix}-3d-toggle-pill`}
      onClick={handleToggle}
      className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all duration-200 flex items-center gap-2 group backdrop-blur-md ${
        is3DEnabled
          ? 'bg-[#0f0f15]/90 text-zinc-200 border-[#ff2a2a]/40 hover:border-[#ff2a2a] shadow-md shadow-[#ff2a2a]/10'
          : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
      } ${className}`}
      title={is3DEnabled ? 'Click to Disable 3D Animations' : 'Click to Enable 3D Animations'}
    >
      <Box
        className={`w-3.5 h-3.5 transition-transform duration-300 ${
          is3DEnabled ? 'text-[#ff2a2a] group-hover:rotate-45' : 'text-zinc-500'
        }`}
      />
      <span className="font-semibold">{is3DEnabled ? '3D: ON' : '3D: OFF'}</span>
      <span
        className={`w-2 h-2 rounded-full transition-all ${
          is3DEnabled
            ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse'
            : 'bg-zinc-600'
        }`}
      />
    </button>
  );
};
