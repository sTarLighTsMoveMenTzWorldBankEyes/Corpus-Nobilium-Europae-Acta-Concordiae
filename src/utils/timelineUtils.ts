import { House, HistoricalEpochKey, HistoricalEpoch, CenturyStat, DiplomaticStatus } from '../types';

/**
 * Extracts the earliest historical year mentioned in a house's period string.
 * Handles formats like:
 * - "1061–heute (Könige von Preußen...)" -> 1061
 * - "750/1070–heute..." -> 750
 * - "1238/1687–heute..." -> 1238
 * - "14. Jh.–heute..." -> 1300
 */
export function extractHouseStartYear(period: string): number {
  if (!period) return 1200;

  // Check for century notation like "11. Jh." or "12. Jahrhundert"
  const centuryMatch = period.match(/(\d{1,2})\.\s*(?:Jh\.|Jahrhundert)/i);
  if (centuryMatch) {
    const c = parseInt(centuryMatch[1], 10);
    return (c - 1) * 100;
  }

  // Find all 3 or 4 digit years
  const matches = period.match(/\b(\d{3,4})\b/g);
  if (matches && matches.length > 0) {
    const years = matches
      .map((m) => parseInt(m, 10))
      .filter((y) => y >= 600 && y <= 2026);
    if (years.length > 0) {
      return Math.min(...years);
    }
  }

  return 1200;
}

/**
 * Historical epochs representing European dynastic and diplomatic development.
 */
