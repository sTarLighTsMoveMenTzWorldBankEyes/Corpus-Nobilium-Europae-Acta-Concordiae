import React, { useState } from 'react';
import { Shield, CheckCircle, Sparkles, Award, Lock, Key, ExternalLink, X, FileCheck, Layers, Music, Flame } from 'lucide-react';
import { House, DiplomaticStatus } from '../types';

interface BesaEidBadgeProps {
  house?: House;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  interactive?: boolean;
  className?: string;
  showTooltip?: boolean;
  variant?: 'seal' | 'ribbon' | 'avatar-only' | 'card-stamp';
}

export const BesaEidBadge: React.FC<BesaEidBadgeProps> = ({
  house,
  size = 'sm',
  interactive = true,
  className = '',
  showTooltip = true,
  variant = 'card-stamp'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Generate deterministic certificate hash based on house ID / name
  const certId = house 
    ? `BESA-EID-2026-${house.country?.slice(0, 3).toUpperCase() || 'EUR'}-${String(house.id || '360').padStart(4, '0')}`
    : 'BESA-EID-2026-TRUST-SEAL';
  
  const trustHash = house
    ? `0x${Array.from(String(house.name) + String(house.email || 'besa')).reduce((acc: number, char: string) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0).toString(16).toUpperCase().padStart(8, '0')}`
    : '0x7F8B2C4E';

  const handleClick = (e: React.MouseEvent) => {
    if (interactive) {
      e.stopPropagation();
      setIsModalOpen(true);
    }
  };

  // SVGs for the stylized Squirrel, Golden Egg, Treasure Chest, Horn & Tree-Map Construction Loop
  const renderSealSvg = (dim: number = 64) => (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="35%" stopColor="#E5C170" />
          <stop offset="70%" stopColor="#B38728" />
          <stop offset="100%" stopColor="#FBF5B7" />
        </linearGradient>

        <linearGradient id="crimsonBesa" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A0E18" />
          <stop offset="50%" stopColor="#8B1E2F" />
          <stop offset="100%" stopColor="#2A060C" />
        </linearGradient>

        <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6E3A20" />
          <stop offset="50%" stopColor="#4A2311" />
          <stop offset="100%" stopColor="#2E1408" />
        </linearGradient>

        <linearGradient id="eggShine" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#FEE180" />
          <stop offset="70%" stopColor="#D99B26" />
          <stop offset="100%" stopColor="#875306" />
        </linearGradient>

        <linearGradient id="hornBrass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE599" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#996515" />
          <stop offset="100%" stopColor="#FFF2B2" />
        </linearGradient>

        <linearGradient id="treemapGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#E5C170" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
        </linearGradient>

        {/* Filter for glowing elements */}
        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Circular text path for seal inscription */}
        <path id="sealTextPath" d="M 100, 100 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
      </defs>

      {/* Outer Golden Ring with Gear / Petal Serrations */}
      <circle cx="100" cy="100" r="95" fill="#140A0E" stroke="url(#goldSheen)" strokeWidth="3" />
      <circle cx="100" cy="100" r="88" stroke="url(#goldSheen)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Decorative Outer Arc Dots (360 Peace nodes) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <circle
          key={i}
          cx={100 + 91 * Math.cos((angle * Math.PI) / 180)}
          cy={100 + 91 * Math.sin((angle * Math.PI) / 180)}
          r="1.8"
          fill="#E5C170"
        />
      ))}

      {/* Inner Crimson Seal Medallion */}
      <circle cx="100" cy="100" r="84" fill="url(#crimsonBesa)" stroke="url(#goldSheen)" strokeWidth="1.5" />

      {/* Circular Inscription: BESA eID ACCREDITATION • BREMER HARMONIE */}
      <text fill="#E5C170" fontSize="7.8" fontWeight="bold" letterSpacing="2.2" fontFamily="serif">
        <textPath href="#sealTextPath" startOffset="50%" textAnchor="middle">
          ★ BESA eID ACCREDITATION ★ ACTA CONCORDIAE ★
        </textPath>
      </text>

      {/* ============================================================ */}
      {/* 1. TREE-MAP CONSTRUCTION LOOP (Recursive Infinity Loop)     */}
      {/* Interlocking geometric treemap rectangles forming peace loop */}
      {/* ============================================================ */}
      <g opacity="0.45" stroke="url(#treemapGlow)" strokeWidth="1" fill="none">
        {/* Central recursive treemap partition loops */}
        <rect x="42" y="48" width="116" height="104" rx="12" strokeDasharray="4 2" />
        {/* Branch 1 */}
        <rect x="48" y="54" width="48" height="42" rx="4" fill="#E5C170" fillOpacity="0.05" />
        <rect x="52" y="58" width="20" height="34" rx="2" />
        <rect x="74" y="58" width="18" height="15" rx="2" />
        <rect x="74" y="75" width="18" height="17" rx="2" />
        {/* Branch 2 */}
        <rect x="100" y="54" width="52" height="42" rx="4" fill="#3B82F6" fillOpacity="0.05" />
        <rect x="104" y="58" width="22" height="34" rx="2" />
        <rect x="128" y="58" width="20" height="34" rx="2" />
        {/* Infinity loop curve connecting tree branches */}
        <path
          d="M 55 100 C 55 80, 85 80, 100 100 C 115 120, 145 120, 145 100 C 145 80, 115 80, 100 100 C 85 120, 55 120, 55 100 Z"
          stroke="url(#goldSheen)"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
      </g>

      {/* ============================================================ */}
      {/* 2. BREMER STADTMUSIKANTEN POSTHORN (Heraldic Brass Trumpet)   */}
      {/* Curved musical horn spiraling out from the side               */}
      {/* ============================================================ */}
      <g id="bremer-horn" filter="url(#glowEffect)">
        {/* Horn Coil Loop */}
        <path
          d="M 38 128 C 30 115, 32 95, 46 88 C 60 80, 78 86, 80 100 C 82 112, 70 125, 54 125 C 44 125, 36 118, 38 108"
          stroke="url(#hornBrass)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Horn Flared Bell */}
        <path
          d="M 35 126 C 26 130, 22 142, 25 150 C 27 154, 34 156, 38 152 C 43 148, 42 136, 40 128 Z"
          fill="url(#hornBrass)"
          stroke="#5C3B0D"
          strokeWidth="0.8"
        />
        {/* Sound Arcs / Harmony waves */}
        <path d="M 22 144 C 18 140, 16 132, 18 126" stroke="#FFE599" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <path d="M 18 150 C 12 142, 10 130, 14 120" stroke="#FFE599" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        
        {/* Bremer Stadtmusikanten Mini-Stacked Harmony Silhouette (Donkey, Dog, Cat, Rooster) */}
        <g transform="translate(136, 68) scale(0.65)" opacity="0.85">
          {/* Stack Tier 1: Rooster atop */}
          <path d="M 14 2 C 16 0, 18 2, 19 4 C 18 6, 15 7, 14 6 C 13 5, 12 3, 14 2 Z" fill="#FFE599" />
          {/* Stack Tier 2: Cat */}
          <ellipse cx="14" cy="11" rx="4" ry="3" fill="#E5C170" />
          {/* Stack Tier 3: Dog */}
          <ellipse cx="14" cy="19" rx="6" ry="4" fill="#D4AF37" />
          {/* Stack Tier 4: Base Donkey */}
          <path d="M 5 25 C 5 23, 23 23, 23 25 L 21 33 L 7 33 Z" fill="#B38728" />
          {/* Musical Harmony Stars */}
          <circle cx="8" cy="5" r="1" fill="#FFF2B2" />
          <circle cx="22" cy="8" r="1.2" fill="#FFF2B2" />
        </g>
      </g>

      {/* ============================================================ */}
      {/* 3. TREASURE CHEST (Die BESA-Schatztruhe mit Siegeln)         */}
      {/* ============================================================ */}
      <g id="treasure-chest" transform="translate(62, 118)">
        {/* Chest Base Body */}
        <rect x="0" y="16" width="76" height="38" rx="4" fill="url(#chestWood)" stroke="#1A0D06" strokeWidth="1.5" />
        
        {/* Glowing radiance from open lid */}
        <ellipse cx="38" cy="16" rx="30" ry="10" fill="#FFE599" fillOpacity="0.4" filter="url(#glowEffect)" />

        {/* Chest Golden Bands & Studs */}
        <rect x="8" y="16" width="7" height="38" fill="url(#goldSheen)" stroke="#5C3B0D" strokeWidth="0.5" />
        <rect x="61" y="16" width="7" height="38" fill="url(#goldSheen)" stroke="#5C3B0D" strokeWidth="0.5" />
        <rect x="0" y="32" width="76" height="4" fill="url(#goldSheen)" stroke="#5C3B0D" strokeWidth="0.5" />

        {/* Studs */}
        {[20, 28, 42, 50].map((y, i) => (
          <React.Fragment key={i}>
            <circle cx="11.5" cy={y} r="1.2" fill="#FFE599" stroke="#331A00" strokeWidth="0.4" />
            <circle cx="64.5" cy={y} r="1.2" fill="#FFE599" stroke="#331A00" strokeWidth="0.4" />
          </React.Fragment>
        ))}

        {/* Ornate Keyhole Escutcheon */}
        <circle cx="38" cy="34" r="5" fill="url(#goldSheen)" stroke="#3A2006" strokeWidth="0.8" />
        <path d="M 38 31 L 39 34 L 37 34 Z M 38 34 L 38 37" stroke="#1A0D06" strokeWidth="1.2" strokeLinecap="round" />

        {/* Arched Lid (Open at angle) */}
        <path
          d="M -2 16 C -2 6, 78 6, 78 16 C 78 19, -2 19, -2 16 Z"
          fill="url(#chestWood)"
          stroke="url(#goldSheen)"
          strokeWidth="1.5"
        />
        <path d="M 6 8 C 16 3, 60 3, 70 8" stroke="url(#goldSheen)" strokeWidth="2" fill="none" />
      </g>

      {/* ============================================================ */}
      {/* 4. GOLDEN PEACE EGG (Das Osterei der Eintracht & Frucht)    */}
      {/* ============================================================ */}
      <g id="pax-egg" transform="translate(108, 92)">
        {/* Egg glow aura */}
        <ellipse cx="20" cy="28" rx="18" ry="24" fill="#FFE180" fillOpacity="0.25" filter="url(#glowEffect)" />
        {/* Main Egg Path */}
        <path
          d="M 20 6 C 34 6, 40 24, 38 38 C 36 50, 4 50, 2 38 C 0 24, 6 6, 20 6 Z"
          fill="url(#eggShine)"
          stroke="#5A3A05"
          strokeWidth="1.2"
        />
        {/* Filigree Ornamental Bands on Egg */}
        <path
          d="M 8 26 C 14 30, 26 30, 32 26 M 6 34 C 14 39, 26 39, 34 34"
          stroke="#FFF7D6"
          strokeWidth="1"
          strokeDasharray="2 1.5"
          fill="none"
        />
        {/* Small Central Heraldic Star on Egg */}
        <circle cx="20" cy="28" r="3" fill="#FFF" />
        <path d="M 20 22 L 20 34 M 14 28 L 26 28" stroke="#875306" strokeWidth="0.8" />
      </g>

      {/* ============================================================ */}
      {/* 5. STYLIZED SQUIRREL AVATAR (Friedens-Eichhörnchen)        */}
      {/* ============================================================ */}
      <g id="squirrel-avatar" transform="translate(56, 60)">
        {/* Squirrel Bushy Tail (Grand curved plume with fur strokes) */}
        <path
          d="M 12 62 C -6 52, -14 30, -6 14 C 2 -2, 22 -6, 28 6 C 32 14, 28 26, 18 36 C 26 42, 28 54, 22 64 Z"
          fill="url(#goldSheen)"
          stroke="#4A2508"
          strokeWidth="1.4"
        />
        {/* Inner Tail Texture */}
        <path
          d="M 6 22 C 10 12, 18 8, 22 14 C 24 20, 20 30, 10 40"
          stroke="#FFF2B2"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Squirrel Body */}
        <ellipse cx="32" cy="52" rx="14" ry="18" fill="#C9732B" stroke="#4A2508" strokeWidth="1.2" />
        {/* Squirrel Chest & Belly (Cream white) */}
        <path
          d="M 32 40 C 39 44, 42 56, 38 66 C 30 67, 26 56, 28 44 Z"
          fill="#FFF6E0"
          stroke="#C9732B"
          strokeWidth="0.5"
        />

        {/* Squirrel Head */}
        <ellipse cx="40" cy="30" rx="12" ry="11" fill="#C9732B" stroke="#4A2508" strokeWidth="1.2" />
        {/* Cheek / Snout */}
        <ellipse cx="48" cy="33" rx="6" ry="5" fill="#FFF6E0" stroke="#4A2508" strokeWidth="0.8" />
        
        {/* Nose */}
        <circle cx="53" cy="32" r="1.8" fill="#241004" />
        
        {/* Cute Eye with Sparkle */}
        <circle cx="43" cy="27" r="2.8" fill="#1C0D05" />
        <circle cx="44" cy="26" r="1" fill="#FFFFFF" />

        {/* Tufted Ears (Pinselohren) */}
        <path
          d="M 33 22 C 32 12, 36 6, 37 4 C 38 8, 40 14, 38 21 Z"
          fill="#C9732B"
          stroke="#4A2508"
          strokeWidth="0.9"
        />
        {/* Ear tuft fur */}
        <path d="M 37 4 L 39 1 M 37 4 L 35 2" stroke="#241004" strokeWidth="1" strokeLinecap="round" />

        <path
          d="M 43 21 C 44 14, 48 8, 49 6 C 49 10, 50 15, 47 21 Z"
          fill="#C9732B"
          stroke="#4A2508"
          strokeWidth="0.9"
        />
        <path d="M 49 6 L 52 4" stroke="#241004" strokeWidth="1" strokeLinecap="round" />

        {/* Front Paws cradling / gesturing to egg */}
        <path
          d="M 42 46 C 48 46, 54 48, 56 52 C 54 55, 46 54, 40 50 Z"
          fill="#E5C170"
          stroke="#4A2508"
          strokeWidth="1"
        />
        {/* Claws / fingers */}
        <circle cx="56" cy="52" r="1" fill="#241004" />

        {/* Back Foot resting on chest */}
        <ellipse cx="28" cy="68" rx="8" ry="4" fill="#C9732B" stroke="#4A2508" strokeWidth="1" />
      </g>

      {/* ============================================================ */}
      {/* 6. CENTER BASE SHIELD: BESA 2026 CODE BADGE                 */}
      {/* ============================================================ */}
      <g transform="translate(68, 156)">
        <rect
          x="0"
          y="0"
          width="64"
          height="18"
          rx="5"
          fill="#1C0810"
          stroke="url(#goldSheen)"
          strokeWidth="1.2"
        />
        <text
          x="32"
          y="12.5"
          fill="#FAF6EE"
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          BESA-eID
        </text>
      </g>
    </svg>
  );

  // Dynamic sizes
  const getContainerSize = () => {
    switch (size) {
      case 'icon':
        return 'w-6 h-6';
      case 'sm':
        return 'w-10 h-10';
      case 'md':
        return 'w-16 h-16';
      case 'lg':
        return 'w-24 h-24 sm:w-28 sm:h-28';
      default:
        return 'w-10 h-10';
    }
  };

  return (
    <>
      {/* Stamp / Badge Trigger */}
      <div
        className={`relative inline-flex items-center group/besa ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {variant === 'card-stamp' ? (
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-[#1C0910] via-[#2A0E18] to-[#1C0910] border border-[#E5C170]/60 hover:border-[#E5C170] shadow-xs hover:shadow-[0_0_12px_rgba(229,193,112,0.35)] transition-all cursor-pointer text-left group-hover/besa:scale-[1.02] besa-ripple-effect"
            title="BESA eID Accreditation Seal öffnen (Albanischer Ehrenpakt & Swiss Trust eID)"
          >
            {/* SVG Seal Icon */}
            <div className="w-6 h-6 shrink-0 relative">
              {renderSealSvg(24)}
            </div>

            {/* Compact Seal Text */}
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1 text-[9.5px] font-bold text-[#E5C170] uppercase tracking-wider font-mono">
                <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                <span>BESA eID</span>
              </div>
              <span className="text-[8.5px] text-[#D8CCA9] font-serif tracking-tight truncate max-w-[85px]">
                {house?.country ? `${house.country} • Pakt` : 'Accredited'}
              </span>
            </div>
          </button>
        ) : variant === 'ribbon' ? (
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#200D15] border border-[#E5C170]/70 text-[#FAF6EE] shadow-sm hover:shadow-md hover:border-[#E5C170] transition-all cursor-pointer besa-ripple-effect"
          >
            <div className="w-5 h-5 shrink-0">
              {renderSealSvg(20)}
            </div>
            <div className="text-[11px] font-semibold text-[#E5C170] font-sans flex items-center gap-1.5">
              <span>BESA eID Akkreditierung</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                2026
              </span>
            </div>
          </button>
        ) : (
          /* Default standalone seal medallion */
          <div
            onClick={handleClick}
            className={`${getContainerSize()} cursor-pointer relative transition-transform hover:scale-105 active:scale-95 rounded-full besa-ripple-effect`}
          >
            {renderSealSvg()}
          </div>
        )}

        {/* Hover Tooltip if enabled */}
        {showTooltip && isHovered && variant !== 'card-stamp' && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none w-52 p-2.5 rounded-xl bg-[#140A0E] border border-[#E5C170]/80 shadow-xl text-left text-xs text-[#FAF6EE] animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[#E5C170] font-bold font-serif mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BESA eID Beglaubigung</span>
            </div>
            <p className="text-[10px] text-[#CBBFA6] leading-relaxed">
              Beglaubigter Friedens- und Souveränitätspakt mit Eichhörnchen-Wächtersiegel, Osterei & Schatztruhe der Stadtmusikanten-Harmonie.
            </p>
            <div className="mt-1.5 pt-1 border-t border-[#3D252E] flex items-center justify-between text-[9px] font-mono text-[#E5C170]">
              <span>Standard: BESA-EID-2026</span>
              <span className="text-emerald-400">Verifiziert</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE FULL ACCREDITATION CERTIFICATE MODAL             */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#12080D] border-2 border-[#E5C170] rounded-3xl shadow-[0_0_60px_rgba(229,193,112,0.3)] text-[#FAF6EE] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate Header Watermark & Gradient */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#2E0F1A] via-[#1A0A10] to-[#12080D] border-b border-[#E5C170]/40 text-center">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#200A12] text-[#E5C170] hover:bg-[#3B1422] border border-[#E5C170]/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Centered Seal Vector */}
              <div className="w-28 h-28 mx-auto mb-3 drop-shadow-[0_0_20px_rgba(229,193,112,0.4)]">
                {renderSealSvg(112)}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B1523] border border-[#E5C170]/50 text-[#E5C170] text-xs font-semibold uppercase tracking-widest mb-2">
                <span>Diplomatische Staats-eID Akkreditierung</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF6EE] tracking-tight">
                BESA eID Beglaubigungs-Urkunde
              </h2>

              <p className="text-xs sm:text-sm text-[#D8CCA9] max-w-lg mx-auto mt-1 font-serif italic">
                "BESA per Concordiam — Treuepakt, Friedensgarantie & Digitale Souveränität"
              </p>
            </div>

            {/* Certificate Content Body */}
            <div className="p-6 sm:p-8 space-y-6 text-xs text-[#E1D7C6]">
              {/* Target House Profile */}
              {house ? (
                <div className="p-4 rounded-2xl bg-[#1F0C14] border border-[#E5C170]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                      Beglaubigtes Haus / Dynastie:
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#FAF6EE]">
                      {house.name}
                    </h3>
                    <p className="text-xs text-[#B8AA98]">
                      📍 {house.seat || house.country} • {house.type} • Status: {house.status || 'Souverän'}
                    </p>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold shadow-xs">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>BESA VERIFIED</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#1F0C14] border border-[#E5C170]/30 text-center">
                  <p className="font-serif text-sm text-[#E5C170]">
                    Gesamteuropäischer Dachverband der 360 Souveränen Häuser & Stiftungen
                  </p>
                </div>
              )}

              {/* Three Pillars of Symbolism (Squirrel, Egg/Chest, Bremer Horn & Treemap) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Squirrel & Chest */}
                <div className="p-3.5 rounded-xl bg-[#180A10] border border-[#3D252E] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#E5C170] font-bold text-xs">
                    <span className="text-base">🐿️</span>
                    <span>Wächter & Schatz</span>
                  </div>
                  <p className="text-[11px] text-[#A89887] leading-relaxed">
                    Das Eichhörnchen mit Schatzkiste bewahrt die unantastbaren Friedensverträge im unveränderlichen Speicher.
                  </p>
                </div>

                {/* 2. Golden Egg */}
                <div className="p-3.5 rounded-xl bg-[#180A10] border border-[#3D252E] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#E5C170] font-bold text-xs">
                    <span className="text-base">🥚</span>
                    <span>Pax-Ei der Eintracht</span>
                  </div>
                  <p className="text-[11px] text-[#A89887] leading-relaxed">
                    Symbol für Keimung neuer diplomatischer Allianzen und interreligiöser Völkerversöhnung in Europa.
                  </p>
                </div>

                {/* 3. Bremer Horn & Treemap Loop */}
                <div className="p-3.5 rounded-xl bg-[#180A10] border border-[#3D252E] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#E5C170] font-bold text-xs">
                    <span className="text-base">📯</span>
                    <span>Stadtmusikanten-Harmonie</span>
                  </div>
                  <p className="text-[11px] text-[#A89887] leading-relaxed">
                    Das Rufhorn und die Treemap-Schleife verkünden harmonische Kooperation über dynastische Grenzen hinweg.
                  </p>
                </div>
              </div>

              {/* Cryptographic Ledger Verification Details */}
              <div className="p-4 rounded-2xl bg-[#0E0609] border border-[#C5A059]/40 space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#E5C170] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>eID-Register Authentifizierungs-Token:</span>
                  </span>
                  <span className="text-emerald-300">{certId}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#9E8E7D] pt-1 border-t border-[#2A141E]">
                  <div>
                    <span className="text-[#6E5E50]">Root Proof Hash: </span>
                    <span className="text-[#FAF6EE]">{trustHash}::BESA::SHA3</span>
                  </div>
                  <div>
                    <span className="text-[#6E5E50]">Sicherheitsstandard: </span>
                    <span className="text-[#FAF6EE]">Albanian BESA / Swiss Trust / eIDAS</span>
                  </div>
                  <div>
                    <span className="text-[#6E5E50]">Beglaubigungsdatum: </span>
                    <span className="text-[#FAF6EE]">24. März 2026 (Acta Concordiae)</span>
                  </div>
                  <div>
                    <span className="text-[#6E5E50]">Integritätsstatus: </span>
                    <span className="text-emerald-400 font-bold">Unveränderlich & Gültig</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 sm:p-6 bg-[#0B0407] border-t border-[#3D252E] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-[#8C7A6D]">
                Siegel-Inhaber unterliegen dem Ehrenkodex der BESA (Treue & Schutz der Würde).
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E5C170] hover:bg-[#F2D48C] text-[#140A0E] font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                Urkunde schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
