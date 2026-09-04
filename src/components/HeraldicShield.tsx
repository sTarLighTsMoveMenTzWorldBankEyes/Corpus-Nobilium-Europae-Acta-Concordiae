import React, { useMemo } from 'react';
import { DiplomaticStatus } from '../types';

interface HeraldicShieldProps {
  motif?: string;
  houseName: string;
  diplomaticStatus?: DiplomaticStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusBorder?: boolean;
  className?: string;
}

interface ParsedHeraldry {
  primaryColor: string;
  secondaryColor: string;
  chargeColor: string;
  partition: 'solid' | 'per_fess' | 'per_pale' | 'quarterly' | 'bend' | 'lozengy' | 'chevron' | 'fess' | 'border';
  chargeType: 'lion' | 'eagle' | 'double_eagle' | 'fleur_de_lis' | 'crown' | 'cross' | 'rose' | 'stag' | 'star' | 'tower' | 'rider' | 'bear' | 'swords' | 'keys' | 'griffin' | 'bull' | 'crescent' | 'wheel' | 'horn' | 'diamond' | 'shield';
  chargeCount: number;
}

// Heraldic Tinctures
const TINCTURES = {
  or: '#D4AF37',        // Gold / Yellow
  orBright: '#F3CE49',
  argent: '#F7F6F2',    // Silver / White
  argentDark: '#DDDCD7',
  gules: '#9B1B28',     // Red
  gulesBright: '#B82333',
  azure: '#1A487D',     // Blue
  azureBright: '#255FA3',
  sable: '#1F1B1D',     // Black
  vert: '#1E6838',      // Green
  vertBright: '#298047',
  purpure: '#5B1F4A',   // Purple
  amber: '#C97A1E'
};

