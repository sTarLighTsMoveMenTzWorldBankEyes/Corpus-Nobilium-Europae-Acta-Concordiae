export interface ConcordiaPillar {
  id: string;
  number: string;
  latinTitle: string;
  title: string;
  subtitle: string;
  iconName: 'Shield' | 'Sparkles' | 'HeartHandshake' | 'Globe' | 'Scale' | 'Sun';
  philosophicalConcept: string;
  spiritualMetaphor: string;
  diplomaticGoal: string;
  practicalMeasures: string[];
  historicalPrecedents: string[];
}

export interface MasterPlanPhase {
  phaseNumber: number;
  codeName: string;
  timeHorizon: string;
  title: string;
  summary: string;
  deliverables: string[];
  institutionsInvolved: string[];
  impactMetric: string;
}

export interface PeaceHouseBridge {
  houseName: string;
  region: string;
  country: string;
  historicRole: string;
  peaceMissionToday: string;
  institutionRef: string;
  symbolicContribution: string;
}

export const CONCORDIA_MOTTO = {
  latin: "Concordia parvae res crescunt, discordia maximae dilabuntur.",
  translation: "Durch Eintracht wachsen kleine Dinge, durch Zwietracht zerfallen selbst die größten.",
  source: "Sallust, Bellum Iugurthinum"
};

export const CONCORDIA_PREAMBLE = `ACTA CONCORDIAE EUROPAE
Ein Manifest des historischen Neuanfangs, des gegenseitigen Schutzes und der ewigen Verbundenheit

An die Repräsentanten der historischen Häuser, die Hüter des kulturellen Erbes, die europäischen Stiftungen und die Völkergemeinschaft:

Wir stehen an einer epochalen Schwelle. Die Menschheit blickt auf eine gemeinsame Geschichte zurück, die von herausragender Geisteskultur, schöpferischer Kraft und architektonischer Erhabenheit, jedoch gleichermaßen von tiefen Gräben, verheerenden Kriegen und der Illusion unüberbrückbarer Trennung gezeichnet ist. Über Jahrhunderte standen unsere Dynastien, Nationen und Gemeinschaften wie an der Kante eines zersplitternden Abgrunds – stets getrieben von der Angst vor dem Kontrollverlust und der Notwendigkeit, die eigene Identität durch wehrhafte Abgrenzung zu sichern.

Doch in einer Epoche globaler Erschütterungen verliert diese Kante des Misstrauens ihre schützende Wirkung. Wahrer, unzerstörbarer Schutz erwächst nicht mehr aus Rivalität und Aufrüstung, sondern aus der endgültigen Überwindung des Abgrunds durch ein unerschütterliches Fundament gegenseitiger Fürsorge.`;

