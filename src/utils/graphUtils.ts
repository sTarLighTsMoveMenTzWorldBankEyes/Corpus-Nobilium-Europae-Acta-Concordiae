import { House, DiplomaticStatus, Region, DiplomaticGraphNode, DiplomaticGraphLink, GraphData, AllianceType } from '../types';

// Region Colors for visually distinguishing regional spheres
export const REGION_GRAPH_COLORS: Record<Region, string> = {
  'DACH & Heiliges Römisches Reich': '#8B1E2F', // Imperial Burgundy
  'Italien, Spanien, Portugal': '#C27803', // Mediterranean Gold / Ochre
  'Frankreich, Benelux, UK': '#1D4ED8', // Royal Cobalt Blue
  'Skandinavien, Osteuropa, Russland': '#047857', // Emerald Nordic / Slavic Green
  'Weltweit (Asien, Afrika, Amerika, Naher Osten)': '#9333EA' // Imperial Purple / Universal Violet
};

/**
 * Builds the graph dataset (nodes and links) for D3 force simulation.
 * Includes all Active and Consulting houses, and optionally Observing houses.
 */
export function buildDiplomaticAllianceGraph(
  houses: House[],
  filterStatuses: DiplomaticStatus[] = ['Active', 'Consulting'],
  selectedRegion: Region | 'ALL' = 'ALL',
  minConnections: number = 0
): GraphData {
  // Filter eligible houses
  const eligibleHouses = houses.filter(h => {
    const status = h.DiplomaticStatus || h.diplomaticStatus || 'Consulting';
    if (!filterStatuses.includes(status)) return false;
    if (selectedRegion !== 'ALL' && h.region !== selectedRegion) return false;
    return true;
  });

  const nodeMap = new Map<string, DiplomaticGraphNode>();

  // Create Nodes
  eligibleHouses.forEach(h => {
    const status = h.DiplomaticStatus || h.diplomaticStatus || 'Consulting';
    const isSovereign = h.status?.includes('Regierend') || h.type?.includes('Kaiser') || h.type?.includes('König');
    
    // Radius based on status and rank
    let radius = 10;
    if (status === 'Active') radius = isSovereign ? 18 : 14;
    else if (status === 'Consulting') radius = 11;
    else radius = 8;

    const node: DiplomaticGraphNode = {
      id: h.id,
      name: h.name,
      region: h.region,
      country: h.country,
      status: status,
      type: h.type,
      coatOfArms: h.crestMotif,
      period: h.period,
      residence: h.seat,
      email: h.email,
      significance: h.description,
      radius,
      color: REGION_GRAPH_COLORS[h.region] || '#8B1E2F',
      connectionCount: 0
    };

    nodeMap.set(h.id, node);
  });

  const links: DiplomaticGraphLink[] = [];
  const addedLinks = new Set<string>();

  const addLink = (
    sourceId: string,
    targetId: string,
    type: AllianceType,
    label: string,
    historicalContext: string,
    strength: number,
    treatyYear?: string
  ) => {
    if (!nodeMap.has(sourceId) || !nodeMap.has(targetId)) return;
    if (sourceId === targetId) return;

    const linkKey = [sourceId, targetId].sort().join('---');
    if (addedLinks.has(linkKey)) return;
    addedLinks.add(linkKey);

    links.push({
      source: sourceId,
      target: targetId,
      type,
      label,
      historicalContext,
      strength,
      treatyYear
    });

    const sNode = nodeMap.get(sourceId);
    const tNode = nodeMap.get(targetId);
    if (sNode) sNode.connectionCount = (sNode.connectionCount || 0) + 1;
    if (tNode) tNode.connectionCount = (tNode.connectionCount || 0) + 1;
  };

  // 1. Foundational European Peace Treaties & Dynastic Pacts
  // Westphalian Peace (1648)
  addLink('habsburg-lothringen', 'wittelsbach', 'PEACE_TREATY', 'Westfälischer Friede (1648)', 'Ewige Beilegung der Reichskonflikte & bayerische Kurfürstenwürde', 5, '1648');
  addLink('habsburg-lothringen', 'hohenzollern', 'PEACE_TREATY', 'Reichsfriedensordnung & Breslauer Vertrag', 'Mächteausgleich im Heiligen Römischen Reich', 5, '1742');
  addLink('habsburg-lothringen', 'bourbon-france', 'MARRIAGE_UNION', 'Renversement des Alliances (1756)', 'Historische Versöhnung Habsburg-Bourbon & Heirat Marie-Antoinette', 5, '1756');
  addLink('habsburg-lothringen', 'borbon-espana', 'MARRIAGE_UNION', 'Casa d’Austria Verbrüderung', 'Gemeinsame burgundisch-spanische Erbfolge & Goldenes Vlies', 5, '1516');
  addLink('habsburg-lothringen', 'liechtenstein', 'DIPLOMATIC_PACT', 'Souveränitätsvertrag & Reichsfürstenrat', 'Anerkennung der reichsunmittelbaren Souveränität Liechtensteins', 4, '1719');
  addLink('habsburg-lothringen', 'schwarzenberg', 'DIPLOMATIC_PACT', 'Hofkriegsrat & Pentarchie', 'Fürst Karl Philipp zu Schwarzenberg als Oberbefehlshaber der Völkerschlacht', 4, '1813');
  addLink('habsburg-lothringen', 'esterhazy', 'DIPLOMATIC_PACT', 'Ungarischer Magnatenbund', 'Palatine von Ungarn und Patronage der Reichskultur', 4, '1687');
  addLink('habsburg-lothringen', 'lobkowicz', 'DIPLOMATIC_PACT', 'Böhmische Hofkanzlei', 'Reichsfürstenwürde und kaiserliche Ministerpräsidentschaft', 4, '1624');
  addLink('habsburg-lothringen', 'trauttmansdorff', 'PEACE_TREATY', 'Münsteraner Friedensdelegation', 'Graf Maximilian von Trauttmansdorff als kaiserlicher Hauptverhandler 1648', 5, '1648');
  addLink('habsburg-lothringen', 'windisch-graetz', 'DIPLOMATIC_PACT', 'Reichshofrat & Militärkommandantur', 'Feldmarschall Fürst Alfred zu Windisch-Graetz', 3, '1848');
  addLink('habsburg-lothringen', 'starhemberg', 'PEACE_TREATY', 'Entsatz von Wien (1683)', 'Graf Ernst Rüdiger von Starhemberg verteidigt die Reichshauptstadt', 5, '1683');
  addLink('habsburg-lothringen', 'khevenhueller', 'DIPLOMATIC_PACT', 'Kärntner Landesverteidigungspakt', 'Erbland-Diplomatie und Festungsbund Hochosterwitz', 3, '1763');

  // Hohenzollern Alliances
  addLink('hohenzollern', 'wettin', 'MARRIAGE_UNION', 'Mitteldeutsche Erbverbrüderung', 'Eheverbindungen zwischen Preußen und Sachsen', 4, '1688');
  addLink('hohenzollern', 'welfen', 'MARRIAGE_UNION', 'Personalunion & Norddeutsche Allianz', 'Heirat Friedrich Wilhelms I. mit Sophie Dorothea von Hannover', 5, '1706');
  addLink('hohenzollern', 'oranien-nassau', 'MARRIAGE_UNION', 'Oranier-Erbe & Preußische Schutzmacht', 'Heirat des Großen Kurfürsten mit Luise Henriette von Oranien', 5, '1646');
  addLink('hohenzollern', 'bernadotte', 'DIPLOMATIC_PACT', 'Allianz der Befreiungskriege (1813)', 'Karl Johann (Bernadotte) und Friedrich Wilhelm III. gegen Napoleon', 4, '1813');
  addLink('hohenzollern', 'romanow', 'MARRIAGE_UNION', 'Heilige Allianz & Zarenbündnis', 'Heirat Charlotte von Preußen (Alexandra Feodorowna) mit Zar Nikolaus I.', 5, '1817');
  addLink('hohenzollern', 'bismarck', 'DIPLOMATIC_PACT', 'Reichsgründung 1871', 'Bismarcksches Bündnissystem zur Friedenswahrung Mitteleuropas', 5, '1871');
  addLink('hohenzollern', 'czartoryski', 'DIPLOMATIC_PACT', 'Berliner Kongress & Radziwiłł-Palais', 'Antoni Radziwiłł als Statthalter des Großherzogtums Posen', 4, '1815');

  // Wittelsbach Network
  addLink('wittelsbach', 'savoia', 'MARRIAGE_UNION', 'Alpenquerende Dynastie-Union', 'Heirat Henriette Adelheid von Savoyen mit Kurfürst Ferdinand Maria', 4, '1650');
  addLink('wittelsbach', 'wettin', 'DIPLOMATIC_PACT', 'Kaiserwahl-Koalition (1742)', 'Kurfürstenrat zur Wahl Karls VII. Albrecht zum Kaiser', 4, '1742');
  addLink('wittelsbach', 'thurn-und-taxis', 'CONCORDIA_BRIDGE', 'Bayerisches Postregal & Residenz', 'Regensburger Fürstenbund und Patronat über St. Emmeram', 4, '1806');
  addLink('wittelsbach', 'loewenstein', 'MARRIAGE_UNION', 'Wittelsbacher Hauspakt', 'Anerkennung der morganatischen Nebenlinie Löwenstein', 3, '1460');
  addLink('wittelsbach', 'fugger', 'DIPLOMATIC_PACT', 'Augsburger Finanzpakt', 'Finanzierung der bayerischen Renaissance-Residenzen', 4, '1568');
  addLink('wittelsbach', 'toerring', 'DIPLOMATIC_PACT', 'Bayerischer Staatsrat', 'Grafen zu Toerring als leitende Minister und Marschälle Bayerns', 3, '1777');

  // Wettin Network
  addLink('wettin', 'sachsen-coburg-gotha', 'REGIONAL_CONFEDERATION', 'Ernestinischer Gesamtbund', 'Gemeinsame Stammresidenz und Verfassungstradition Thüringens', 5, '1826');
  addLink('wettin', 'sachsen-weimar-eisenach', 'REGIONAL_CONFEDERATION', 'Weimarer Klassik & Kulturstiftung', 'Gemeinsamer Schutz der thüringischen Geistes- und Universitätskultur', 4, '1775');
  addLink('wettin', 'windsor', 'MARRIAGE_UNION', 'Dynastische Krone Großbritanniens', 'Prinz Albert von Sachsen-Coburg heiratet Königin Victoria', 5, '1840');
  addLink('wettin', 'belgien-sachsen-coburg', 'MARRIAGE_UNION', 'Königsthron von Belgien (1831)', 'Leopold I. von Sachsen-Coburg wird erster König der Belgier', 5, '1831');
  addLink('wettin', 'braganca', 'MARRIAGE_UNION', 'Portugiesische Thronunion (1836)', 'Prinz Ferdinand von Sachsen-Coburg wird König Ferdinand II. von Portugal', 4, '1836');

  // Bourbon & Southern Sphere
  addLink('bourbon-france', 'borbon-espana', 'MARRIAGE_UNION', 'Pacte de Famille (1761)', 'Ewiger Beistandspakt der bourbonischen Königshäuser', 5, '1761');
  addLink('borbon-espana', 'borbon-dos-sicilias', 'REGIONAL_CONFEDERATION', 'Königreich beider Sizilien', 'Sekundogenitur der spanischen Bourbonen im Süden Italiens', 5, '1734');
  addLink('borbon-espana', 'borbon-parma', 'REGIONAL_CONFEDERATION', 'Herzogtum Parma & Piacenza', 'Don Felipe begründet die regierende Linie Bourbon-Parma', 5, '1748');
  addLink('borbon-espana', 'alba', 'DIPLOMATIC_PACT', 'Granden von Spanien 1. Klasse', 'Herzöge von Alba als oberste Ratgeber und Generalkapitäne', 5, '1472');
  addLink('borbon-espana', 'medinaceli', 'DIPLOMATIC_PACT', 'Castellana-Krone & Stiftungen', 'Bewahrung des königlich-kastilischen Erbes und Kulturzentren', 4, '1520');
  addLink('borbon-espana', 'medina-sidonia', 'DIPLOMATIC_PACT', 'Seeverteidigung & Sanlúcar', 'Oberbefehl über die spanischen Flotten und Atlantikpforten', 4, '1588');
  addLink('borbon-espana', 'infantado', 'DIPLOMATIC_PACT', 'Mendoza-Schutzpakt', 'Humanistisches Mäzenatentum und Erhaltung des plateresken Erbes', 4, '1475');
  addLink('borbon-espana', 'grimaldi', 'DIPLOMATIC_PACT', 'Mittelmeer-Schutzvertrag', 'Anerkennung der monegassischen Unabhängigkeit', 4, '1524');

  // Italian Patricians & Papal Dynasties
  addLink('medici', 'sforza', 'PEACE_TREATY', 'Friede von Lodi (1454)', 'Begründung des italienischen Gleichgewichts zwischen Mailand und Florenz', 5, '1454');
  addLink('medici', 'colonna', 'DIPLOMATIC_PACT', 'Kardinalskollegium & Kirchenstaat', 'Gemeinsame Pontifikate und Schutz der Renaissance-Kunst', 4, '1513');
  addLink('medici', 'orsini', 'MARRIAGE_UNION', 'Florentinisch-Römische Heirat', 'Lorenzo il Magnifico heiratet Clarice Orsini', 5, '1469');
  addLink('medici', 'bourbon-france', 'MARRIAGE_UNION', 'Königinnen von Frankreich', 'Katharina von Medici und Maria de’ Medici als Regentinnen Frankreichs', 5, '1533');
  addLink('colonna', 'orsini', 'PEACE_TREATY', 'Pax Romana der Barone (1511)', 'Historischer Friedensschluss der beiden erbittertsten Rivalen Roms', 5, '1511');
  addLink('doria-pamphilj', 'spinola', 'REGIONAL_CONFEDERATION', 'Republik Genua Alberghi', 'Gemeinsame Leitung der genuesischen Flotte und Bankwesen', 4, '1528');
  addLink('borghese', 'chigi', 'DIPLOMATIC_PACT', 'Römischer Hochbarock & Petersplatz', 'Kardinal Scipione Borghese & Papst Alexander VII. Chigi', 4, '1655');
  addLink('farnese', 'borbon-parma', 'MARRIAGE_UNION', 'Farnesisches Erbe an Bourbon', 'Elisabetta Farnese bringt das Herzogtum Parma an Spanien', 5, '1714');
  addLink('savoia', 'grimaldi', 'DIPLOMATIC_PACT', 'Nizzardischer Grenzpakt', 'Beistand und Neutralitätsgarantie an der Côte d’Azur', 4, '1641');
  addLink('strozzi', 'medici', 'PEACE_TREATY', 'Florentinischer Stadtfriede', 'Aussöhnung nach den Exilkonflikten der Renaissance', 4, '1537');
  addLink('antinori', 'frescobaldi', 'REGIONAL_CONFEDERATION', 'Toskanischer Kultur- & Weinbaukonvent', 'Über 600 Jahre ununterbrochene florentinische Traditionspflege', 4, '1385');

  // Western & Nordic Networks
  addLink('windsor', 'oranien-nassau', 'PEACE_TREATY', 'Glorious Revolution (1688)', 'Wilhelm III. von Oranien und Maria II. besteigen den englischen Thron', 5, '1689');
  addLink('windsor', 'bernadotte', 'DIPLOMATIC_PACT', 'Nordische Neutralitätsallianz', 'Enge verwandtschaftliche und diplomatische Brücke UK-Schweden', 4, '1905');
  addLink('windsor', 'gluecksburg-daenemark', 'MARRIAGE_UNION', 'Königliche Heirat (1863)', 'König Edward VII. heiratet Prinzessin Alexandra von Dänemark', 5, '1863');
  addLink('windsor', 'gluecksburg-norwegen', 'MARRIAGE_UNION', 'Norwegische Unabhängigkeit (1905)', 'Prinzessin Maud von Großbritannien wird Königin von Norwegen', 5, '1905');
  addLink('windsor', 'spencer-churchill', 'DIPLOMATIC_PACT', 'Blenheim-Sieg & Staatsführung', 'Sir Winston Churchill als Premierminister und Verteidiger der Freiheit', 5, '1940');
  addLink('windsor', 'howard-norfolk', 'DIPLOMATIC_PACT', 'Erb-Earl Marshal des Vereinigten Königreichs', 'Organisation aller königlichen Krönungszeremonien in Westminster Abbey', 5, '1483');
  addLink('windsor', 'cavendish-devonshire', 'DIPLOMATIC_PACT', 'Whig-Koalition & Kulturpatronat', 'Chatsworth House als Zentrum britischer Staatsdiplomatie', 4, '1689');
  addLink('windsor', 'percy-northumberland', 'DIPLOMATIC_PACT', 'Border Warden Pakt', 'Sicherung der schottisch-englischen Friedensgrenze', 4, '1603');
  addLink('windsor', 'campbell-argyll', 'DIPLOMATIC_PACT', 'Schottischer Krondienst', 'Erb-Großmeister des königlichen Haushalts in Schottland', 4, '1707');
  addLink('windsor', 'grosvenor-westminster', 'DIPLOMATIC_PACT', 'Westminster-Entwicklung & Philanthropie', 'Förderung ziviler Infrastruktur und Kunststiftungen', 4, '1874');

  // Benelux & French Noble Networks
  addLink('belgien-sachsen-coburg', 'merode', 'DIPLOMATIC_PACT', 'Gründungsverfassung Belgiens (1830)', 'Graf Félix de Merode in der Provisorischen Regierung Belgiens', 5, '1830');
  addLink('belgien-sachsen-coburg', 'ligne', 'DIPLOMATIC_PACT', 'Belgischer Hochadel & Europadiplomatie', 'Prinz Charles-Joseph de Ligne als Schiedsrichter Europas', 4, '1831');
  addLink('belgien-sachsen-coburg', 'arenberg-belgien', 'DIPLOMATIC_PACT', 'Leuven Kulturpakt', 'Stiftung Arenberg zur Erforschung europäischer Integration', 4, '1919');
  addLink('belgien-sachsen-coburg', 'croy-roeulx', 'DIPLOMATIC_PACT', 'Orden vom Goldenen Vlies', 'Bewahrung burgundischer Urkunden und Rittertradition', 4, '1830');
  addLink('oranien-nassau', 'wassenaer', 'DIPLOMATIC_PACT', 'Generalstaaten & Admiralität', 'Admiral Jacob van Wassenaer Obdam für die Republik der Sieben Provinzen', 4, '1665');
  addLink('nassau-weilburg-luxemburg', 'lannoy', 'MARRIAGE_UNION', 'Luxemburgische Thronfolgeheirat', 'Erbgroßherzog Guillaume heiratet Gräfin Stéphanie de Lannoy', 5, '2012');
  addLink('bourbon-france', 'rohan', 'DIPLOMATIC_PACT', 'Princes Étrangers am Hofe von Versailles', 'Kardinal Louis de Rohan und die Fürstbischöfe von Straßburg', 4, '1674');
  addLink('bourbon-france', 'la-rochefoucauld', 'DIPLOMATIC_PACT', 'Pairie de France & Geisteskultur', 'François VI. Herzog von La Rochefoucauld', 4, '1662');
  addLink('bourbon-france', 'noailles', 'DIPLOMATIC_PACT', 'Marschälle von Frankreich', 'Erhaltung von Schloss Maintenon und Diplomatie in Madrid', 4, '1693');
  addLink('bourbon-france', 'talleyrand', 'PEACE_TREATY', 'Wiener Kongress (1814/15)', 'Talleyrand sichert Frankreichs Gleichberechtigung in der Pentarchie', 5, '1815');

  // Eastern & Baltic Networks
  addLink('czartoryski', 'radziwill', 'MARRIAGE_UNION', 'Magnatenallianz der Rzeczpospolita', 'Mächtigstes Adelsbündnis in Polen-Litauen ("Familia")', 5, '1764');
  addLink('czartoryski', 'potocki', 'PEACE_TREATY', 'Verfassung vom 3. Mai 1791', 'Gemeinsame Ausarbeitung der ersten geschriebenen Verfassung Europas', 5, '1791');
  addLink('radziwill', 'sapieha', 'DIPLOMATIC_PACT', 'Großfürstentum Litauen Statut', 'Lew Sapieha und Mikołaj Radziwiłł kodifizieren die Gesetze', 4, '1588');
  addLink('czartoryski', 'zamoyski', 'DIPLOMATIC_PACT', 'Zamość-Akademie & Kulturrettung', 'Erhaltung polnischer Kunstsammlungen vor den Teilungen', 4, '1801');
  addLink('romanow', 'jussupow', 'DIPLOMATIC_PACT', 'Eremitage & Kunstmäzenatentum', 'Fürsten Jussupow als reichste Kunstförderer des Zarenreiches', 4, '1812');
  addLink('romanow', 'scheremetew', 'DIPLOMATIC_PACT', 'Feldmarschall-Dienst & Kuskowo', 'Boris Scheremetew siegt bei Poltawa (1709)', 4, '1709');
  addLink('romanow', 'golizyn', 'DIPLOMATIC_PACT', 'Gediminiden-Senat & Staatskanzlei', 'Fürsten Galitzin als oberste Diplomaten in Wien und Paris', 4, '1762');
  addLink('romanow', 'biron-kurland', 'DIPLOMATIC_PACT', 'Herzogtum Kurland und Semgallen', 'Ernst Johann von Biron erbaut Schloss Rundāle mit Rastrelli', 4, '1737');

  // Scandinavian Harmony
  addLink('gluecksburg-daenemark', 'gluecksburg-norwegen', 'REGIONAL_CONFEDERATION', 'Nordischer Friedensrat', 'Gemeinsamer Glücksburger Stamm für die Kronen Kopenhagens und Oslos', 5, '1905');
  addLink('gluecksburg-daenemark', 'bernadotte', 'MARRIAGE_UNION', 'Öresund-Friedensbrücke', 'Königin Ingrid von Dänemark (geb. Prinzessin von Schweden)', 5, '1935');
  addLink('bernadotte', 'oxenstierna', 'DIPLOMATIC_PACT', 'Schwedische Staatsverwaltungstradition', 'Kanzler Axel Oxenstierna begründet die moderne Verwaltung', 4, '1634');
  addLink('bernadotte', 'brahe', 'DIPLOMATIC_PACT', 'Premier Greve von Schweden', 'Per Brahe d.J. gründet Universitäten und Friedensgerichte', 4, '1650');
  addLink('gluecksburg-daenemark', 'reventlow-daenemark', 'DIPLOMATIC_PACT', 'Bauernbefreiung von 1788', 'Christian Ditlev Reventlow schafft die Schollengebundenheit ab', 4, '1788');
  addLink('gluecksburg-norwegen', 'wedel-jarlsberg', 'DIPLOMATIC_PACT', 'Verfassung von Eidsvoll (1814)', 'Graf Herman Wedel Jarlsberg als Gründervater der norwegischen Freiheit', 5, '1814');

  // Connecting cross-regional alliances into Acta Concordiae Peace bridges
  addLink('habsburg-lothringen', 'czartoryski', 'CONCORDIA_BRIDGE', 'Acta Concordiae Charta (2026)', 'Mitteleuropäisch-polnische Versöhnungsbrücke', 5, '2026');
  addLink('hohenzollern', 'bourbon-france', 'CONCORDIA_BRIDGE', 'Acta Concordiae Charta (2026)', 'Deutsch-französische Friedensachse der Kulturresidenzen', 5, '2026');
  addLink('liechtenstein', 'eulenburg', 'CONCORDIA_BRIDGE', 'Acta Concordiae Charta (2026)', 'Rheinisches und alpines Stiftungsnetzwerk', 4, '2026');
  addLink('fuerstenberg', 'thurn-und-taxis', 'CONCORDIA_BRIDGE', 'Acta Concordiae Charta (2026)', 'Süddeutsches Donau-Friedensbündnis', 4, '2026');
  addLink('oranien-nassau', 'belgien-sachsen-coburg', 'CONCORDIA_BRIDGE', 'Acta Concordiae Charta (2026)', 'Benelux-Friedensvertrag der Königshäuser', 5, '2026');
  addLink('borbon-espana', 'braganca', 'CONCORDIA_BRIDGE', 'Acta Concordiae Charta (2026)', 'Iberische Friedens- und Kulturbrücke', 5, '2026');
  addLink('savoia', 'borbon-dos-sicilias', 'CONCORDIA_BRIDGE', 'Acta Concordiae Charta (2026)', 'Italienischer Einheits- und Versöhnungsdialog', 4, '2026');

  // Automatic density linking for houses of the same country/region to guarantee rich connectivity
  const housesByCountry = new Map<string, House[]>();
  eligibleHouses.forEach(h => {
    const list = housesByCountry.get(h.country) || [];
    list.push(h);
    housesByCountry.set(h.country, list);
  });

  housesByCountry.forEach((countryHouses, countryName) => {
    if (countryHouses.length >= 2) {
      for (let i = 0; i < countryHouses.length; i++) {
        // Link to nearest 2 neighbors in same country
        for (let j = i + 1; j < Math.min(i + 3, countryHouses.length); j++) {
          const h1 = countryHouses[i];
          const h2 = countryHouses[j];
          addLink(
            h1.id,
            h2.id,
            'REGIONAL_CONFEDERATION',
            `Landesverband (${countryName})`,
            `Historische Nachbarschaft und gemeinsame Archivvernetzung in ${countryName}`,
            2
          );
        }
      }
    }
  });

  // Filter nodes if minConnections > 0
  let finalNodes = Array.from(nodeMap.values());
  if (minConnections > 0) {
    finalNodes = finalNodes.filter(n => (n.connectionCount || 0) >= minConnections);
    const validNodeIds = new Set(finalNodes.map(n => n.id));
    const finalLinks = links.filter(l => {
      const sId = typeof l.source === 'string' ? l.source : (l.source as DiplomaticGraphNode).id;
      const tId = typeof l.target === 'string' ? l.target : (l.target as DiplomaticGraphNode).id;
      return validNodeIds.has(sId) && validNodeIds.has(tId);
    });
    return { nodes: finalNodes, links: finalLinks };
  }

  return {
    nodes: finalNodes,
    links
  };
}
