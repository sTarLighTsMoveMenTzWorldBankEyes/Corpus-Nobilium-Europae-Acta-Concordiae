import { allHouses } from '../../data';

export type MapViewMode = 'standard' | 'density' | 'diplomatic_reach';

export interface CountryMeta {
  code: string;
  name: string;
  germanName: string;
  flag: string;
  housesCount: number;
  notableHouses: string[];
  region: string;
  rank: number;
  percentOfTotal: number;
  densityLevel: 'epizentrum' | 'high' | 'medium' | 'moderate' | 'low' | 'none';
  densityLabel: string;
}

export interface DensityTier {
  id: string;
  min: number;
  max: number;
  label: string;
  color: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export interface DiploConnection {
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  weight: number; // 1 to 5
  label: string;
}

export const DIPLO_CONNECTIONS: DiploConnection[] = [
  { from: 'Deutschland', to: 'Frankreich', fromCoords: [350, 415], toCoords: [258, 489], weight: 5, label: 'Deutsch-Französischer Friedenspakt' },
  { from: 'Deutschland', to: 'Österreich', fromCoords: [350, 415], toCoords: [394, 473], weight: 5, label: 'Mitteleuropäische Adelskonkordie' },
  { from: 'Deutschland', to: 'Polen', fromCoords: [350, 415], toCoords: [445, 391], weight: 4, label: 'Ostseeraum-Friedenskorridor' },
  { from: 'Frankreich', to: 'Italien', fromCoords: [258, 489], toCoords: [372, 545], weight: 4, label: 'Romanische Allianz' },
  { from: 'Großbritannien', to: 'Frankreich', fromCoords: [217, 360], toCoords: [258, 489], weight: 4, label: 'Entente Diplomatique' },
  { from: 'Österreich', to: 'Italien', fromCoords: [394, 473], toCoords: [372, 545], weight: 4, label: 'Alpen-Adria Konkordat' },
  { from: 'Spanien', to: 'Portugal', fromCoords: [165, 584], toCoords: [106, 583], weight: 3, label: 'Iberischer Pakt' },
  { from: 'Deutschland', to: 'Tschechien', fromCoords: [350, 415], toCoords: [405, 436], weight: 3, label: 'Böhmisch-Deutscher Dialog' },
  { from: 'Österreich', to: 'Polen', fromCoords: [394, 473], toCoords: [445, 391], weight: 3, label: 'Visegrád-Diplomatie' },
  { from: 'Frankreich', to: 'Belgien', fromCoords: [258, 489], toCoords: [288, 416], weight: 4, label: 'Westeuropäisches Friedensnetz' },
  { from: 'Schweiz', to: 'Deutschland', fromCoords: [325, 488], toCoords: [350, 415], weight: 4, label: 'Eidgenössisches Neutralitätsabkommen' },
  { from: 'Großbritannien', to: 'Deutschland', fromCoords: [217, 360], toCoords: [350, 415], weight: 4, label: 'Nordsee-Nordatlantik Konkordat' }
];

export const DENSITY_TIERS: DensityTier[] = [
  { id: 'epizentrum', min: 40, max: 999, label: '40+ Häuser', color: '#7F1D1D', borderColor: '#450A0A', textColor: '#FFFFFF', description: 'Epizentrum (DE, IT)' },
  { id: 'high', min: 16, max: 39, label: '16–39 Häuser', color: '#B91C1C', borderColor: '#7F1D1D', textColor: '#FFFFFF', description: 'Hohe Dichte (FR, GB, ES, PL, AT)' },
  { id: 'medium', min: 9, max: 15, label: '9–15 Häuser', color: '#EA580C', borderColor: '#9A3412', textColor: '#FFFFFF', description: 'Mittlere Dichte (BE, PT, RU, CZ)' },
  { id: 'moderate', min: 4, max: 8, label: '4–8 Häuser', color: '#F59E0B', borderColor: '#B45309', textColor: '#1A1215', description: 'Moderate Dichte (SE, NL, DK, HU)' },
  { id: 'low', min: 1, max: 3, label: '1–3 Häuser', color: '#FDE68A', borderColor: '#D97706', textColor: '#1A1215', description: 'Basis-Dichte (NO, SK, RO, FI, LI, MC, LU...)' },
];

export const STANDARD_REGIONS = [
  { name: 'DACH & Heiliges Römisches Reich', color: '#E8DAC0', borderColor: '#C6B290', shortLabel: 'DACH & HRR' },
  { name: 'Frankreich, Benelux, UK', color: '#D4DEE5', borderColor: '#9EB3C2', shortLabel: 'Frankreich & Westeuropa' },
  { name: 'Italien, Spanien, Portugal', color: '#EBD8CD', borderColor: '#CBAFA0', shortLabel: 'Mittelmeerraum & Iberien' },
  { name: 'Skandinavien, Osteuropa, Russland', color: '#D8E2D7', borderColor: '#A6BFA5', shortLabel: 'Nord- & Osteuropa' },
];

// Country flags (emojis + fallback codes)
export const COUNTRY_FLAGS: Record<string, string> = {
  Deutschland: '🇩🇪',
  Österreich: '🇦🇹',
  Italien: '🇮🇹',
  Frankreich: '🇫🇷',
  Großbritannien: '🇬🇧',
  Spanien: '🇪🇸',
  Polen: '🇵🇱',
  Belgien: '🇧🇪',
  Portugal: '🇵🇹',
  Russland: '🇷🇺',
  Tschechien: '🇨🇿',
  Schweden: '🇸🇪',
  Niederlande: '🇳🇱',
  Dänemark: '🇩🇰',
  Ungarn: '🇭🇺',
  Norwegen: '🇳🇴',
  Slowakei: '🇸🇰',
  Rumänien: '🇷🇴',
  Finnland: '🇫🇮',
  Liechtenstein: '🇱🇮',
  Monaco: '🇲🇨',
  Luxemburg: '🇱🇺',
  Lettland: '🇱🇻',
  Estland: '🇪🇪',
  Schweiz: '🇨🇭',
  Irland: '🇮🇪',
  Ukraine: '🇺🇦',
  Griechenland: '🇬🇷',
  Kroatien: '🇭🇷',
  Slowenien: '🇸🇮',
  Japan: '🇯🇵',
  Thailand: '🇹🇭',
  'Saudi-Arabien': '🇸🇦',
  Jordanien: '🇯🇴',
  Indien: '🇮🇳',
  China: '🇨🇳',
  Korea: '🇰🇷',
  Iran: '🇮🇷',
  Türkei: '🇹🇷',
  Vietnam: '🇻🇳',
  Mongolei: '🇲🇳',
  Kambodscha: '🇰🇭',
  Bhutan: '🇧🇹',
  Brunei: '🇧🇳',
  Oman: '🇴🇲',
  Äthiopien: '🇪🇹',
  Südafrika: '🇿🇦',
  Ghana: '🇬🇭',
  Brasilien: '🇧🇷',
  Mexiko: '🇲🇽',
  Tonga: '🇹🇴',
  'USA (Hawaii)': '🇺🇸',
  USA: '🇺🇸',
  Neuseeland: '🇳🇿',
  Nigeria: '🇳🇬',
  Uganda: '🇺🇬',
  Eswatini: '🇸🇿',
  Lesotho: '🇱🇸',
  Marokko: '🇲🇦',
  'Vereinigte Arabische Emirate': '🇦🇪',
  Katar: '🇶🇦',
  Kuwait: '🇰🇼',
  Bahrain: '🇧🇭',
  Peru: '🇵🇪',
  Guatemala: '🇬🇹',
  Venezuela: '🇻🇪',
  'Weltweit (Indien, Pakistan, Iran, Ostafrika)': '🌐'
};

// Microstates and special pin locations that need enhanced clickable badges/circles
export const SPECIAL_PINS: Record<string, { x: number; y: number; label: string; pinRadius: number }> = {
  LI: { x: 341, y: 482, label: 'Liechtenstein', pinRadius: 9 },
  MC: { x: 314, y: 538, label: 'Monaco', pinRadius: 9 },
  LU: { x: 303, y: 436, label: 'Luxemburg', pinRadius: 9 },
  SM: { x: 377, y: 537, label: 'San Marino', pinRadius: 7 },
  VA: { x: 378, y: 565, label: 'Vatikan', pinRadius: 7 }
};

// Visual badge centers customized to sit aesthetically within the country borders
export const BADGE_CENTERS_OVERRIDE: Record<string, [number, number]> = {
  DE: [350, 415],
  AT: [394, 473],
  IT: [372, 545],
  FR: [258, 489],
  ES: [165, 584],
  PT: [106, 583],
  GB: [217, 360],
  IE: [161, 356],
  BE: [288, 416],
  NL: [298, 385],
  LU: [303, 436],
  LI: [341, 482],
  MC: [314, 538],
  CH: [325, 488],
  PL: [445, 391],
  CZ: [405, 436],
  SK: [453, 449],
  HU: [456, 475],
  RO: [525, 487],
  DK: [347, 331],
  SE: [398, 255],
  NO: [342, 230],
  FI: [470, 220],
  RU: [640, 310],
  EE: [485, 269],
  LV: [486, 301],
  LT: [482, 329]
};

// Precompute metadata per country from the actual dataset
export function getCountryMetadataMap(): Map<string, CountryMeta> {
  const map = new Map<string, CountryMeta>();
  const totalHouses = allHouses.length;

  // Count houses and collect notable names
  const countsByCountry: Record<string, { count: number; houses: string[]; region: string }> = {};

  for (const house of allHouses) {
    if (!countsByCountry[house.country]) {
      countsByCountry[house.country] = { count: 0, houses: [], region: house.region };
    }
    countsByCountry[house.country].count++;
    if (countsByCountry[house.country].houses.length < 5) {
      countsByCountry[house.country].houses.push(house.name.replace(/^Haus\s+/, ''));
    }
  }

  // Sort descending by count to calculate rank
  const sortedEntries = Object.entries(countsByCountry).sort((a, b) => b[1].count - a[1].count);

  sortedEntries.forEach(([countryName, data], index) => {
    const rank = index + 1;
    const percentOfTotal = totalHouses > 0 ? Math.round((data.count / totalHouses) * 1000) / 10 : 0;
    
    let densityLevel: CountryMeta['densityLevel'] = 'none';
    let densityLabel = 'Keine Adelsarchive erfasst';

    if (data.count >= 40) {
      densityLevel = 'epizentrum';
      densityLabel = 'Dichte-Epizentrum (40+)';
    } else if (data.count >= 16) {
      densityLevel = 'high';
      densityLabel = 'Hohe Konzentration (16–39)';
    } else if (data.count >= 9) {
      densityLevel = 'medium';
      densityLabel = 'Mittlere Dichte (9–15)';
    } else if (data.count >= 4) {
      densityLevel = 'moderate';
      densityLabel = 'Moderate Dichte (4–8)';
    } else if (data.count >= 1) {
      densityLevel = 'low';
      densityLabel = 'Basis-Dichte (1–3)';
    }

    map.set(countryName, {
      code: countryName,
      name: countryName,
      germanName: countryName,
      flag: COUNTRY_FLAGS[countryName] || '🏛️',
      housesCount: data.count,
      notableHouses: data.houses,
      region: data.region,
      rank,
      percentOfTotal,
      densityLevel,
      densityLabel
    });
  });

  return map;
}

// Color generator supporting both Standard (regional/historical) and Density View (choropleth thermal heatmap)
export function getCountryColorStyle(
  housesCount: number,
  region: string,
  isSelected: boolean,
  isHovered: boolean,
  viewMode: MapViewMode = 'density'
) {
  if (isSelected) {
    return {
      fill: viewMode === 'density' ? '#5E0817' : '#7D1A29', // Deep royal crimson
      stroke: '#F59E0B', // Radiant Gold Highlight
      strokeWidth: 2.4,
      opacity: 1
    };
  }

  if (isHovered && housesCount > 0) {
    return {
      fill: viewMode === 'density' ? '#991B1B' : '#8F1E2E',
      stroke: '#FBBF24', // Warm Gold Highlight
      strokeWidth: 2.1,
      opacity: 1
    };
  }

  if (isHovered && housesCount === 0) {
    return {
      fill: '#DFD5C4',
      stroke: '#A89984',
      strokeWidth: 1.2,
      opacity: 0.95
    };
  }

  // STANDARD VIEW: Categorical regional tinting
  if (viewMode === 'standard') {
    if (housesCount === 0) {
      return {
        fill: '#ECE5D8',
        stroke: '#D5C9B5',
        strokeWidth: 0.75,
        opacity: 0.7
      };
    }

    switch (region) {
      case 'DACH & Heiliges Römisches Reich':
        return {
          fill: '#E8D9BE', // Imperial Sand / Warm Ochre
          stroke: '#C2B08D',
          strokeWidth: 0.95,
          opacity: 0.9
        };
      case 'Frankreich, Benelux, UK':
        return {
          fill: '#D5DEE5', // Regal Slate-Blue
          stroke: '#9FB3C3',
          strokeWidth: 0.95,
          opacity: 0.9
        };
      case 'Italien, Spanien, Portugal':
        return {
          fill: '#EBD9CE', // Mediterranean Sienna / Warm Terracotta
          stroke: '#C8ADA0',
          strokeWidth: 0.95,
          opacity: 0.9
        };
      case 'Skandinavien, Osteuropa, Russland':
        return {
          fill: '#DAE3D8', // Boreal Sage / Soft Pine
          stroke: '#A7BFA6',
          strokeWidth: 0.95,
          opacity: 0.9
        };
      default:
        return {
          fill: '#E4DDD0',
          stroke: '#C5BCAE',
          strokeWidth: 0.9,
          opacity: 0.85
        };
    }
  }

  // DIPLOMATIC REACH VIEW: Emerald and Gold Diplomatic Network Theme
  if (viewMode === 'diplomatic_reach') {
    if (housesCount >= 40) {
      return { fill: '#064E3B', stroke: '#F59E0B', strokeWidth: 1.4, opacity: 0.95 }; // Major Diplo Hub (DE, IT)
    } else if (housesCount >= 16) {
      return { fill: '#065F46', stroke: '#34D399', strokeWidth: 1.2, opacity: 0.9 }; // High Reach (FR, GB, ES, PL, AT)
    } else if (housesCount >= 9) {
      return { fill: '#047857', stroke: '#6EE7B7', strokeWidth: 1.1, opacity: 0.88 }; // Active Partner
    } else if (housesCount >= 4) {
      return { fill: '#059669', stroke: '#A7F3D0', strokeWidth: 1.0, opacity: 0.85 }; // Collaborative
    } else if (housesCount >= 1) {
      return { fill: '#10B981', stroke: '#D1FAE5', strokeWidth: 0.85, opacity: 0.8 }; // Participant
    } else {
      return { fill: '#1F2937', stroke: '#374151', strokeWidth: 0.75, opacity: 0.5 }; // Neutral / No Houses
    }
  }

  // DENSITY VIEW: Thermal Choropleth Heatmap Gradient
  if (housesCount >= 40) {
    return { fill: '#7F1D1D', stroke: '#450A0A', strokeWidth: 1.25, opacity: 0.96 };
  } else if (housesCount >= 16) {
    return { fill: '#B91C1C', stroke: '#7F1D1D', strokeWidth: 1.15, opacity: 0.92 };
  } else if (housesCount >= 9) {
    return { fill: '#EA580C', stroke: '#9A3412', strokeWidth: 1.05, opacity: 0.9 };
  } else if (housesCount >= 4) {
    return { fill: '#F59E0B', stroke: '#B45309', strokeWidth: 0.95, opacity: 0.88 };
  } else if (housesCount >= 1) {
    return { fill: '#FDE68A', stroke: '#D97706', strokeWidth: 0.85, opacity: 0.85 };
  } else {
    return { fill: '#ECE5D8', stroke: '#D5C9B5', strokeWidth: 0.75, opacity: 0.65 };
  }
}
