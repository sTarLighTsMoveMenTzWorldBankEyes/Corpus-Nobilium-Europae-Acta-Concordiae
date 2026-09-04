export type Region =
  | 'DACH & Heiliges Römisches Reich'
  | 'Italien, Spanien, Portugal'
  | 'Frankreich, Benelux, UK'
  | 'Skandinavien, Osteuropa, Russland'
  | 'Weltweit (Asien, Afrika, Amerika, Naher Osten)';

export type HouseType =
  | 'Kaiser- & Königshaus'
  | 'Großherzogshaus'
  | 'Fürsten- & Herzogshaus'
  | 'Hochadel & Grafenhaus'
  | 'Päpstlicher Adel & Römische Fürsten'
  | 'Papst- & Patriziergeschlecht'
  | 'Patrizier & Stadtadel'
  | 'Bankiers- & Handelsdynastie'
  | (string & {});

export type HouseStatus =
  | 'Regierend'
  | 'Regierend / Souverän'
  | 'Ehem. Regierend / Souverän'
  | 'Mediatisiert'
  | 'Historischer Adel'
  | 'Erloschen (Erbe bewahrt)'
  | (string & {});

export type DiplomaticStatus = 'Active' | 'Consulting' | 'Observing';

export interface DiplomaticStatusConfig {
  status: DiplomaticStatus;
  labelEn: string;
  labelDe: string;
  shortDesc: string;
  badgeClass: string;
  borderClass: string;
  dotClass: string;
  roleDescription: string;
}

export const DIPLOMATIC_STATUS_MAP: Record<DiplomaticStatus, DiplomaticStatusConfig> = {
  Active: {
    status: 'Active',
    labelEn: 'Active',
    labelDe: 'Aktiv',
    shortDesc: 'Aktiv im Friedensdialog',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    borderClass: 'border-emerald-300',
    dotClass: 'bg-emerald-500',
    roleDescription: 'Aktiver Träger & Initiator im Acta Concordiae Prozess. Engagiert in der grenzüberschreitenden Kulturdiplomatie, Stiftungsförderung und Völkerverständigung.'
  },
  Consulting: {
    status: 'Consulting',
    labelEn: 'Consulting',
    labelDe: 'Beratend',
    shortDesc: 'Historisch-kulturelle Konsultation',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    borderClass: 'border-amber-300',
    dotClass: 'bg-amber-500',
    roleDescription: 'Beratender Partner für historisch-genealogische Forschung, Bereitstellung von Archivbeständen und denkmalpflegerischen Austausch im europäischen Netzwerk.'
  },
  Observing: {
    status: 'Observing',
    labelEn: 'Observing',
    labelDe: 'Beobachtend',
    shortDesc: 'Registrierter Friedensbeobachter',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-300',
    borderClass: 'border-slate-300',
    dotClass: 'bg-slate-400',
    roleDescription: 'Registrierter Beobachter des diplomatischen Friedensmanifests. Bewahrung des dynastischen Andenkens und begleitende Ratifizierung.'
  }
};

export interface HouseUrls {
  official?: string;
  archive?: string;
  museum?: string;
  foundation?: string;
  encyclopedia?: string;
}

export interface House {
  id: string;
  name: string;
  altNames?: string[];
  region: Region;
  country: string;
  seat: string;
  type: HouseType;
  status: HouseStatus;
  diplomaticStatus?: DiplomaticStatus;
  DiplomaticStatus?: DiplomaticStatus;
  period: string;
  institution?: string;
  urls: HouseUrls;
  email?: string;
  description: string;
  source: string;
  verifiedAt: string;
  crestMotif?: string;
}

export interface FilterState {
  search: string;
  region: string;
  country: string;
  type: string;
  status: string;
  onlyWithEmail: boolean;
  onlyWithArchive: boolean;
  onlyWithFoundation: boolean;
}

export interface NobleRegister {
  id: string;
  name: string;
  acronym: string;
  countryOrScope: string;
  url: string;
  email?: string;
  description: string;
  founded: string;
}

export type HistoricalEpochKey =
  | 'ALL'
  | 'MIDDLE_AGES'
  | 'HIGH_MIDDLE_AGES'
  | 'LATE_MIDDLE_AGES'
  | 'RENAISSANCE'
  | 'BAROQUE_ENLIGHTENMENT'
  | 'MODERN';

export interface HistoricalEpoch {
  key: HistoricalEpochKey;
  label: string;
  shortLabel: string;
  subTitle: string;
  startYear: number;
  endYear: number;
  badgeColor: string;
  textColor: string;
  accentBg: string;
  historicalSignificance: string;
  diplomaticRoleConcordiae: string;
  keyTreaties: string[];
}

export interface CenturyStat {
  centuryNumber: number;
  centuryLabel: string;
  startYear: number;
  endYear: number;
  totalHouses: number;
  activeCount: number;
  consultingCount: number;
  observingCount: number;
}

// D3 Force-Directed Graph Types for Diplomatic Alliances
export interface DiplomaticGraphNode {
  id: string;
  name: string;
  region: Region;
  country: string;
  status: DiplomaticStatus;
  type: HouseType;
  coatOfArms?: string;
  period?: string;
  residence?: string;
  email?: string;
  significance?: string;
  radius: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  connectionCount?: number;
}

export type AllianceType = 
  | 'PEACE_TREATY' 
  | 'MARRIAGE_UNION' 
  | 'DIPLOMATIC_PACT' 
  | 'CONCORDIA_BRIDGE' 
  | 'REGIONAL_CONFEDERATION';

export interface DiplomaticGraphLink {
  source: string | DiplomaticGraphNode;
  target: string | DiplomaticGraphNode;
  type: AllianceType;
  label: string;
  historicalContext: string;
  strength: number; // 1 (loose) to 5 (foundational)
  treatyYear?: string;
}

export interface GraphData {
  nodes: DiplomaticGraphNode[];
  links: DiplomaticGraphLink[];
}

// Spiritual Houses, Religious Heritage & Government eID Standards
export type WorldTradition = 
  | 'CHRISTIANITY' 
  | 'ISLAM' 
  | 'HINDUISM' 
  | 'BUDDHISM' 
  | 'JUDAISM' 
  | 'INTERFAITH_PEACE';

export interface SpiritualHouse {
  id: string;
  name: string;
  tradition: WorldTradition;
  country: string;
  city: string;
  spiritualSeat: string;
  founded: string;
  leaderOrPatron: string;
  eidPactStandard: 'BESA_EID' | 'SWISS_EID' | 'GERMAN_EIDAS' | 'GLOBAL_EID';
  eidCertificationId: string;
  peaceMission: string;
  officialUrl: string;
  contactEmail: string;
  holySignificance: string;
}