export function parseMotifToHeraldry(motif?: string, houseName: string = ''): ParsedHeraldry {
  const text = (motif || '').toLowerCase();
  const name = houseName.toLowerCase();

  // 1. Detect Colors
  let primaryColor = TINCTURES.gules;
  let secondaryColor = TINCTURES.or;
  let chargeColor = TINCTURES.or;

  const hasGold = text.includes('gold') || text.includes('gelb');
  const hasSilver = text.includes('silber') || text.includes('weiß') || text.includes('weiss');
  const hasBlack = text.includes('schwarz');
  const hasRed = text.includes('rot');
  const hasBlue = text.includes('blau') || text.includes('azur');
  const hasGreen = text.includes('grün') || text.includes('gruen');

  // Color assignments based on heraldic rules & motif description
  if (hasBlack && hasSilver) {
    primaryColor = TINCTURES.sable;
    secondaryColor = TINCTURES.argent;
    chargeColor = hasGold ? TINCTURES.or : TINCTURES.argent;
  } else if (hasBlue && hasSilver) {
    primaryColor = TINCTURES.azure;
    secondaryColor = TINCTURES.argent;
    chargeColor = hasGold ? TINCTURES.or : TINCTURES.argent;
  } else if (hasRed && hasGold) {
    primaryColor = TINCTURES.gules;
    secondaryColor = TINCTURES.or;
    chargeColor = TINCTURES.or;
  } else if (hasBlue && hasGold) {
    primaryColor = TINCTURES.azure;
    secondaryColor = TINCTURES.or;
    chargeColor = TINCTURES.or;
  } else if (hasRed && hasSilver) {
    primaryColor = TINCTURES.gules;
    secondaryColor = TINCTURES.argent;
    chargeColor = hasGold ? TINCTURES.or : TINCTURES.argent;
  } else if (hasGreen) {
    primaryColor = TINCTURES.vert;
    secondaryColor = hasSilver ? TINCTURES.argent : TINCTURES.or;
    chargeColor = hasSilver ? TINCTURES.argent : TINCTURES.or;
  } else if (hasBlack && hasGold) {
    primaryColor = TINCTURES.sable;
    secondaryColor = TINCTURES.or;
    chargeColor = TINCTURES.or;
  } else if (hasGold) {
    primaryColor = TINCTURES.or;
    secondaryColor = hasRed ? TINCTURES.gules : TINCTURES.sable;
    chargeColor = TINCTURES.sable;
  }

  // 2. Detect Partition
  let partition: ParsedHeraldry['partition'] = 'solid';

  if (text.includes('geviertelt') || text.includes('viergeteilt') || text.includes('vierung')) {
    partition = 'quarterly';
  } else if (text.includes('wecken') || text.includes('rauten')) {
    partition = 'lozengy';
  } else if (text.includes('gespalten')) {
    partition = 'per_pale';
  } else if (text.includes('schrägbalken') || text.includes('schraeg')) {
    partition = 'bend';
  } else if (text.includes('sparren')) {
    partition = 'chevron';
  } else if (text.includes('balken') || text.includes('bindenschild') || text.includes('fess')) {
    partition = 'fess';
  } else if (text.includes('geteilt')) {
    partition = 'per_fess';
  } else if (text.includes('bord') || text.includes('rand')) {
    partition = 'border';
  }

  // 3. Detect Heraldic Charge
  let chargeType: ParsedHeraldry['chargeType'] = 'lion';
  let chargeCount = 1;

  if (text.includes('doppeladler') || text.includes('reichsadler')) {
    chargeType = 'double_eagle';
  } else if (text.includes('adler') || text.includes('falke')) {
    chargeType = 'eagle';
  } else if (text.includes('löwe') || text.includes('leopard') || text.includes('loewe')) {
    chargeType = 'lion';
  } else if (text.includes('lilie')) {
    chargeType = 'fleur_de_lis';
    chargeCount = text.includes('drei') ? 3 : text.includes('zwei') ? 2 : 1;
  } else if (text.includes('krone') || text.includes('gekrönt')) {
    chargeType = 'crown';
    chargeCount = text.includes('drei') ? 3 : 1;
  } else if (text.includes('kreuz') || text.includes('trizub')) {
    chargeType = 'cross';
  } else if (text.includes('rose') || text.includes('seeblatt')) {
    chargeType = 'rose';
  } else if (text.includes('hirsch') || text.includes('geweih') || text.includes('stange') || text.includes('elch') || text.includes('reh')) {
    chargeType = 'stag';
  } else if (text.includes('stern') || text.includes('strahl')) {
    chargeType = 'star';
    chargeCount = text.includes('drei') ? 3 : 1;
  } else if (text.includes('turm') || text.includes('kastell') || text.includes('mauer') || text.includes('tor')) {
    chargeType = 'tower';
  } else if (text.includes('reiter') || text.includes('pogoń') || text.includes('ritter') || text.includes('tatarenreiter')) {
    chargeType = 'rider';
  } else if (text.includes('bär') || text.includes('dachs')) {
    chargeType = 'bear';
  } else if (text.includes('schwert') || text.includes('lanze') || text.includes('degen') || text.includes('pfeil')) {
    chargeType = 'swords';
  } else if (text.includes('schlüssel')) {
    chargeType = 'keys';
  } else if (text.includes('greif')) {
    chargeType = 'griffin';
  } else if (text.includes('stier') || text.includes('ochse') || text.includes('büffel')) {
    chargeType = 'bull';
  } else if (text.includes('halbmond') || text.includes('mond')) {
    chargeType = 'crescent';
  } else if (text.includes('rad') || text.includes('wagenrad')) {
    chargeType = 'wheel';
  } else if (text.includes('horn') || text.includes('jagdhorn') || text.includes('hifthorn')) {
    chargeType = 'horn';
  } else {
    // Fallbacks based on famous houses or generic dignity
    if (name.includes('habsburg')) {
      chargeType = 'double_eagle';
      primaryColor = TINCTURES.gules;
      secondaryColor = TINCTURES.argent;
      partition = 'fess';
    } else if (name.includes('hohenzollern')) {
      chargeType = 'shield';
      partition = 'quarterly';
      primaryColor = TINCTURES.sable;
      secondaryColor = TINCTURES.argent;
    } else if (name.includes('bourbon') || name.includes('frankreich')) {
      chargeType = 'fleur_de_lis';
      chargeCount = 3;
      primaryColor = TINCTURES.azure;
      chargeColor = TINCTURES.or;
    } else if (name.includes('wittelsbach') || name.includes('bayern')) {
      chargeType = 'shield';
      partition = 'lozengy';
      primaryColor = TINCTURES.argent;
      secondaryColor = TINCTURES.azure;
    } else {
      // Deterministic variety for rich visual tapestry
      const charSum = (name + (motif || '')).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const charges: ParsedHeraldry['chargeType'][] = [
        'lion', 'eagle', 'crown', 'fleur_de_lis', 'cross', 'rose', 'star', 'tower', 'griffin', 'stag'
      ];
      chargeType = charges[charSum % charges.length];
    }
  }

  // Ensure charge color contrasts with primary color
  if (primaryColor === chargeColor) {
    chargeColor = (primaryColor === TINCTURES.or || primaryColor === TINCTURES.argent) 
      ? TINCTURES.sable 
      : TINCTURES.or;
  }

  return {
    primaryColor,
    secondaryColor,
    chargeColor,
    partition,
    chargeType,
    chargeCount
  };
}