export const CONCORDIA_PILLARS: ConcordiaPillar[] = [
  {
    id: "pillar-1",
    number: "I",
    latinTitle: "Animus Dimittendi",
    title: "Der Mut zum Loslassen",
    subtitle: "Überwindung der alten Ordnung und Beseitigung historischer Vorbehalte",
    iconName: "Shield",
    philosophicalConcept: "Der Friede beginnt nicht mit Verträgen auf Papier, sondern mit der bewussten Absage an alte Ressentiments, vererbten Hochmut und historische Revancheansprüche. Die Kante der Abgrenzung wird durch mutiges Vertrauen verlassen.",
    spiritualMetaphor: "Der Schritt ins Unbekannte – das Aufgeben der Kontrollillusion. Es bedarf keines gewagten Sturzes ins Bodenlose mehr, wenn der Geist erkennt, dass die scheinbare Leere zwischen den Menschen bereits durch gegenseitige Ehrfurcht ausgefüllt ist.",
    diplomaticGoal: "Beilegung aller symbolischen und historiographischen Konfliktlinien zwischen europäischen Dynastien, Kulturräumen und Nachbarvölkern durch feierliche Deklaration des endgültigen Rechts- und Territorialfriedens.",
    practicalMeasures: [
      "Verzicht auf revanchistische Rhetorik und historiographische Einseitigkeit in Archiven und Publikationen",
      "Gemeinsame Erklärung zur Unantastbarkeit der territorialen Integrität und kulturellen Souveränität aller europäischen Völker",
      "Umwandlung ehemals umstrittener Grenzfestungen und Dynastiesitze in offene Stätten transnationaler Begegnung"
    ],
    historicalPrecedents: [
      "Westfälischer Friede von 1648 (Prinzip der 'Amnestia universalis' – ewiges Vergessen des erlittenen Unrechts)",
      "Elysée-Vertrag von 1963 als Fundament deutsch-französischer Erbfeindschaftsüberwindung"
    ]
  },
  {
    id: "pillar-2",
    number: "II",
    latinTitle: "Lustratio Memoriae",
    title: "Die Läuterung der Geschichte",
    subtitle: "Das klärende Element des Friedens und die Heilung historischer Narben",
    iconName: "Sparkles",
    philosophicalConcept: "So wie flüssiges, reines Wasser die Wucht jedes Aufpralls dämpft und trübe Verkrustungen abwäscht, so dämpft der Geist der Versöhnung die Schärfe historischer Traumata. Archive werden von Waffenkammern des Vorwurfs zu Werkstätten des gemeinsamen Verstehens.",
    spiritualMetaphor: "Die heilsame Immersion: Altes Misstrauen, Neid und ererbte Bitterkeit werden im ozeanischen Strom der Vergebung geläutert, ohne die Erinnerung an die Opfer der Geschichte auszulöschen.",
    diplomaticGoal: "Etablierung eines gesamteuropäischen Netzwerks historiographischer Wahrheit und Transparenz, das die gemeinsame Kulturgeschichte als verbindenden Schatz begreift.",
    practicalMeasures: [
      "Digitalisierung und barrierefreie wissenschaftliche Öffnung der 335 Adels- und Schlossarchive für Forscher aller Nationen",
      "Gemeinsame Ausstellungen transnationaler Dynastieverflechtungen zur Verdeutlichung der europäischen Schicksalsgemeinschaft",
      "Gemeinsame Gedenkstätten für kriegerische Schlachten früherer Jahrhunderte als Mahnmale der Eintracht"
    ],
    historicalPrecedents: [
      "Versöhnungsarbeit der International Commission on Nobility and Royalty (ICNR)",
      "Gemeinsame deutsch-polnische und deutsch-französische Schulbuchkommissionen"
    ]
  },
  {
    id: "pillar-3",
    number: "III",
    latinTitle: "Matrix Caritatis",
    title: "Das unerschütterliche Fundament",
    subtitle: "Die elastische Matrix der Nächstenliebe und des gegenseitigen Schutzes",
    iconName: "HeartHandshake",
    philosophicalConcept: "Ein Fundament, das elastisch, seidenweich und zugleich unzerreißbar ist: Wenn ein Volk, eine Region oder eine Gemeinschaft in existentielle Not, Krieg oder Naturkatastrophe gerät, trifft sie nicht auf harten Stein, sondern wird von der geschlossenen Solidarität aller aufgefangen.",
    spiritualMetaphor: "Das unzerbrechliche Trampolin der Barmherzigkeit: Jeder kinetische Stoß von Zerstörung und Verzweiflung wird absorbiert und verlustfrei in aufbauende Lebenskraft, Wärme und Fürsorge transformiert.",
    diplomaticGoal: "Ein multilaterales Schutzbündnis der Kulturstiftungen und humanitären Träger, das Notleidenden beisteht, humanitäre Korridore garantiert und Kulturgüter vor Zerstörung bewahrt.",
    practicalMeasures: [
      "Schaffung des 'Concordia-Kulturgüter- & Humanitätsfonds' zur Soforthilfe in Krisenregionen",
      "Erklärung aller registrierten Residenzen, Schlossmuseen und Kulturdenkmäler zu unantastbaren humanitären Schutzzonen nach der Haager Konvention",
      "Gegenseitige Beistandsklausel im Katastrophenfall: Mobilisierung ziviler und humanitärer Hilfsnetze der europäischen Stiftungen"
    ],
    historicalPrecedents: [
      "Johanniter- und Malteserorden als überstaatliche Hospital- und Rettungsbündnisse seit fast einem Jahrtausend",
      "Haager Konvention zum Schutz von Kulturgut bei bewaffneten Konflikten von 1954"
    ]
  },
  {
    id: "pillar-4",
    number: "IV",
    latinTitle: "Familia Gentium Sempiterna",
    title: "Die ewige Völkerfamilie",
    subtitle: "Der Zustand des ruhenden Friedens über Epochen und Generationen hinweg",
    iconName: "Globe",
    philosophicalConcept: "Vollkommener Friede verlangt keine Gleichmacherei und keinen Identitätsverlust. Jedes Haus, jede Nation, jede Kultur behält ihre angestammte Sprache, Tracht und Geschichte – vollendet als vielstimmiger Chor in einer gemeinsamen, unzertrennlichen Familie.",
    spiritualMetaphor: "Die Überwindung der Zeit: Das Band der Liebe umspannt Vergangenheit, Gegenwart und Zukunft. Niemand muss mehr ins Leere springen, denn die Liebe hält alles im ewigen Miteinander zusammen.",
    diplomaticGoal: "Ein dauerhafter Runder Tisch der europäischen Eintracht (Conventus Concordiae Europae), an dem Stiftungsvertreter, Bürgergesellschaft und Repräsentanten der Völker im Geiste der Nächstenliebe zusammenwirken.",
    practicalMeasures: [
      "Jährlicher 'Conventus Europaeus' an wechselnden geschichtsträchtigen Residenzen (z.B. Wien, Florenz, Versailles, Krakau)",
      "Verleihung des 'Großen Concordia-Friedenspreises' für herausragende Verdienste um Völkerverständigung und Kulturbrücken",
      "Generationen-Bildungsinitiative: Stipendien und Austauschprogramme für junge Europäer an den Trägerorten europäischen Erbes"
    ],
    historicalPrecedents: [
      "Paneuropa-Idee von Richard Coudenhove-Kalergi und Otto von Habsburg",
      "Pax Neoburgica und europäische Fürstenkonvente zur Friedenswahrung"
    ]
  }
];

