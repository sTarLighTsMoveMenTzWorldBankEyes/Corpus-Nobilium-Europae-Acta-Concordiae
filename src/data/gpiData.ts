export interface CountryGPI {
  country: string;
  code: string;
  region: string;
  gpiScore: number; // 1.0 (most peaceful) to 3.6 (least peaceful)
  rank: number; // 1 to 163
  peaceLevel: 'Sehr hoch' | 'Hoch' | 'Mittel' | 'Niedrig' | 'Sehr niedrig (Krisenregion)';
  trend: 'verbessernd' | 'stabil' | 'verschlechternd';
  conflictStatus: 'Friedenssicherer Anker' | 'Stabiler Partner' | 'Regionale Spannungen' | 'Aktive Konfliktzone';
  actaConcordiaeIntervention: string;
  associatedHousesCount: number;
}

export const GLOBAL_PEACE_INDEX_DATA: CountryGPI[] = [
  {
    country: 'Island',
    code: 'IS',
    region: 'Skandinavien, Osteuropa, Russland',
    gpiScore: 1.124,
    rank: 1,
    peaceLevel: 'Sehr hoch',
    trend: 'stabil',
    conflictStatus: 'Friedenssicherer Anker',
    actaConcordiaeIntervention: 'Nordischer Kultur- und Friedensschild der Stiftungsarchive',
    associatedHousesCount: 4
  },
  {
    country: 'Schweiz',
    code: 'CH',
    region: 'DACH & Heiliges Römisches Reich',
    gpiScore: 1.339,
    rank: 6,
    peaceLevel: 'Sehr hoch',
    trend: 'stabil',
    conflictStatus: 'Friedenssicherer Anker',
    actaConcordiaeIntervention: 'Zentrales Neutralitäts- und Vermittlungssekretariat (Bern & Genf)',
    associatedHousesCount: 22
  },
  {
    country: 'Österreich',
    code: 'AT',
    region: 'DACH & Heiliges Römisches Reich',
    gpiScore: 1.316,
    rank: 4,
    peaceLevel: 'Sehr hoch',
    trend: 'stabil',
    conflictStatus: 'Friedenssicherer Anker',
    actaConcordiaeIntervention: 'Habsburgisch-Donauischer Konvent für interkulturellen Dialog',
    associatedHousesCount: 48
  },
  {
    country: 'Deutschland',
    code: 'DE',
    region: 'DACH & Heiliges Römisches Reich',
    gpiScore: 1.456,
    rank: 15,
    peaceLevel: 'Hoch',
    trend: 'stabil',
    conflictStatus: 'Stabiler Partner',
    actaConcordiaeIntervention: 'Reichs- und Fürstenarchiv-Netzwerk für historische Aussöhnung',
    associatedHousesCount: 115
  },
  {
    country: 'Japan',
    code: 'JP',
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    gpiScore: 1.397,
    rank: 10,
    peaceLevel: 'Sehr hoch',
    trend: 'stabil',
    conflictStatus: 'Friedenssicherer Anker',
    actaConcordiaeIntervention: 'Kaiserlicher Kulturpakt und ostasiatischer Vermittlungsdialog',
    associatedHousesCount: 6
  },
  {
    country: 'Vereinigtes Königreich',
    code: 'GB',
    region: 'Frankreich, Benelux, UK',
    gpiScore: 1.693,
    rank: 37,
    peaceLevel: 'Hoch',
    trend: 'stabil',
    conflictStatus: 'Stabiler Partner',
    actaConcordiaeIntervention: 'Commonwealth-Europäischer Geschichts- und Denkmalschutz',
    associatedHousesCount: 28
  },
  {
    country: 'Frankreich',
    code: 'FR',
    region: 'Frankreich, Benelux, UK',
    gpiScore: 1.839,
    rank: 57,
    peaceLevel: 'Mittel',
    trend: 'stabil',
    conflictStatus: 'Stabiler Partner',
    actaConcordiaeIntervention: 'Franko-Europäischer Aussöhnungskongress und Schlossarchiv-Pakt',
    associatedHousesCount: 35
  },
  {
    country: 'Italien',
    code: 'IT',
    region: 'Italien, Spanien, Portugal',
    gpiScore: 1.662,
    rank: 34,
    peaceLevel: 'Hoch',
    trend: 'verbessernd',
    conflictStatus: 'Stabiler Partner',
    actaConcordiaeIntervention: 'Vatikanischer und Römischer Fürsten-Friedenspakt',
    associatedHousesCount: 42
  },
  {
    country: 'Spanien',
    code: 'ES',
    region: 'Italien, Spanien, Portugal',
    gpiScore: 1.578,
    rank: 28,
    peaceLevel: 'Hoch',
    trend: 'stabil',
    conflictStatus: 'Stabiler Partner',
    actaConcordiaeIntervention: 'Ibero-Europäisches Erbe- und Kulturbrücken-Programm',
    associatedHousesCount: 19
  },
  {
    country: 'Polen',
    code: 'PL',
    region: 'Skandinavien, Osteuropa, Russland',
    gpiScore: 1.745,
    rank: 29,
    peaceLevel: 'Hoch',
    trend: 'stabil',
    conflictStatus: 'Stabiler Partner',
    actaConcordiaeIntervention: 'Mittelosteuropäischer Magnaten- und Stiftungsrat für Grenzfrieden',
    associatedHousesCount: 24
  },
  {
    country: 'Jordanien',
    code: 'JO',
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    gpiScore: 1.962,
    rank: 71,
    peaceLevel: 'Mittel',
    trend: 'stabil',
    conflictStatus: 'Regionale Spannungen',
    actaConcordiaeIntervention: 'Haschisch-Interreligiöser Friedensdialog und humanitärer Schutz',
    associatedHousesCount: 3
  },
  {
    country: 'Südafrika',
    code: 'ZA',
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    gpiScore: 2.399,
    rank: 124,
    peaceLevel: 'Niedrig',
    trend: 'stabil',
    conflictStatus: 'Regionale Spannungen',
    actaConcordiaeIntervention: 'Ubuntu-Wahrheits- und Aussöhnungs-Archiv-Stiftung',
    associatedHousesCount: 4
  },
  {
    country: 'Thailand',
    code: 'TH',
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    gpiScore: 2.074,
    rank: 75,
    peaceLevel: 'Mittel',
    trend: 'verbessernd',
    conflictStatus: 'Regionale Spannungen',
    actaConcordiaeIntervention: 'Königlicher Chakri-Kulturdialog und südostasiatische Vermittlung',
    associatedHousesCount: 5
  },
  {
    country: 'Ukraine',
    code: 'UA',
    region: 'Skandinavien, Osteuropa, Russland',
    gpiScore: 3.040,
    rank: 157,
    peaceLevel: 'Sehr niedrig (Krisenregion)',
    trend: 'verschlechternd',
    conflictStatus: 'Aktive Konfliktzone',
    actaConcordiaeIntervention: 'SOS-Kulturgüterschutz, humanitärer Notkorridor & Kiewer Fürstenarchiv-Rettung',
    associatedHousesCount: 12
  },
  {
    country: 'Russland',
    code: 'RU',
    region: 'Skandinavien, Osteuropa, Russland',
    gpiScore: 3.295,
    rank: 161,
    peaceLevel: 'Sehr niedrig (Krisenregion)',
    trend: 'verschlechternd',
    conflictStatus: 'Aktive Konfliktzone',
    actaConcordiaeIntervention: 'Zivile Zarentum- und Stiftungsvernetzung für künftige Aussöhnung',
    associatedHousesCount: 16
  },
  {
    country: 'Äthiopien',
    code: 'ET',
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    gpiScore: 2.846,
    rank: 147,
    peaceLevel: 'Sehr niedrig (Krisenregion)',
    trend: 'verschlechternd',
    conflictStatus: 'Aktive Konfliktzone',
    actaConcordiaeIntervention: 'Salomonischer Erbe-Dialog und ostafrikanische Friedensmission',
    associatedHousesCount: 2
  }
];

export function getGPIStats() {
  const totalCountries = GLOBAL_PEACE_INDEX_DATA.length;
  const avgScore = GLOBAL_PEACE_INDEX_DATA.reduce((acc, c) => acc + c.gpiScore, 0) / totalCountries;
  const crisisZones = GLOBAL_PEACE_INDEX_DATA.filter(c => c.conflictStatus === 'Aktive Konfliktzone');
  const stableAnchors = GLOBAL_PEACE_INDEX_DATA.filter(c => c.peaceLevel === 'Sehr hoch');
  return {
    totalCountries,
    avgScore: avgScore.toFixed(2),
    crisisCount: crisisZones.length,
    stableCount: stableAnchors.length
  };
}
