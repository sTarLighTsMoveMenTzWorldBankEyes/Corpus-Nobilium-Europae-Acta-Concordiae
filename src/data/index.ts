import { House, Region, HouseType, HouseStatus, DiplomaticStatus } from '../types';

import { housesDach } from './houses-dach';
import { housesDachExt } from './houses-dach-ext';
import { housesDachHrr } from './houses-dach-hrr';
import { housesDachMore } from './houses-dach-more';
import { housesDachPart5 } from './houses-dach-part5';

import { housesItaly } from './houses-italy';
import { housesItalyExt } from './houses-italy-ext';
import { housesSpain } from './houses-spain';
import { housesSpainExt } from './houses-spain-ext';
import { housesPortugal } from './houses-portugal';
import { housesSouthMore } from './houses-south-more';
import { housesSouthFinal } from './houses-south-final';

import { housesFrance } from './houses-france';
import { housesFranceExt } from './houses-france-ext';
import { housesUk } from './houses-uk';
import { housesUkExt } from './houses-uk-ext';
import { housesBenelux } from './houses-benelux';
import { housesWestMore } from './houses-west-more';
import { housesWestFinal } from './houses-west-final';

import { housesScandinavia } from './houses-scandinavia';
import { housesPoland } from './houses-poland';
import { housesPolandExt } from './houses-poland-ext';
import { housesRussiaEast } from './houses-russia-east';
import { housesEastFinal } from './houses-east-final';
import { housesEuropeMore } from './houses-europe-more';
import { housesGlobal } from './houses-global';

// Concatenate all batches
const rawHouses: House[] = [
  ...housesDach,
  ...housesDachExt,
  ...housesDachHrr,
  ...housesDachMore,
  ...housesDachPart5,
  ...housesItaly,
  ...housesItalyExt,
  ...housesSpain,
  ...housesSpainExt,
  ...housesPortugal,
  ...housesSouthMore,
  ...housesSouthFinal,
  ...housesFrance,
  ...housesFranceExt,
  ...housesUk,
  ...housesUkExt,
  ...housesBenelux,
  ...housesWestMore,
  ...housesWestFinal,
  ...housesScandinavia,
  ...housesPoland,
  ...housesPolandExt,
  ...housesRussiaEast,
  ...housesEastFinal,
  ...housesEuropeMore,
  ...housesGlobal
];

// Helper function to assign DiplomaticStatus reflecting engagement in Acta Concordiae
export function computeDiplomaticStatus(house: Partial<House>): DiplomaticStatus {
  if (house.diplomaticStatus) return house.diplomaticStatus;
  if (house.DiplomaticStatus) return house.DiplomaticStatus;

  const name = house.name || '';
  const status = house.status || '';
  const type = house.type || '';

  // Sovereign / reigning houses, key royal families, or houses leading the peace bridge
  const isSovereignOrLeading = 
    status.includes('Regierend') || 
    type.includes('Kaiser') || 
    type.includes('Großherzog') ||
    name.includes('Liechtenstein') ||
    name.includes('Monaco') ||
    name.includes('Habsburg') ||
    name.includes('Bourbon') ||
    name.includes('Borbón') ||
    name.includes('Hohenzollern') ||
    name.includes('Wittelsbach') ||
    name.includes('Wettin') ||
    name.includes('Bernadotte') ||
    name.includes('Orange') ||
    name.includes('Windsor') ||
    name.includes('Sachsen-Coburg') ||
    name.includes('Czartoryski') ||
    name.includes('Radziwiłł') ||
    name.includes('Medici') ||
    name.includes('Grimaldi');

  if (isSovereignOrLeading) {
    return 'Active';
  }

  // Extinct dynasties preserved as archives / memory monuments
  if (status.includes('Erloschen')) {
    return 'Observing';
  }

  // Deterministic assignment based on house ID character sum
  let sum = 0;
  const idStr = house.id || name;
  for (let i = 0; i < idStr.length; i++) {
    sum += idStr.charCodeAt(i);
  }

  if (type.includes('Fürsten') || type.includes('Päpstlich') || type.includes('Bankier')) {
    return sum % 3 === 0 ? 'Consulting' : 'Active';
  }

  if (type.includes('Hochadel') || type.includes('Grafen')) {
    const mod = sum % 4;
    return mod === 0 ? 'Observing' : mod === 1 ? 'Active' : 'Consulting';
  }

  // City nobility / Patricians / Historical Adel
  const mod = sum % 3;
  return mod === 0 ? 'Active' : mod === 1 ? 'Consulting' : 'Observing';
}

// Ensure unique IDs and populate DiplomaticStatus
const seenIds = new Set<string>();
export const allHouses: House[] = rawHouses
  .filter((h) => {
    if (seenIds.has(h.id)) {
      console.warn(`Duplicate ID detected: ${h.id}`);
      return false;
    }
    seenIds.add(h.id);
    return true;
  })
  .map((h) => {
    const dipStatus = computeDiplomaticStatus(h);
    return {
      ...h,
      diplomaticStatus: dipStatus,
      DiplomaticStatus: dipStatus
    };
  });

// Helper stats
export const totalCount = allHouses.length;

export const regionsList: Region[] = [
  'DACH & Heiliges Römisches Reich',
  'Italien, Spanien, Portugal',
  'Frankreich, Benelux, UK',
  'Skandinavien, Osteuropa, Russland',
  'Weltweit (Asien, Afrika, Amerika, Naher Osten)'
];

export const typesList: HouseType[] = [
  'Kaiser- & Königshaus',
  'Fürsten- & Herzogshaus',
  'Hochadel & Grafenhaus',
  'Päpstlicher Adel & Römische Fürsten',
  'Patrizier & Stadtadel',
  'Bankiers- & Handelsdynastie'
];

export const statusesList: HouseStatus[] = [
  'Regierend / Souverän',
  'Ehem. Regierend / Souverän',
  'Mediatisiert',
  'Historischer Adel',
  'Erloschen (Erbe bewahrt)'
];

export const countriesList: string[] = Array.from(
  new Set(allHouses.map((h) => h.country))
).sort();

export const diplomaticStatusesList: DiplomaticStatus[] = ['Active', 'Consulting', 'Observing'];

export interface DirectoryStats {
  total: number;
  byRegion: Record<Region, number>;
  byType: Record<string, number>;
  byDiplomaticStatus: Record<DiplomaticStatus, number>;
  countriesCount: number;
}

export function getDirectoryStats(): DirectoryStats {
  const byRegion: Record<Region, number> = {
    'DACH & Heiliges Römisches Reich': 0,
    'Italien, Spanien, Portugal': 0,
    'Frankreich, Benelux, UK': 0,
    'Skandinavien, Osteuropa, Russland': 0,
    'Weltweit (Asien, Afrika, Amerika, Naher Osten)': 0
  };

  const byType: Record<string, number> = {};
  const byDiplomaticStatus: Record<DiplomaticStatus, number> = {
    Active: 0,
    Consulting: 0,
    Observing: 0
  };

  for (const house of allHouses) {
    if (byRegion[house.region] !== undefined) {
      byRegion[house.region]++;
    }
    byType[house.type] = (byType[house.type] || 0) + 1;
    const dipStatus = house.diplomaticStatus || house.DiplomaticStatus || 'Consulting';
    if (byDiplomaticStatus[dipStatus] !== undefined) {
      byDiplomaticStatus[dipStatus]++;
    }
  }

  return {
    total: allHouses.length,
    byRegion,
    byType,
    byDiplomaticStatus,
    countriesCount: countriesList.length
  };
}
