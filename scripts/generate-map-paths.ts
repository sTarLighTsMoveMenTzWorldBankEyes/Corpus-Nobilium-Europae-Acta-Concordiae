import * as topojson from 'topojson-client';
import * as d3 from 'd3-geo';
import fs from 'fs';

// Map ISO / TopoJSON names to the German names in our noble houses directory
export const COUNTRY_MAPPING: Record<string, { germanName: string; region: string }> = {
  DE: { germanName: 'Deutschland', region: 'DACH & Heiliges Römisches Reich' },
  AT: { germanName: 'Österreich', region: 'DACH & Heiliges Römisches Reich' },
  LI: { germanName: 'Liechtenstein', region: 'DACH & Heiliges Römisches Reich' },
  CH: { germanName: 'Schweiz', region: 'DACH & Heiliges Römisches Reich' },
  CZ: { germanName: 'Tschechien', region: 'DACH & Heiliges Römisches Reich' },
  HU: { germanName: 'Ungarn', region: 'DACH & Heiliges Römisches Reich' },
  SK: { germanName: 'Slowakei', region: 'DACH & Heiliges Römisches Reich' },
  
  IT: { germanName: 'Italien', region: 'Italien, Spanien, Portugal' },
  ES: { germanName: 'Spanien', region: 'Italien, Spanien, Portugal' },
  PT: { germanName: 'Portugal', region: 'Italien, Spanien, Portugal' },
  MC: { germanName: 'Monaco', region: 'Italien, Spanien, Portugal' },
  SM: { germanName: 'San Marino', region: 'Italien, Spanien, Portugal' },
  VA: { germanName: 'Vatikan', region: 'Italien, Spanien, Portugal' },

  FR: { germanName: 'Frankreich', region: 'Frankreich, Benelux, UK' },
  GB: { germanName: 'Großbritannien', region: 'Frankreich, Benelux, UK' },
  IE: { germanName: 'Irland', region: 'Frankreich, Benelux, UK' },
  BE: { germanName: 'Belgien', region: 'Frankreich, Benelux, UK' },
  NL: { germanName: 'Niederlande', region: 'Frankreich, Benelux, UK' },
  LU: { germanName: 'Luxemburg', region: 'Frankreich, Benelux, UK' },

  PL: { germanName: 'Polen', region: 'Skandinavien, Osteuropa, Russland' },
  SE: { germanName: 'Schweden', region: 'Skandinavien, Osteuropa, Russland' },
  NO: { germanName: 'Norwegen', region: 'Skandinavien, Osteuropa, Russland' },
  DK: { germanName: 'Dänemark', region: 'Skandinavien, Osteuropa, Russland' },
  FI: { germanName: 'Finnland', region: 'Skandinavien, Osteuropa, Russland' },
  RU: { germanName: 'Russland', region: 'Skandinavien, Osteuropa, Russland' },
  EE: { germanName: 'Estland', region: 'Skandinavien, Osteuropa, Russland' },
  LV: { germanName: 'Lettland', region: 'Skandinavien, Osteuropa, Russland' },
  LT: { germanName: 'Litauen', region: 'Skandinavien, Osteuropa, Russland' },
  RO: { germanName: 'Rumänien', region: 'Skandinavien, Osteuropa, Russland' },
  UA: { germanName: 'Ukraine', region: 'Skandinavien, Osteuropa, Russland' },
  BY: { germanName: 'Belarus', region: 'Skandinavien, Osteuropa, Russland' },
  HR: { germanName: 'Kroatien', region: 'DACH & Heiliges Römisches Reich' },
  SI: { germanName: 'Slowenien', region: 'DACH & Heiliges Römisches Reich' },
  BG: { germanName: 'Bulgarien', region: 'Skandinavien, Osteuropa, Russland' },
  GR: { germanName: 'Griechenland', region: 'Italien, Spanien, Portugal' },
  BA: { germanName: 'Bosnien und Herzegowina', region: 'DACH & Heiliges Römisches Reich' },
  RS: { germanName: 'Serbien', region: 'Skandinavien, Osteuropa, Russland' },
  ME: { germanName: 'Montenegro', region: 'Italien, Spanien, Portugal' },
  AL: { germanName: 'Albanien', region: 'Italien, Spanien, Portugal' },
  MK: { germanName: 'Nordmazedonien', region: 'Skandinavien, Osteuropa, Russland' }
};

async function run() {
  const res = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson');
  const topoData = await res.json() as any;

  // Convert TopoJSON to GeoJSON FeatureCollection
  const geojson = topojson.feature(topoData, topoData.objects.europe) as any;

  // Setup D3 projection for Europe
  // Width 960, Height 680
  const width = 960;
  const height = 680;

  // Conic Conformal or Mercator projection centered around central Europe (approx 11°E, 54°N)
  const projection = d3.geoConicConformal()
    .center([13, 53])
    .parallels([35, 65])
    .rotate([-10, 0])
    .scale(1020)
    .translate([width / 2, height / 2 + 30]);

  const pathGenerator = d3.geoPath().projection(projection);

  const countryPaths: any[] = [];

  for (const feature of geojson.features) {
    const id = feature.id as string;
    const name = feature.properties.NAME as string;
    const path = pathGenerator(feature);
    
    // Calculate centroid
    let centroid = pathGenerator.centroid(feature);
    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
      centroid = [0, 0];
    }

    // Round path numbers to 1 decimal place to optimize size
    const cleanPath = path ? path.replace(/([0-9]+\.[0-9]{2,})/g, (match) => parseFloat(match).toFixed(1)) : '';

    const mapping = COUNTRY_MAPPING[id];

    countryPaths.push({
      id,
      name,
      germanName: mapping ? mapping.germanName : name,
      region: mapping ? mapping.region : 'Europa',
      path: cleanPath,
      center: [Math.round(centroid[0]), Math.round(centroid[1])]
    });
  }

  // Filter out countries far outside Europe like Israel/Azerbaijan/Armenia/Georgia if desired, or keep relevant
  const filtered = countryPaths.filter(c => c.path && !['IL', 'AZ', 'AM', 'GE', 'CY', 'TR'].includes(c.id));

  console.log(`Generated ${filtered.length} country paths.`);
  console.log('Sample center:', filtered.find(c => c.id === 'DE'));

  const fileContent = `// Pre-projected SVG paths for Europe vector map
// Coordinate space: 960 x 680 (D3 geoConicConformal)

export interface EuropeCountryPath {
  id: string;
  name: string;
  germanName: string;
  region: string;
  path: string;
  center: [number, number];
}

export const EUROPE_MAP_DIMENSIONS = {
  width: 960,
  height: 680,
  viewBox: "0 0 960 680"
};

export const EUROPE_COUNTRY_PATHS: EuropeCountryPath[] = ${JSON.stringify(filtered, null, 2)};
`;

  fs.writeFileSync('src/data/europe-map-paths.ts', fileContent, 'utf-8');
  console.log('Successfully written to src/data/europe-map-paths.ts');
}

run().catch(console.error);