export const HISTORICAL_EPOCHS: HistoricalEpoch[] = [
  {
    key: 'ALL',
    label: 'Alle Epochen (750–heute)',
    shortLabel: 'Alle Epochen',
    subTitle: 'Gesamtes europäisches Adelscorpus & Friedensnetzwerk',
    startYear: 700,
    endYear: 2026,
    badgeColor: 'bg-[#8B1E2F] text-[#FAF6EE] border-[#8B1E2F]',
    textColor: 'text-[#8B1E2F]',
    accentBg: 'bg-[#F9F5EE]',
    historicalSignificance: 'Umfasst die gesamte dokumentierte Kontinuität von 360 europäischen Adelshäusern vom Frühmittelalter bis zur modernen europäischen Einigung.',
    diplomaticRoleConcordiae: 'Vollständiges Panorama der 360 dynastischen Unterzeichner und Konsultationspartner im Friedenswerk der Acta Concordiae.',
    keyTreaties: ['Reichslandfrieden (1152)', 'Goldene Bulle (1356)', 'Westfälischer Friede (1648)', 'Wiener Kongress (1815)', 'Acta Concordiae Charta (2026)']
  },
  {
    key: 'MIDDLE_AGES',
    label: 'Mittelalter (750–1499)',
    shortLabel: 'Mittelalter',
    subTitle: 'Uradel, Lehnswesen & Feudale Friedensordnungen',
    startYear: 700,
    endYear: 1499,
    badgeColor: 'bg-[#5B212E] text-[#FDF8F3] border-[#7F3040]',
    textColor: 'text-[#7F3040]',
    accentBg: 'bg-[#F8F2EE]',
    historicalSignificance: 'Entstehung der ältesten Uradelsgeschlechter, feudale Reichslehen im Heiligen Römischen Reich und Kapetinger-Frankreich, Errichtung von Pfalzen und Stammburgen.',
    diplomaticRoleConcordiae: 'Die Urväter der europäischen Bündnistradition. Im Acta-Concordiae-Prozess repräsentieren diese Häuser die tiefste historische Verankerung, älteste Hausarchive und ununterbrochene Kulturpatronage.',
    keyTreaties: ['Kaiserkrönung Karls d. Großen (800)', 'Pax Dei / Treuga Dei (ca. 1000)', 'Reichslandfriede Barbarossas (1152)', 'Goldene Bulle (1356)']
  },
  {
    key: 'HIGH_MIDDLE_AGES',
    label: 'Früh- & Hochmittelalter (vor 1250)',
    shortLabel: 'Hochmittelalter',
    subTitle: 'Uradel, Kreuzzüge & Stauferzeit',
    startYear: 700,
    endYear: 1249,
    badgeColor: 'bg-[#431B23] text-[#FAF6EE] border-[#662835]',
    textColor: 'text-[#662835]',
    accentBg: 'bg-[#F9F2EE]',
    historicalSignificance: 'Karolinger, Ottonen, Salier und Staufer. Etablierung des ritterlichen Tugendkanons und der ersten Reichsfürstenstände.',
    diplomaticRoleConcordiae: 'Älteste Uradels-Linien Europas. Bewahrer vorstaatlicher dynastischer Verbrüderungen und Träger des ersten Gottesfriedens (Pax Dei).',
    keyTreaties: ['Vertrag von Verdun (843)', 'Wormser Konkordat (1122)', 'Großer Reichslandfriede (1235)']
  },
  {
    key: 'LATE_MIDDLE_AGES',
    label: 'Spätmittelalter (1250–1499)',
    shortLabel: 'Spätmittelalter',
    subTitle: 'Goldene Bulle, Kurfürstenrat & Hausmacht',
    startYear: 1250,
    endYear: 1499,
    badgeColor: 'bg-[#6D3222] text-[#FAF6EE] border-[#8C4330]',
    textColor: 'text-[#8C4330]',
    accentBg: 'bg-[#F8F1EB]',
    historicalSignificance: 'Aufstieg der Hausmächte (Habsburg, Luxemburg, Wittelsbach, Wettin). Kodifizierung der Kaiserwahl durch das Kurfürstenkollegium in der Goldenen Bulle 1356.',
    diplomaticRoleConcordiae: 'Beginn institutionalisierter Konferenzdiplomatie und Verfassungsverträge. Ihre Wappen spiegeln die Teilung und Mehrung territorialer Friedenspflichten wider.',
    keyTreaties: ['Goldene Bulle Karls IV. (1356)', 'Ewiger Landfriede von Worms (1495)', 'Reichskammergerichts-Ordnung (1495)']
  },
  {
    key: 'RENAISSANCE',
    label: 'Renaissance & Konfessionszeitalter (1500–1648)',
    shortLabel: 'Renaissance',
    subTitle: 'Reichsreform, Gesandtenwesen & Westfälischer Friede',
    startYear: 1500,
    endYear: 1648,
    badgeColor: 'bg-[#B45309] text-white border-[#D97706]',
    textColor: 'text-[#B45309]',
    accentBg: 'bg-[#FFFBEB]',
    historicalSignificance: 'Aufblühen von Humanismus und Hofkultur in Italien, Frankreich und im Reich. Konfessionelle Spaltung, gefolgt vom Dreißigjährigen Krieg und dem epochalen Friedensschluss von Münster und Osnabrück 1648.',
    diplomaticRoleConcordiae: 'Direktes historisches Fundament der Acta Concordiae: Der Westfälische Friede von 1648 etablierte die Souveränität und Gleichberechtigung der Reichsstände sowie das moderne Völkerrecht.',
    keyTreaties: ['Augsburger Reichs- und Religionsfrieden (1555)', 'Union von Utrecht (1579)', 'Westfälischer Friede (Instrumentum Pacis Monasteriense / Osnabrugense, 1648)']
  },
  {
    key: 'BAROQUE_ENLIGHTENMENT',
    label: 'Barock & Aufklärung (1649–1789)',
    shortLabel: 'Barock & Aufklärung',
    subTitle: 'Mächtegleichgewicht, Pentarchie & Diplomatenorden',
    startYear: 1649,
    endYear: 1789,
    badgeColor: 'bg-[#047857] text-white border-[#059669]',
    textColor: 'text-[#047857]',
    accentBg: 'bg-[#ECFDF5]',
    historicalSignificance: 'Europäisches Mächtegleichgewicht (Balance of Power). Zahlreiche Grafen- und Freiherrengeschlechter werden zu regierenden Reichsfürsten und Granden von Spanien erhoben.',
    diplomaticRoleConcordiae: 'Klassisches Zeitalter des permanenten Gesandtschaftswesens und der Schlichtungsdiplomatie. Im Acta-Concordiae-Netzwerk stehen diese Häuser für rechtsstaatliche Mediation und Bildungsmäzenatentum.',
    keyTreaties: ['Friede von Utrecht (1713)', 'Pragmatische Sanktion (1713)', 'Friede von Aachen (1748)', 'Immanuel Kant: "Zum ewigen Frieden" (1795 Inspiration)']
  },
  {
    key: 'MODERN',
    label: 'Neuzeit & Moderne (1789–heute)',
    shortLabel: 'Neuzeit & Moderne',
    subTitle: 'Mediatisierung, Wiener Kongress & Europäische Einigung',
    startYear: 1789,
    endYear: 2026,
    badgeColor: 'bg-[#1D4ED8] text-white border-[#2563EB]',
    textColor: 'text-[#1D4ED8]',
    accentBg: 'bg-[#EFF6FF]',
    historicalSignificance: 'Reichsdeputationshauptschluss (1803), Wiener Kongress (1815) mit Mediatisierung und Erhalt der Ebenbürtigkeit (Deutsche Bundesakte Art. 14). Übergang zu Stiftungen, Kulturförderung und transnationale Versöhnung.',
    diplomaticRoleConcordiae: 'Moderne Träger der Friedensdiplomatie: Überparteiliche Stiftungen, humanitäre Initiativen und kulturdiplomatische Brückenbauer im Geiste der europäischen Einheit.',
    keyTreaties: ['Reichsdeputationshauptschluss (1803)', 'Wiener Kongressakte & Deutsche Bundesakte (1815)', 'Römische Verträge (1957)', 'Acta Concordiae Europae Charta (2026)']
  }
];

