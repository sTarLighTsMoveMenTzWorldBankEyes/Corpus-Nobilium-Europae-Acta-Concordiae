import React from 'react';
import { 
  Sliders, 
  X, 
  RotateCcw, 
  Sparkles, 
  Sun, 
  Zap, 
  Eye, 
  Check, 
  ShieldCheck, 
  Activity,
  Layers
} from 'lucide-react';
import { useGlowSettings, GlowColorTheme, GlowPulseSpeed } from './GlowSettingsContext';

interface GlowSettingsPanelProps {
  className?: string;
}

export const GlowSettingsPanel: React.FC<GlowSettingsPanelProps> = ({ className = '' }) => {
  const { 
    settings, 
    updateSettings, 
    resetSettings, 
    isPanelOpen, 
    setIsPanelOpen,
    getPrimaryGlowColor,
    getSecondaryGlowColor,
    getGlowOpacity
  } = useGlowSettings();

  if (!isPanelOpen) return null;

  const primaryColor = getPrimaryGlowColor();
  const secondaryColor = getSecondaryGlowColor();
  const glowOpacity = getGlowOpacity();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className={`bg-[#1A1115] text-[#FAF6EE] border border-[#C5A059]/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Glow Bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
            boxShadow: settings.enabled ? `0 0 12px ${primaryColor}` : 'none'
          }}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#3D2631] pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: '#2A1820',
                borderColor: settings.enabled ? primaryColor : '#523E48',
                boxShadow: settings.enabled ? `0 0 10px ${primaryColor}40` : 'none'
              }}
            >
              <Sliders className="w-5 h-5" style={{ color: settings.enabled ? primaryColor : '#A08F83' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#FAF6EE]">
                  Karten Glow- & Puls-Einstellungen
                </h3>
                <Sparkles className="w-4 h-4 text-[#E5C170]" />
              </div>
              <p className="text-xs text-[#B5A593]">
                Anpassung der visuellen Aura für Europakarte, Diplomatie-Pfade & BESA-Netze
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPanelOpen(false)}
            className="p-2 text-[#B5A593] hover:text-white hover:bg-[#2A1820] rounded-xl transition-colors cursor-pointer"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="bg-[#120B0E] p-4 rounded-xl border border-[#3D2631] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#E5C170] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Echtzeit-Vorschau der Aura</span>
            </span>
            <span className="text-[10px] text-[#B5A593] font-mono">
              {settings.enabled ? `${settings.intensity}% Intensität` : 'Inaktiv'}
            </span>
          </div>

          <div className="h-20 bg-[#1F1318] rounded-lg border border-[#3A242E] relative flex items-center justify-center overflow-hidden">
            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#E5C170 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />

            {/* Glowing Sample Line / Node */}
            <div className="relative flex items-center gap-6">
              {/* Node A */}
              <div className="relative">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 ${
                    settings.enabled && settings.pulseSpeed !== 'off' ? 'animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: settings.enabled ? `0 0 ${settings.blurRadius * 2}px ${primaryColor}` : 'none'
                  }}
                >
                  A
                </div>
              </div>

              {/* Connecting Glow Line */}
              <div 
                className="w-28 h-1 rounded-full transition-all duration-300"
                style={{
                  background: settings.enabled 
                    ? `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
                    : '#4A3B43',
                  boxShadow: settings.enabled 
                    ? `0 0 ${settings.blurRadius * 1.5}px ${primaryColor}` 
                    : 'none',
                  opacity: settings.enabled ? Math.min(1, glowOpacity + 0.3) : 0.4
                }}
              />

              {/* Node B */}
              <div className="relative">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 ${
                    settings.enabled && settings.pulseSpeed !== 'off' ? 'animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: secondaryColor,
                    boxShadow: settings.enabled ? `0 0 ${settings.blurRadius * 2}px ${secondaryColor}` : 'none'
                  }}
                >
                  B
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Settings Form Controls */}
        <div className="space-y-5 text-xs">
          {/* 1. Toggle Glow Enabled */}
          <div className="flex items-center justify-between p-3 bg-[#24151B] rounded-xl border border-[#3D2631]">
            <div className="space-y-0.5">
              <span className="font-bold text-[#FAF6EE] block">Glow- & Aura-Effekte aktivieren</span>
              <span className="text-[11px] text-[#B5A593]">Schaltet die Leuchtpunkte und Bündnis-Auren an oder aus</span>
            </div>
            <button
              onClick={() => updateSettings({ enabled: !settings.enabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.enabled ? 'bg-[#10B981]' : 'bg-[#4A3B43]'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Color Theme Selection */}
          <div className="space-y-2">
            <label className="font-bold text-[#E5C170] uppercase tracking-wider text-[10px] block">
              Farb-Puls Theme (Paletten-Aura)
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { 
                  id: 'gold_emerald', 
                  label: 'Dual (Gold & Smaragd)', 
                  desc: 'Königliches Gold & BESA-Trust',
                  grad: 'from-[#E5C170] to-[#10B981]' 
                },
                { 
                  id: 'gold', 
                  label: 'Königliches Gold', 
                  desc: 'Aurum & Kaiserliches Bernstein',
                  grad: 'from-[#E5C170] to-[#F59E0B]' 
                },
                { 
                  id: 'emerald', 
                  label: 'BESA Smaragd', 
                  desc: 'Akkreditierungs-Grün',
                  grad: 'from-[#10B981] to-[#059669]' 
                },
                { 
                  id: 'ruby', 
                  label: 'Kaiserliches Rubin', 
                  desc: 'Burgund & Diplomatieschutz',
                  grad: 'from-[#F43F5E] to-[#8B1E2F]' 
                }
              ].map((theme) => {
                const isSelected = settings.colorTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updateSettings({ colorTheme: theme.id as GlowColorTheme })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      isSelected 
                        ? 'bg-[#2A1820] border-[#E5C170] ring-1 ring-[#E5C170]/50 shadow-md' 
                        : 'bg-[#1F1318] border-[#3D2631] hover:border-[#6C4A5A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-6 h-3 rounded-full bg-gradient-to-r ${theme.grad}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#E5C170]" />}
                    </div>
                    <div>
                      <div className="font-bold text-[#FAF6EE] text-xs">{theme.label}</div>
                      <div className="text-[10px] text-[#A08F83]">{theme.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Glow Intensity Slider */}
          <div className="space-y-2 bg-[#24151B] p-3.5 rounded-xl border border-[#3D2631]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#FAF6EE] flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#E5C170]" />
                <span>Glow-Intensität</span>
              </label>
              <span className="font-mono font-bold text-[#E5C170] text-xs">
                {settings.intensity}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={settings.intensity}
              disabled={!settings.enabled}
              onChange={(e) => updateSettings({ intensity: Number(e.target.value) })}
              className="w-full h-2 bg-[#3A242E] rounded-lg appearance-none cursor-pointer accent-[#E5C170] disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[#A08F83]">
              <span>Dezent (20%)</span>
              <span>Standard (100%)</span>
              <span>Strahlend (200%)</span>
            </div>
          </div>

          {/* 4. Pulse Speed Selector */}
          <div className="space-y-2">
            <label className="font-bold text-[#E5C170] uppercase tracking-wider text-[10px] block">
              Pulsations-Geschwindigkeit
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'slow', label: '🐢 Langsam' },
                { id: 'normal', label: '⚖️ Standard' },
                { id: 'fast', label: '⚡ Dynamisch' },
                { id: 'off', label: '🛑 Statisch' }
              ].map((speed) => {
                const isSelected = settings.pulseSpeed === speed.id;
                return (
                  <button
                    key={speed.id}
                    onClick={() => updateSettings({ pulseSpeed: speed.id as GlowPulseSpeed })}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#E5C170] text-[#1A1115] shadow-sm font-bold'
                        : 'bg-[#24151B] text-[#B5A593] hover:bg-[#331D26]'
                    }`}
                  >
                    {speed.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Blur Radius Slider */}
          <div className="space-y-2 bg-[#24151B] p-3.5 rounded-xl border border-[#3D2631]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#FAF6EE] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#10B981]" />
                <span>Unschärfe / Weichzeichnung (Radius)</span>
              </label>
              <span className="font-mono font-bold text-[#10B981] text-xs">
                {settings.blurRadius} px
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={settings.blurRadius}
              disabled={!settings.enabled}
              onChange={(e) => updateSettings({ blurRadius: Number(e.target.value) })}
              className="w-full h-2 bg-[#3A242E] rounded-lg appearance-none cursor-pointer accent-[#10B981] disabled:opacity-40"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-[#3D2631] pt-4 text-xs">
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-[#B5A593] hover:text-[#FAF6EE] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Werkseinstellung</span>
          </button>

          <button
            onClick={() => setIsPanelOpen(false)}
            className="py-2.5 px-5 bg-[#E5C170] hover:bg-[#F2D48C] text-[#1A1115] rounded-xl font-bold transition-all shadow-md cursor-pointer"
          >
            Übernehmen & Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
