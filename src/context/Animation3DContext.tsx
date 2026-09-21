import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Background3DMode = 'cyber-grid' | 'deep-cosmos' | 'geometric';

interface Animation3DContextType {
  is3DEnabled: boolean;
  toggle3D: () => void;
  set3DEnabled: (enabled: boolean) => void;
  bgMode: Background3DMode;
  setBgMode: (mode: Background3DMode) => void;
}

const Animation3DContext = createContext<Animation3DContextType | undefined>(undefined);

export const Animation3DProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [is3DEnabled, setIs3DEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portfolio_3d_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [bgMode, setBgMode] = useState<Background3DMode>(() => {
    try {
      const saved = localStorage.getItem('portfolio_bg_mode');
      if (saved === 'cyber-grid' || saved === 'deep-cosmos' || saved === 'geometric') {
        return saved;
      }
      return 'cyber-grid';
    } catch {
      return 'cyber-grid';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_3d_enabled', String(is3DEnabled));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [is3DEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_bg_mode', bgMode);
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [bgMode]);

  const toggle3D = () => setIs3DEnabled((prev) => !prev);
  const set3DEnabled = (enabled: boolean) => setIs3DEnabled(enabled);

  return (
    <Animation3DContext.Provider
      value={{
        is3DEnabled,
        toggle3D,
        set3DEnabled,
        bgMode,
        setBgMode,
      }}
    >
      {children}
    </Animation3DContext.Provider>
  );
};

export const useAnimation3D = (): Animation3DContextType => {
  const context = useContext(Animation3DContext);
  if (!context) {
    throw new Error('useAnimation3D must be used within an Animation3DProvider');
  }
  return context;
};