export const MASTERPLAN_PHASES: MasterPlanPhase[] = [
  {
    phaseNumber: 1,
    codeName: "OPERATIO DECLARATIO",
    timeHorizon: "Monate 1 – 6",
    title: "Proklamation der Charta & Stiftungsnetzwerk",
    summary: "Verbreitung des Manifests 'Acta Concordiae Europae' an die 335 registrierten Adelsarchive, Schlossstiftungen und europäischen Kulturträger. Aufbau des gemeinsamen Koordinationsrats.",
    deliverables: [
      "Versand des offiziellen Anschreibens und der Friedens-Charta an alle Stiftungsverwaltungen",
      "Konstituierung des digitalen Concordia-Archivportals zum grenzüberschreitenden Quellenaustausch",
      "Veröffentlichung der ersten 100 Erstunterzeichner aus Kultur, Wissenschaft und Traditionshäusern"
    ],
    institutionsInvolved: [
      "Kulturstiftung Haus Habsburg (Wien)",
      "Stiftung Preußischer Kulturbesitz & Haus Hohenzollern",
      "Fondazione Palazzo Strozzi / Medici-Archive (Florenz)",
      "Fundación Casa de Alba (Madrid)",
      "Kulturfonds Fürstenhaus Liechtenstein (Vaduz)"
    ],
    impactMetric: "Ziel: Mindestens 150 beteiligte Institutionen aus über 20 europäischen Ländern im ersten Semester."
  },
  {
    phaseNumber: 2,
    codeName: "OPERATIO CONVENTUS",
    timeHorizon: "Monate 7 – 18",
    title: "Der Erste Friedenskonvent der Völkerfamilie",
    summary: "Einberufung des ersten physischen und hybriden 'Conventus Concordiae Europae' an einem geschichtsträchtigen Ort europäischer Versöhnung (z.B. Hofburg Wien oder Schloss Chambord).",
    deliverables: [
      "Verabschiedung der 'Charta der Eintracht und des gegenseitigen Schutzes'",
      "Feierliche Erneuerung historischer Versöhnungsakte über alte Bruchlinien hinweg",
      "Gründung des multilateralen 'Concordia-Schieds- und Mediationsrats' für Kulturgüter und Kulturerbe"
    ],
    institutionsInvolved: [
      "Königliche Stiftungen der Niederlande, Belgiens und Schwedens",
      "Polnische Aristokratie-Stiftungen (Radziwiłł, Czartoryski, Zamoyski)",
      "Römische Fürstenhäuser & Vatikanische Archivstiftungen",
      "Böhmische & Mährische Adelsverbände (Schwarzenberg, Lobkowitz)"
    ],
    impactMetric: "Ziel: Vollständige Ratifizierung der Charta durch 250 Stiftungen und Kulturorganisationen."
  },
  {
    phaseNumber: 3,
    codeName: "OPERATIO CARITAS & REFUGIUM",
    timeHorizon: "Monate 19 – 36",
    title: "Aktivierung der elastischen Schutz- & Solidarmatrix",
    summary: "Praktischer Aufbau des Notfall- und Hilfsnetzwerks: Mobilisierung von Stiftungsvermögen und Liegenschaften zur Unterstützung von Notleidenden, Kulturdenkmalen und friedensfördernden Projekten.",
    deliverables: [
      "Aufbau eines humanitären Notfallfonds für bedrohte Kulturschätze und Notleidende",
      "Ausweisung von über 500 europäischen Schlossgütern als 'Kulturrefugien der Menschheit'",
      "Schaffung grenzüberschreitender Ausbildungs- und Meisterklassen für Restaurierung, Geschichtsbildung und Friedenspädagogik"
    ],
    institutionsInvolved: [
      "Europäische Denkmal- und Schlossvereinigungen (European Historic Houses)",
      "Malteser- und Johanniter-Hilfswerke",
      "UNESCO-Welterbestätten in privater und stiftischer Trägerschaft",
      "Wissenschaftliche Akademien und Staatsarchive"
    ],
    impactMetric: "Ziel: Greifbare humanitäre Unterstützung für 50.000 Menschen und Schutz von 100 gefährdeten Monumenten."
  },
  {
    phaseNumber: 4,
    codeName: "OPERATIO SEMPITERNA",
    timeHorizon: "Dauerhaft & Zukunftsgerichtet",
    title: "Das generationenübergreifende Bündnis der Eintracht",
    summary: "Feste Verankerung des Friedens- und Nächstenliebe-Prinzips in den Stiftungssatzungen, Schulen und Universitäten Europas. Die Völkerfamilie agiert dauerhaft als unzerreißbare Einheit.",
    deliverables: [
      "Rechtliche Verankerung des Friedens- und Schutzauftrags in den Satzungen der Familienstiftungen",
      "Etablierung der jährlichen 'Europäischen Friedenswoche der Kulturdenkmäler'",
      "Übergabe der Präsidentschaft an die nächste Generation junger Friedensbotschafter"
    ],
    institutionsInvolved: [
      "Europäische Jugend- & Studentennetzwerke",
      "Internationale Friedensakademien",
      "Zivile Gesellschaft und Kommunen der historischen Residenzstädte"
    ],
    impactMetric: "Ziel: Unumstößlicher Friedens- und Kooperationsstandard für die nächsten Jahrhunderte."
  }
];

