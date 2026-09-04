import { House } from '../types';

export interface EmailTemplate {
  id: string;
  title: string;
  description: string;
  subject: string;
  body: string;
}

export const DIPLOMATIC_TEMPLATES: EmailTemplate[] = [
  {
    id: 'acta-concordiae',
    title: 'Acta Concordiae Europae • Friedensmanifest & Charta',
    description: 'Offizielle Einladung zum überparteilichen Friedensbund der europäischen Dynastien & Kulturstiftungen.',
    subject: 'Acta Concordiae Europae: Einladung zur Friedenscharta & Dialog der europäischen Adelshäuser',
    body: `Sehr geehrte Damen und Herren der Schloss- und Hausverwaltung,
verehrte Vertreterinnen und Vertreter der historischen Häuser,

im Geiste der "Acta Concordiae Europae" und der gemeinsamen Verantwortung für das historische und kulturelle Erbe unseres Kontinents wenden wir uns an Ihre geschätzte Institution.

Europa blickt auf eine jahrhundertealte, eng miteinander verflochtene Geschichte zurück. In einer Zeit tiefgreifender globaler Herausforderungen erachten wir es als essenziell, die Bande des gegenseitigen Schutzes, des transnationalen Friedensdialogs und der Pflege unserer gemeinsamen Wurzeln neu zu bekräftigen.

Wir laden Ihr geschätztes Haus herzlich dazu ein, Teil der friedensstiftenden Initiative "Acta Concordiae Europae" zu sein:
• Stärkung des europäischen Friedensgedankens durch transkulturellen Dialog
• Kooperation im Schutz und Erhalt gefährdeter historischer Monumente und Archive
• Gemeinsame Förderung humanitärer und bildungsorientierter Stiftungsinitiativen

Wir würden uns über eine kurze Rückmeldung aus Ihrem Sekretariat oder Archiv sehr freuen und stehen für einen vertraulichen Austausch jederzeit gern zur Verfügung.

Mit vorzüglicher Hochachtung,

Initiative "Acta Concordiae Europae"
Corpus Nobilium Europae • Registerstelle`
  },
  {
    id: 'archive-research',
    title: 'Wissenschaftliche Archiv- & Ahnenforschungsanfrage',
    description: 'Höfliche Anfrage bezüglich Einsichtnahme in Hausarchive, genealogische Urkunden oder Nachlässe.',
    subject: 'Archivalische Forschungsanfrage / Genealogischer Quellenabgleich',
    body: `Sehr geehrte Damen und Herren der Archivleitung,
werte Kolleginnen und Kollegen der Hausforschung,

für ein kulturhistorisches und genealogisches Dokumentationsprojekt zur europäischen Geschichte möchten wir eine höfliche Forschungsanfrage an Ihr Hausarchiv bzw. Ihre Sammlungsverwaltung richten.

Wir recherchieren im Rahmen des wissenschaftlichen Registers "Corpus Nobilium Europae" zu den territorialen Verflechtungen, dynastischen Verbindungen und heraldischen Nachweisen der europäischen Adelshäuser.

Wir bitten um Auskunft, ob in Ihrem Bestand:
1. Nutzungs- oder Einsichtsmöglichkeiten für forschungsrelevante Archivalien bestehen
2. Veröffentlichte Findbücher, Inventare oder digitalisierte Urkunden online zugänglich sind
3. Ein persönlicher oder digitaler Schriftverkehr für Detailfragen eingerichtet ist

Für Hinweise oder Vermittlung an den zuständigen Archivar danken wir Ihnen im Voraus herzlich.

Mit freundlichen Grüßen,

Forschungsgruppe Corpus Nobilium Europae`
  },
  {
    id: 'monument-heritage',
    title: 'Kulturgüterschutz & Europäischer Stiftungsdialog',
    description: 'Anfrage zur Zusammenarbeit bei Denkmalpflege, Schlossrestaurierung und Kulturfonds.',
    subject: 'Europäischer Kulturgüterschutz: Kooperation & Stiftungsdialog',
    body: `Sehr geehrte Damen und Herren,
werte Schloss- und Stiftungsverwaltung,

historische Residenzen, Schlossanlagen und Kulturstiftungen bilden das bauliche und immaterielle Herzstück der europäischen Identität. 

Mit dieser Mitteilung möchten wir Ihr geschätztes Haus auf eine Initiative zur europäischen Vernetzung privater und öffentlich-rechtlicher Kulturträger aufmerksam machen:
- Erfahrungsaustausch zu energetischer Sanierung unter Denkmalschutz
- Vernetzung von Stiftungsfonds für bedrohte historische Bausubstanz
- Förderung des transnationalen Kulturtourismus und museumspädagogischer Vermittlung

Gern würden wir Ihnen Informationsunterlagen zukommen lassen und erfahren, welche Prioritäten Ihr Haus im Bereich der Denkmalerhaltung derzeit setzt.

Wir danken für Ihren unschätzbaren Dienst am europäischen Kulturerbe.

Mit den besten Grüßen,

Forum Europäischer Residenzen & Kulturstiftungen`
  },
  {
    id: 'custom',
    title: 'Individuelle Mitteilung (Freitext)',
    description: 'Verfassen Sie Ihren eigenen Betreff und Textkörper für das Rundschreiben.',
    subject: 'Mitteilung an die europäischen Adelshäuser und Kulturstiftungen',
    body: `Sehr geehrte Damen und Herren,

[Hier Ihre persönliche Botschaft einfügen]

Mit freundlichen Grüßen,
`
  }
];