export const HeraldicShield: React.FC<HeraldicShieldProps> = ({
  motif,
  houseName,
  diplomaticStatus,
  size = 'md',
  showStatusBorder = false,
  className = ''
}) => {
  const heraldry = useMemo(() => parseMotifToHeraldry(motif, houseName), [motif, houseName]);

  const sizeDimensions = {
    sm: { w: 40, h: 48, stroke: 1.5 },
    md: { w: 68, h: 80, stroke: 2 },
    lg: { w: 100, h: 120, stroke: 2.5 },
    xl: { w: 140, h: 168, stroke: 3 }
  }[size];

  // Diplomatic status color ring
  const statusBorderColor = diplomaticStatus === 'Active' 
    ? '#10B981' // emerald
    : diplomaticStatus === 'Consulting' 
    ? '#F59E0B' // amber
    : '#94A3B8'; // slate

  const uid = useMemo(() => `shield-${houseName.replace(/[^a-zA-Z0-9]/g, '')}-${size}`, [houseName, size]);

  // Classic European Heater / French Escutcheon Curve:
  // Starts top-left (6, 6) -> straight to (94, 6) -> downward sides -> sweeps into pointed base at (50, 94)
  const shieldPath = "M 8,8 L 92,8 C 92,8 92,48 85,64 C 77,80 50,96 50,96 C 50,96 23,80 15,64 C 8,48 8,8 8,8 Z";

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 104"
        width={sizeDimensions.w}
        height={sizeDimensions.h}
        className="overflow-visible drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Shield Clipping Mask */}
          <clipPath id={`${uid}-clip`}>
            <path d={shieldPath} />
          </clipPath>

          {/* Realistic Tincture Gradient for Field Depth */}
          <linearGradient id={`${uid}-metal-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          {/* Heraldic Gold Rim Gradient */}
          <linearGradient id={`${uid}-rim-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E4A8" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#997819" />
            <stop offset="100%" stopColor="#664F0C" />
          </linearGradient>

          {/* Lozengy Pattern for Bavaria / Diamonds */}
          <pattern id={`${uid}-lozengy`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <rect width="16" height="16" fill={heraldry.primaryColor} />
            <polygon points="0,8 8,0 16,8 8,16" fill={heraldry.secondaryColor} />
          </pattern>
        </defs>

        {/* Outer Halo or Diplomatic Status Ring */}
        {showStatusBorder && (
          <path
            d={shieldPath}
            fill="none"
            stroke={statusBorderColor}
            strokeWidth="6"
            strokeLinejoin="round"
            className="opacity-75 filter blur-[1px]"
          />
        )}

        {/* Shield Content Group clipped inside Escutcheon */}
        <g clipPath={`url(#${uid}-clip)`}>
          {/* Base Background Field */}
          <rect x="0" y="0" width="100" height="100" fill={heraldry.primaryColor} />

          {/* Heraldic Partitions */}
          {heraldry.partition === 'per_fess' && (
            <rect x="0" y="44" width="100" height="60" fill={heraldry.secondaryColor} />
          )}

          {heraldry.partition === 'per_pale' && (
            <rect x="50" y="0" width="50" height="100" fill={heraldry.secondaryColor} />
          )}

          {heraldry.partition === 'quarterly' && (
            <>
              <rect x="50" y="0" width="50" height="46" fill={heraldry.secondaryColor} />
              <rect x="0" y="46" width="50" height="60" fill={heraldry.secondaryColor} />
            </>
          )}

          {heraldry.partition === 'fess' && (
            <rect x="0" y="32" width="100" height="28" fill={heraldry.secondaryColor} />
          )}

          {heraldry.partition === 'bend' && (
            <polygon points="0,0 26,0 100,74 100,100 74,100 0,26" fill={heraldry.secondaryColor} />
          )}

          {heraldry.partition === 'chevron' && (
            <polygon points="50,14 100,58 100,80 50,36 0,80 0,58" fill={heraldry.secondaryColor} />
          )}

          {heraldry.partition === 'lozengy' && (
            <rect x="0" y="0" width="100" height="100" fill={`url(#${uid}-lozengy)`} />
          )}

          {heraldry.partition === 'border' && (
            <rect x="0" y="0" width="100" height="100" fill="none" stroke={heraldry.secondaryColor} strokeWidth="18" />
          )}

          {/* Heraldic Charge Icon / Figure */}
          <g transform="translate(50, 48)" fill={heraldry.chargeColor}>
            <RenderCharge chargeType={heraldry.chargeType} count={heraldry.chargeCount} color={heraldry.chargeColor} />
          </g>

          {/* Metallic Sheen Overlay */}
          <rect x="0" y="0" width="100" height="100" fill={`url(#${uid}-metal-grad)`} pointerEvents="none" />
          
          {/* Subtle 3D Center Spine / Crease */}
          <path d="M 50,8 L 50,96" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" pointerEvents="none" />
        </g>

        {/* Outer Escutcheon Shield Rim */}
        <path
          d={shieldPath}
          fill="none"
          stroke={`url(#${uid}-rim-gold)`}
          strokeWidth={sizeDimensions.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Delicate inner rim hairline */}
        <path
          d="M 12,12 L 88,12 C 88,12 88,48 82,62 C 75,76 50,90 50,90 C 50,90 25,76 18,62 C 12,48 12,12 12,12 Z"
          fill="none"
          stroke="#FAF0D7"
          strokeWidth="0.75"
          opacity="0.45"
        />
      </svg>
    </div>
  );
};

// Charge renderer with recognizable heraldic vector silhouettes
function RenderCharge({ chargeType, count, color }: { chargeType: string; count: number; color: string }) {
  if (count === 3) {
    return (
      <g transform="scale(0.55)">
        <g transform="translate(-24, -20)">
          <SingleCharge chargeType={chargeType} />
        </g>
        <g transform="translate(24, -20)">
          <SingleCharge chargeType={chargeType} />
        </g>
        <g transform="translate(0, 18)">
          <SingleCharge chargeType={chargeType} />
        </g>
      </g>
    );
  }

  if (count === 2) {
    return (
      <g transform="scale(0.65)">
        <g transform="translate(0, -16)">
          <SingleCharge chargeType={chargeType} />
        </g>
        <g transform="translate(0, 16)">
          <SingleCharge chargeType={chargeType} />
        </g>
      </g>
    );
  }

  return (
    <g transform="scale(0.85)">
      <SingleCharge chargeType={chargeType} />
    </g>
  );
}

function SingleCharge({ chargeType }: { chargeType: string }) {
  switch (chargeType) {
    case 'double_eagle':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Double-Headed Imperial Eagle silhouette */}
          <path d="M50 8 C44 4 36 6 32 12 C28 6 20 4 14 8 C8 12 6 20 10 26 C12 24 16 22 20 23 C16 28 8 36 2 48 C0 54 4 60 12 56 C18 52 24 44 28 40 C26 50 26 62 30 70 C24 74 16 80 18 88 C24 90 32 86 36 78 C38 86 44 94 50 94 C56 94 62 86 64 78 C68 86 76 90 82 88 C84 80 76 74 70 70 C74 62 74 50 72 40 C76 44 82 52 88 56 C96 60 100 54 98 48 C92 36 84 28 80 23 C84 22 88 24 90 26 C94 20 92 12 86 8 C80 4 72 6 68 12 C64 6 56 4 50 8 Z" />
          <circle cx="26" cy="16" r="3" fill="#FFFFFF" opacity="0.8" />
          <circle cx="74" cy="16" r="3" fill="#FFFFFF" opacity="0.8" />
        </g>
      );

    case 'eagle':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Imperial Eagle silhouette */}
          <path d="M50 8 C42 8 38 16 42 24 C34 26 22 34 10 46 C4 52 8 60 18 56 C24 54 30 46 36 42 C34 52 34 64 38 72 C32 76 22 84 26 90 C32 92 40 86 44 78 C46 84 48 90 50 90 C52 90 54 84 56 78 C60 86 68 92 74 90 C78 84 68 76 62 72 C66 64 66 52 64 42 C70 46 76 54 82 56 C92 60 96 52 90 46 C78 34 66 26 58 24 C62 16 58 8 50 8 Z" />
        </g>
      );

    case 'lion':
      return (
        <g transform="translate(-15, -18) scale(0.3)">
          {/* Heraldic Rampant Lion silhouette */}
          <path d="M48 6 C56 6 62 12 60 18 C64 16 70 18 72 24 C72 30 66 34 60 34 C58 38 58 44 64 48 C72 50 82 46 86 40 C88 42 86 48 80 54 C74 60 66 60 62 66 C66 74 76 78 84 76 C86 80 80 84 74 86 C64 88 56 80 52 74 C48 82 48 90 54 94 C46 96 40 88 38 78 C36 68 40 56 36 50 C30 48 20 54 16 62 C14 58 18 50 24 44 C30 38 34 32 32 26 C30 20 36 14 42 12 C44 8 46 6 48 6 Z" />
          <path d="M72 16 C84 6 92 14 90 28 C88 36 80 34 78 30 C82 24 80 18 72 16 Z" />
        </g>
      );

    case 'fleur_de_lis':
      return (
        <g transform="translate(-16, -18) scale(0.32)">
          {/* French Royal Fleur-de-lis */}
          <path d="M50 4 C46 16 38 28 32 38 C36 40 44 40 46 36 C48 44 48 56 46 68 L54 68 C52 56 52 44 54 36 C56 40 64 40 68 38 C62 28 54 16 50 4 Z" />
          <path d="M26 34 C12 36 4 48 8 62 C16 64 26 56 32 46 C30 42 28 38 26 34 Z" />
          <path d="M74 34 C88 36 96 48 92 62 C84 64 74 56 68 46 C70 42 72 38 74 34 Z" />
          <rect x="22" y="68" width="56" height="8" rx="3" />
          <path d="M34 78 C38 88 44 94 50 96 C56 94 62 88 66 78 Z" />
        </g>
      );

    case 'crown':
      return (
        <g transform="translate(-17, -13) scale(0.34)">
          {/* Crown */}
          <path d="M10 70 L90 70 L84 26 L62 44 L50 14 L38 44 L16 26 Z" />
          <rect x="8" y="72" width="84" height="12" rx="2" />
          <circle cx="16" cy="24" r="4" fill="#FFFFFF" />
          <circle cx="50" cy="12" r="4" fill="#FFFFFF" />
          <circle cx="84" cy="24" r="4" fill="#FFFFFF" />
        </g>
      );

    case 'cross':
      return (
        <g transform="translate(-15, -17) scale(0.32)">
          {/* Cross Pattee */}
          <path d="M42 6 L58 6 L54 38 L86 34 L86 50 L54 46 L58 86 L42 86 L46 46 L14 50 L14 34 L46 38 Z" />
        </g>
      );

    case 'rose':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Tudor / Heraldic Rose */}
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="22" fill="#FFFFFF" opacity="0.4" />
          <circle cx="50" cy="50" r="10" fill="#D4AF37" />
        </g>
      );

    case 'stag':
      return (
        <g transform="translate(-17, -17) scale(0.34)">
          {/* Stag Antlers */}
          <path d="M50 78 C44 60 30 44 14 34 C12 38 18 46 26 50 C18 42 10 32 6 20 C12 24 20 32 28 36 C24 26 22 14 24 6 C28 14 32 26 38 34 C44 44 48 58 50 78 Z" />
          <path d="M50 78 C56 60 70 44 86 34 C88 38 82 46 74 50 C82 42 90 32 94 20 C88 24 80 32 72 36 C76 26 78 14 76 6 C72 14 68 26 62 34 C56 44 52 58 50 78 Z" />
        </g>
      );

    case 'star':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* 8-pointed star */}
          <polygon points="50,6 60,36 90,26 70,50 94,64 64,68 66,96 50,74 34,96 36,68 6,64 30,50 10,26 40,36" />
        </g>
      );

    case 'tower':
      return (
        <g transform="translate(-16, -17) scale(0.32)">
          {/* Fortress Castle Tower */}
          <path d="M22 20 L22 34 L32 34 L32 20 L42 20 L42 34 L58 34 L58 20 L68 20 L68 34 L78 34 L78 20 L84 20 L80 84 L20 84 L16 20 Z" />
          <rect x="42" y="60" width="16" height="24" rx="8" fill="#1F1B1D" />
          <rect x="36" y="44" width="8" height="12" rx="2" fill="#1F1B1D" />
          <rect x="56" y="44" width="8" height="12" rx="2" fill="#1F1B1D" />
        </g>
      );

    case 'rider':
      return (
        <g transform="translate(-17, -17) scale(0.34)">
          {/* Galloping Knight / Pogon */}
          <path d="M20 70 C30 50 45 42 65 42 C75 42 85 50 90 60 C80 62 70 56 60 62 C50 68 40 76 30 84 Z" />
          <path d="M48 24 L60 24 L56 44 L44 44 Z" />
          <circle cx="52" cy="18" r="8" />
          <path d="M56 20 L80 12" stroke="#FFFFFF" strokeWidth="4" />
        </g>
      );

    case 'bear':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Walking / Rampant Bear */}
          <circle cx="50" cy="50" r="28" />
          <circle cx="34" cy="30" r="10" />
          <circle cx="66" cy="30" r="10" />
          <circle cx="50" cy="56" r="14" fill="#FFFFFF" opacity="0.4" />
        </g>
      );

    case 'swords':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Crossed Swords */}
          <path d="M12 12 L88 88 M80 88 L88 80 M24 16 L16 24 M12 88 L88 12 M88 20 L80 12 M16 80 L24 88" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        </g>
      );

    case 'keys':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Crossed Papal Keys */}
          <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="7" />
          <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
          <circle cx="80" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
        </g>
      );

    case 'bull':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Bull head with horns */}
          <path d="M30 20 C18 10 12 4 8 0 C16 10 24 24 32 30 C38 28 44 26 50 26 C56 26 62 28 68 30 C76 24 84 10 92 0 C88 4 82 10 70 20 C76 26 80 34 80 44 C80 62 66 78 50 78 C34 78 20 62 20 44 C20 34 24 26 30 20 Z" />
        </g>
      );

    case 'crescent':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Heraldic Crescent */}
          <path d="M50 14 C70 14 86 30 86 50 C86 70 70 86 50 86 C64 80 74 66 74 50 C74 34 64 20 50 14 Z" />
          <polygon points="34,44 42,44 44,36 46,44 54,44 48,49 50,57 44,52 38,57 40,49" />
        </g>
      );

    case 'wheel':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Spoked Wheel (Osnabrück / Mainz wheel) */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="7" />
          <circle cx="50" cy="50" r="10" />
          <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="6" />
          <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="6" />
          <line x1="23" y1="23" x2="77" y2="77" stroke="currentColor" strokeWidth="6" />
          <line x1="23" y1="77" x2="77" y2="23" stroke="currentColor" strokeWidth="6" />
        </g>
      );

    case 'horn':
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Heraldic Bugle Horn */}
          <path d="M16 64 C26 30 74 30 84 64 C76 60 70 56 64 58 C50 38 34 50 28 62 Z" />
        </g>
      );

    default:
      return (
        <g transform="translate(-16, -16) scale(0.32)">
          {/* Default Dignified Inescutcheon / Shield */}
          <path d="M50 16 L76 22 C76 44 70 64 50 78 C30 64 24 44 24 22 Z" />
        </g>
      );
  }
}