export const EPOCH_MAP: Record<HistoricalEpochKey, HistoricalEpoch> = HISTORICAL_EPOCHS.reduce(
  (acc, epoch) => {
    acc[epoch.key] = epoch;
    return acc;
  },
  {} as Record<HistoricalEpochKey, HistoricalEpoch>
);

/**
 * Key historical milestones displayed along the interactive timeline track.
 */
export interface TimelineMilestone {
  year: number;
  label: string;
  significance: string;
  diplomaticImpact: string;
  epochKey: HistoricalEpochKey;
}

export const HISTORICAL_DIPLOMATIC_MILESTONES: TimelineMilestone[] = [
  {
    year: 800,
    label: '800: Kaiserkrönung Karls d. Gr.',
    significance: 'Erneuerung der europäischen Reichsidee',
    diplomaticImpact: 'Begründung des europäischen Lehnssystems und erster überregionaler Beistandspflichten.',
    epochKey: 'HIGH_MIDDLE_AGES'
  },
  {
    year: 1152,
    label: '1152: Reichslandfriede Barbarossas',
    significance: 'Erster umfassender Reichsfriedensbeschluss',
    diplomaticImpact: 'Ächtung privater Fehden und Beginn institutionalisierter fürstlicher Schiedsgerichte.',
    epochKey: 'HIGH_MIDDLE_AGES'
  },
  {
    year: 1356,
    label: '1356: Die Goldene Bulle',
    significance: 'Grundgesetz des Heiligen Römischen Reiches',
    diplomaticImpact: 'Festlegung des Kurfürstenrates als permanentes diplomatisches Spitzengremium Europas.',
    epochKey: 'LATE_MIDDLE_AGES'
  },
  {
    year: 1495,
    label: '1495: Ewiger Landfriede',
    significance: 'Wormser Reichsreform & Reichskammergericht',
    diplomaticImpact: 'Rechtsverbindliches Verbot aller Fehden – rechtliche Schlichtung statt Waffengewalt.',
    epochKey: 'LATE_MIDDLE_AGES'
  },
  {
    year: 1555,
    label: '1555: Augsburger Religionsfriede',
    significance: 'Anerkennung konfessioneller Pluralität',
    diplomaticImpact: 'Erster völkerrechtlicher Ausgleich zwischen katholischen und protestantischen Reichsständen.',
    epochKey: 'RENAISSANCE'
  },
  {
    year: 1648,
    label: '1648: Westfälischer Friede',
    significance: 'Fundament des modernen Völkerrechts',
    diplomaticImpact: 'Mutter aller europäischen Friedensverträge: Gleichberechtigung aller Stände, Vorbild der Acta Concordiae.',
    epochKey: 'RENAISSANCE'
  },
  {
    year: 1713,
    label: '1713: Friede von Utrecht',
    significance: 'Europäisches Gleichgewicht (Balance of Power)',
    diplomaticImpact: 'Etablierung multilateraler Konferenzdiplomatie zur Verhinderung hegemonialer Vormachtstellung.',
    epochKey: 'BAROQUE_ENLIGHTENMENT'
  },
  {
    year: 1815,
    label: '1815: Wiener Kongress',
    significance: 'Neuordnung Europas & Mediatisierung',
    diplomaticImpact: 'Deutsche Bundesakte Art. 14 sicherte standesherrliche Rechte und schuf das Konzerteuropa.',
    epochKey: 'MODERN'
  },
  {
    year: 2026,
    label: '2026: Acta Concordiae Europae',
    significance: 'Friedens- und Versöhnungsmanifest der Häuser',
    diplomaticImpact: 'Reaktivierung des historischen diplomatischen Kapitals der Häuser für europäischen Frieden und Kulturdialog.',
    epochKey: 'MODERN'
  }
];