export interface EmailBatch {
  batchNumber: number;
  houses: House[];
  emails: string[];
  status: 'idle' | 'countdown' | 'opened' | 'skipped';
  mailtoUrl: string;
}

/**
 * Splits houses into manageable batches based on target batch size
 */
export function createEmailBatches(
  houses: House[],
  batchSize: number = 25,
  subject: string = '',
  body: string = ''
): EmailBatch[] {
  // Only include houses with valid emails
  const validHouses = houses.filter((h) => h.email && h.email.trim().includes('@'));
  const batches: EmailBatch[] = [];

  for (let i = 0; i < validHouses.length; i += batchSize) {
    const chunk = validHouses.slice(i, i + batchSize);
    const emails = chunk.map((h) => h.email!.trim());
    const bccString = emails.join(',');

    // Encode parameters safely for mailto
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bccString)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    batches.push({
      batchNumber: Math.floor(i / batchSize) + 1,
      houses: chunk,
      emails,
      status: 'idle',
      mailtoUrl
    });
  }

  return batches;
}

/**
 * Generates an RFC 822 formatted .eml file string (opens in Thunderbird, Apple Mail, Outlook, Bluebird, etc.)
 */
export function generateEmlContent(
  bccEmails: string[],
  subject: string,
  body: string
): string {
  const dateStr = new Date().toUTCString();
  const bccFormatted = bccEmails.join(', ');

  return [
    `Date: ${dateStr}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8; format=flowed`,
    `Content-Transfer-Encoding: 8bit`,
    `Bcc: ${bccFormatted}`,
    `X-Unsent: 1`,
    ``,
    body
  ].join('\r\n');
}

/**
 * Downloads an .eml draft file directly to the user's computer
 */
export function downloadEmlFile(
  bccEmails: string[],
  subject: string,
  body: string,
  filename: string = 'Rundschreiben_Adelshaeuser_Entwurf.eml'
): void {
  const content = generateEmlContent(bccEmails, subject, body);
  const blob = new Blob([content], { type: 'message/rfc822;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a vCard (.vcf) address book of all selected noble houses
 */
export function downloadVCardBook(
  houses: House[],
  filename: string = 'Europaeische_Adelshaeuser_Kontakte.vcf'
): void {
  const cards = houses
    .filter((h) => h.email)
    .map((h) => {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${h.name}`,
        `ORG:${h.institution || h.name}`,
        `TITLE:${h.type}`,
        `EMAIL;TYPE=INTERNET,WORK:${h.email}`,
        `ADR;TYPE=WORK:;;${h.seat};;${h.region};;${h.country}`,
        `URL:${h.urls.official || h.urls.archive || ''}`,
        `NOTE:Stammsitz: ${h.seat} | Dynastie: ${h.name} | Verifiziert: ${h.verifiedAt}`,
        'END:VCARD'
      ].join('\r\n');
    })
    .join('\r\n');

  const blob = new Blob([cards], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a dedicated Email Contact Distribution CSV
 */
export function downloadEmailCsv(
  houses: House[],
  filename: string = 'Europaeische_Adelshaeuser_Emailverteiler.csv'
): void {
  const headers = [
    'Haus / Dynastie',
    'Offizielle Kontakt-E-Mail',
    'Institution / Verwaltung',
    'Stammsitz / Residenz',
    'Land',
    'Rangstufe',
    'Offizielle Webpraesenz',
    'Archiv / Quelle',
    'True Evidence Nachweis'
  ];

  const escapeCsv = (str: string | undefined) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = houses
    .filter((h) => h.email)
    .map((h) => [
      escapeCsv(h.name),
      escapeCsv(h.email),
      escapeCsv(h.institution),
      escapeCsv(h.seat),
      escapeCsv(h.country),
      escapeCsv(h.type),
      escapeCsv(h.urls.official),
      escapeCsv(h.urls.archive),
      escapeCsv(`${h.institution} (Verifiziert: ${h.verifiedAt})`)
    ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