export const PEACE_HOUSE_BRIDGES: PeaceHouseBridge[] = [
  {
    houseName: "Haus Habsburg-Lothringen",
    region: "DACH & Heiliges Römisches Reich",
    country: "Österreich",
    historicRole: "Träger der kaiserlichen Krone über Jahrhunderte, Herrscher über ein Vielvölkermitteleuropa.",
    peaceMissionToday: "Vorkämpfer für ein geeintes, grenzenloses Europa der Regionen und Versöhnung zwischen Ost und West.",
    institutionRef: "Paneuropa-Union & Otto-von-Habsburg-Stiftung",
    symbolicContribution: "Das Bekenntnis zur Einheit in Vielfalt – Schutz aller Minderheiten und Kultursprachen."
  },
  {
    houseName: "Haus Hohenzollern",
    region: "DACH & Heiliges Römisches Reich",
    country: "Deutschland",
    historicRole: "Könige von Preußen und Deutsche Kaiser; prägten das moderne europäische Staatswesen.",
    peaceMissionToday: "Öffnung des kulturellen Erbes, Dialog mit den Nachbarländern Polen und Frankreich.",
    institutionRef: "Stiftung Preußischer Kulturbesitz & Schloss Cecilienhof",
    symbolicContribution: "Vom preußischen Pflichtbewusstsein zum Dienst am friedlichen Völkerverständnis."
  },
  {
    houseName: "Haus Bourbon / Borbón",
    region: "Italien, Spanien, Portugal",
    country: "Spanien / Frankreich",
    historicRole: "Herrscherhaus Frankreichs, Spaniens, Neapels und Parmas; prägten das barocke Europa.",
    peaceMissionToday: "Verfassungsmäßiger Garant von Demokratie und Stabilität im heutigen Spanien; transatlantische Kulturbrücke.",
    institutionRef: "Fundación Princesa de Asturias & Patrimonio Nacional",
    symbolicContribution: "Verleihung weltweiter Friedens- und Eintrachtspreise (Premio Princesa de Asturias de la Concordia)."
  },
  {
    houseName: "Haus Czartoryski & Radziwiłł",
    region: "Skandinavien, Osteuropa, Russland",
    country: "Polen / Litauen",
    historicRole: "Mächtigste Magnatengeschlechter der polnisch-litauischen Adelsrepublik (Rzeczpospolita).",
    peaceMissionToday: "Symbol für demokratische Adelsfreiheit, Rettung polnischer Nationalschätze und Brücke zu Litauen und der Ukraine.",
    institutionRef: "Princes Czartoryski Museum (Krakau) & Schloss Nieborów",
    symbolicContribution: "Schutz der geistigen Freiheit und Zuflucht für bedrohte europäische Kunstwerke."
  },
  {
    houseName: "Haus Bernadotte",
    region: "Skandinavien, Osteuropa, Russland",
    country: "Schweden",
    historicRole: "Könige von Schweden und Norwegen seit den napoleonischen Kriegen.",
    peaceMissionToday: "Über 200 Jahre ununterbrochene schwedische Friedens- und Neutralitätstradition; Humanitäre Missionen.",
    institutionRef: "Folke Bernadotte Academy (FBA) & Kungliga Hovstaterna",
    symbolicContribution: "Graf Folke Bernadottes humanitärer Geist (Weiße Busse 1945): Rettung von Menschenleben über alle Feindeslinien hinweg."
  },
  {
    houseName: "Haus Medici & Strozzi",
    region: "Italien, Spanien, Portugal",
    country: "Italien",
    historicRole: "Pioniere der europäischen Renaissance, Mäzene von Kunst, Philosophie und Wissenschaft.",
    peaceMissionToday: "Kulturelle Begegnungsstätten von Weltruf in Florenz; Humanismus als geistiges Fundament des Friedens.",
    institutionRef: "Fondazione Palazzo Strozzi & Galleria degli Uffizi",
    symbolicContribution: "Wiedererweckung des humanistischen Menschenbildes – Schönheit und Weisheit als Schutzschild gegen Barbarei."
  }
];