/**
 * Checks whether a house matches the epoch or custom time range.
 */
export function isHouseInEpoch(
  house: House,
  epochKey: HistoricalEpochKey,
  isCumulative: boolean = false,
  customRange?: [number, number]
): boolean {
  const year = extractHouseStartYear(house.period);

  if (customRange) {
    const [min, max] = customRange;
    return year >= min && year <= max;
  }

  if (epochKey === 'ALL') {
    return true;
  }

  const epoch = EPOCH_MAP[epochKey];
  if (!epoch) return true;

  if (isCumulative) {
    // Cumulative: all houses founded up to the end of this epoch
    return year <= epoch.endYear;
  }

  // Exact epoch range
  return year >= epoch.startYear && year <= epoch.endYear;
}

/**
 * Calculates century statistics across a list of houses for timeline bar visualization.
 */
export function calculateCenturyStats(houses: House[]): CenturyStat[] {
  const centuries: CenturyStat[] = [
    { centuryNumber: 8, centuryLabel: 'vor 1000', startYear: 700, endYear: 999, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 11, centuryLabel: '11. Jh.', startYear: 1000, endYear: 1099, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 12, centuryLabel: '12. Jh.', startYear: 1100, endYear: 1199, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 13, centuryLabel: '13. Jh.', startYear: 1200, endYear: 1299, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 14, centuryLabel: '14. Jh.', startYear: 1300, endYear: 1399, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 15, centuryLabel: '15. Jh.', startYear: 1400, endYear: 1499, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 16, centuryLabel: '16. Jh.', startYear: 1500, endYear: 1599, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 17, centuryLabel: '17. Jh.', startYear: 1600, endYear: 1699, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 18, centuryLabel: '18. Jh.', startYear: 1700, endYear: 1799, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 },
    { centuryNumber: 19, centuryLabel: '19.–20. Jh.', startYear: 1800, endYear: 2026, totalHouses: 0, activeCount: 0, consultingCount: 0, observingCount: 0 }
  ];

  for (const h of houses) {
    const y = extractHouseStartYear(h.period);
    const dipStatus: DiplomaticStatus = h.DiplomaticStatus || h.diplomaticStatus || 'Consulting';

    for (const c of centuries) {
      if (y >= c.startYear && y <= c.endYear) {
        c.totalHouses++;
        if (dipStatus === 'Active') c.activeCount++;
        else if (dipStatus === 'Consulting') c.consultingCount++;
        else if (dipStatus === 'Observing') c.observingCount++;
        break;
      }
    }
  }

  return centuries;
}
