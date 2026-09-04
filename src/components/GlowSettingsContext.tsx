import React, { createContext, useContext, useState, useEffect } from 'react';

export type GlowColorTheme = 'gold' | 'emerald' | 'ruby' | 'gold_emerald';
export type GlowPulseSpeed = 'slow' | 'normal' | 'fast' | 'off';

export interface GlowSettings {
  enabled: boolean;
  intensity: number; // 20 to 200 (percentage)
  colorTheme: GlowColorTheme;
  pulseSpeed: GlowPulseSpeed;
  blurRadius: number; // 1 to 12 px
}

const DEFAULT_GLOW_SETTINGS: GlowSettings = {
  enabled: true,
  intensity: 100,
  colorTheme: 'gold_emerald',
  pulseSpeed: 'normal',
  blurRadius: 5
};

interface GlowSettingsContextType {
  settings: GlowSettings;
  updateSettings: (newSettings: Partial<GlowSettings>) => void;
  resetSettings: () => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  getPrimaryGlowColor: () => string;
  getSecondaryGlowColor: () => string;
  getGlowOpacity: () => number;
  getPulseDurationClass: () => string;
}

const GlowSettingsContext = createContext<GlowSettingsContextType | undefined>(undefined);

export const GlowSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GlowSettings>(() => {
    try {
      const saved = localStorage.getItem('acta_concordiae_glow_settings');
      if (saved) {
        return { ...DEFAULT_GLOW_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read glow settings from localStorage', e);
    }
    return DEFAULT_GLOW_SETTINGS;
  });

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('acta_concordiae_glow_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save glow settings to localStorage', e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<GlowSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_GLOW_SETTINGS);
  };

  const getPrimaryGlowColor = () => {
    if (!settings.enabled) return 'transparent';
    switch (settings.colorTheme) {
      case 'gold': return '#E5C170';
      case 'emerald': return '#10B981';
      case 'ruby': return '#F43F5E';
      case 'gold_emerald': default: return '#E5C170';
    }
  };

  const getSecondaryGlowColor = () => {
    if (!settings.enabled) return 'transparent';
    switch (settings.colorTheme) {
      case 'gold': return '#F59E0B';
      case 'emerald': return '#059669';
      case 'ruby': return '#8B1E2F';
      case 'gold_emerald': default: return '#10B981';
    }
  };

  const getGlowOpacity = () => {
    if (!settings.enabled) return 0;
    return (settings.intensity / 100) * 0.75;
  };

  const getPulseDurationClass = () => {
    if (!settings.enabled || settings.pulseSpeed === 'off') return '';
    switch (settings.pulseSpeed) {
      case 'slow': return 'animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]';
      case 'fast': return 'animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]';
      case 'normal': default: return 'animate-pulse';
    }
  };

  return (
    <GlowSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isPanelOpen,
        setIsPanelOpen,
        getPrimaryGlowColor,
        getSecondaryGlowColor,
        getGlowOpacity,
        getPulseDurationClass
      }}
    >
      {children}
    </GlowSettingsContext.Provider>
  );
};

export const useGlowSettings = () => {
  const context = useContext(GlowSettingsContext);
  if (!context) {
    throw new Error('useGlowSettings must be used within a GlowSettingsProvider');
  }
  return context;
};
