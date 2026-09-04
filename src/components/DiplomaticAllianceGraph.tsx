import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sliders, 
  Search, 
  X, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Shield, 
  Crown, 
  Sparkles, 
  Info,
  Compass,
  Download,
  Filter,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { House, Region, DiplomaticStatus, DiplomaticGraphNode, DiplomaticGraphLink, AllianceType } from '../types';
import { buildDiplomaticAllianceGraph, REGION_GRAPH_COLORS } from '../utils/graphUtils';

interface DiplomaticAllianceGraphProps {
  houses: House[];
  onInspectHouse?: (house: House) => void;
  onInspectHouseByName?: (name: string) => void;
  isDiplomacyMode?: boolean;
}

export const DiplomaticAllianceGraph: React.FC<DiplomaticAllianceGraphProps> = ({
  houses,
  onInspectHouse,
  onInspectHouseByName,
  isDiplomacyMode
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter and Layout States
  const [statusFilter, setStatusFilter] = useState<'ACTIVE_ONLY' | 'ACTIVE_CONSULTING' | 'ALL'>('ACTIVE_CONSULTING');
  const [regionFilter, setRegionFilter] = useState<Region | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minConnections, setMinConnections] = useState<number>(0);
  const [layoutMode, setLayoutMode] = useState<'force' | 'radial' | 'circular' | 'bipartite'>('force');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Physics Simulation Sliders
  const [chargeStrength, setChargeStrength] = useState<number>(-220);
  const [linkDistance, setLinkDistance] = useState<number>(85);
  const [collisionRadius, setCollisionRadius] = useState<number>(24);

  // Interactive Selection States
  const [hoveredNode, setHoveredNode] = useState<DiplomaticGraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<DiplomaticGraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<DiplomaticGraphLink | null>(null);

  // Zoom reference
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Compute graph data based on filters
  const filterStatuses: DiplomaticStatus[] = useMemo(() => {
    if (statusFilter === 'ACTIVE_ONLY') return ['Active'];
    if (statusFilter === 'ACTIVE_CONSULTING') return ['Active', 'Consulting'];
    return ['Active', 'Consulting', 'Observing'];
  }, [statusFilter]);

  const graphData = useMemo(() => {
    return buildDiplomaticAllianceGraph(houses, filterStatuses, regionFilter, minConnections);
  }, [houses, filterStatuses, regionFilter, minConnections]);

  // Handle D3 Force Simulation render
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = isFullscreen ? window.innerHeight - 180 : 640;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    svg.attr('width', width).attr('height', height);

    // Create defs for glow filters and gradients
    const defs = svg.append('defs');

    // Glow Filter for Gold
    const filterGold = defs.append('filter').attr('id', 'glow-gold').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filterGold.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMergeGold = filterGold.append('feMerge');
    feMergeGold.append('feMergeNode').attr('in', 'coloredBlur');
    feMergeGold.append('feMergeNode').attr('in', 'SourceGraphic');

    // Glow Filter for Emerald (Active status)
    const filterEmerald = defs.append('filter').attr('id', 'glow-emerald').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filterEmerald.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'coloredBlur');
    const feMergeEmerald = filterEmerald.append('feMerge');
    feMergeEmerald.append('feMergeNode').attr('in', 'coloredBlur');
    feMergeEmerald.append('feMergeNode').attr('in', 'SourceGraphic');

    // Main Zoomable Group
    const g = svg.append('g').attr('class', 'zoom-group');

    // Setup Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 6])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Clone data for D3 mutation
    const nodes: DiplomaticGraphNode[] = graphData.nodes.map(d => ({ ...d }));
    const links: DiplomaticGraphLink[] = graphData.links.map(d => ({ ...d }));

    // Link ID map for fast lookup
    const neighborMap = new Map<string, Set<string>>();
    nodes.forEach(n => neighborMap.set(n.id, new Set()));

    links.forEach(l => {
      const sId = typeof l.source === 'string' ? l.source : (l.source as DiplomaticGraphNode).id;
      const tId = typeof l.target === 'string' ? l.target : (l.target as DiplomaticGraphNode).id;
      neighborMap.get(sId)?.add(tId);
      neighborMap.get(tId)?.add(sId);
    });

    // Configure D3 Force Simulation
    const simulation = d3.forceSimulation<DiplomaticGraphNode>(nodes);

    if (layoutMode === 'force') {
      simulation
        .force('link', d3.forceLink<DiplomaticGraphNode, DiplomaticGraphLink>(links)
          .id(d => d.id)
          .distance(d => linkDistance / (d.strength || 1) * 1.2)
        )
        .force('charge', d3.forceManyBody().strength(chargeStrength))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(d => (d as DiplomaticGraphNode).radius + collisionRadius));
    } else if (layoutMode === 'radial') {
      // Group by region in radial orbits
      const regionsList: Region[] = Object.keys(REGION_GRAPH_COLORS) as Region[];
      simulation
        .force('link', d3.forceLink<DiplomaticGraphNode, DiplomaticGraphLink>(links).id(d => d.id).distance(60))
        .force('charge', d3.forceManyBody().strength(-150))
        .force('r', d3.forceRadial<DiplomaticGraphNode>(
          d => {
            const idx = regionsList.indexOf(d.region);
            return 80 + idx * 75;
          },
          width / 2,
          height / 2
        ).strength(0.8))
        .force('collide', d3.forceCollide().radius(d => (d as DiplomaticGraphNode).radius + 12));
    } else if (layoutMode === 'circular') {
      // Ring layout
      const radius = Math.min(width, height) * 0.38;
      nodes.forEach((n, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI;
        n.fx = width / 2 + radius * Math.cos(angle);
        n.fy = height / 2 + radius * Math.sin(angle);
      });
      simulation
        .force('link', d3.forceLink<DiplomaticGraphNode, DiplomaticGraphLink>(links).id(d => d.id))
        .force('collide', d3.forceCollide().radius(18));
    } else if (layoutMode === 'bipartite') {
      // Active on left, Consulting on right
      nodes.forEach(n => {
        if (n.status === 'Active') {
          n.fx = width * 0.3 + (Math.random() - 0.5) * 80;
        } else {
          n.fx = width * 0.7 + (Math.random() - 0.5) * 80;
        }
      });
      simulation
        .force('link', d3.forceLink<DiplomaticGraphNode, DiplomaticGraphLink>(links).id(d => d.id).distance(80))
        .force('charge', d3.forceManyBody().strength(-120))
        .force('y', d3.forceY(height / 2).strength(0.1))
        .force('collide', d3.forceCollide().radius(d => (d as DiplomaticGraphNode).radius + 10));
    }

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const linkElements = linkGroup.selectAll<SVGLineElement, DiplomaticGraphLink>('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => {
        if (d.type === 'PEACE_TREATY') return '#10B981'; // Green Peace
        if (d.type === 'CONCORDIA_BRIDGE') return '#E5C170'; // Gold Concordia
        if (d.type === 'MARRIAGE_UNION') return '#EC4899'; // Pink Marriage
        if (d.type === 'DIPLOMATIC_PACT') return '#3B82F6'; // Blue Pact
        return '#CBD5E1';
      })
      .attr('stroke-width', d => Math.max(1.2, (d.strength || 1) * 0.9))
      .attr('stroke-opacity', 0.55)
      .attr('stroke-dasharray', d => d.type === 'CONCORDIA_BRIDGE' ? '4,4' : 'none')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedLink(d);
      })
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', (d.strength || 1) * 2 + 1);
        setSelectedLink(d);
      })
      .on('mouseleave', function(event, d) {
        d3.select(this)
          .attr('stroke-opacity', 0.55)
          .attr('stroke-width', Math.max(1.2, (d.strength || 1) * 0.9));
      });

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll<SVGGElement, DiplomaticGraphNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .style('opacity', d => {
        if (!isDiplomacyMode) return 1;
        return d.status === 'Active' ? 1 : 0.22;
      });

    // Node outer glow / status halo ring
    nodeElements.append('circle')
      .attr('r', d => d.radius + (d.status === 'Active' ? 5 : 2))
      .attr('fill', 'none')
      .attr('stroke', d => d.status === 'Active' ? '#10B981' : d.status === 'Consulting' ? '#F59E0B' : '#94A3B8')
      .attr('stroke-width', d => d.status === 'Active' ? 2.5 : 1.5)
      .attr('stroke-opacity', d => d.status === 'Active' ? 0.9 : 0.6)
      .attr('filter', d => d.status === 'Active' ? 'url(#glow-emerald)' : 'none');

    // Main Node Circle
    nodeElements.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', '#FAF6EE')
      .attr('stroke-width', 2);

    // Inner icon symbol (Crown for Active, Shield for Consulting)
    nodeElements.append('text')
      .text(d => d.status === 'Active' ? '👑' : '🛡️')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', d => `${Math.max(9, d.radius * 0.7)}px`)
      .style('pointer-events', 'none');

    // Node Label
    nodeElements.append('text')
      .text(d => d.name)
      .attr('x', d => d.radius + 6)
      .attr('y', '0.35em')
      .attr('font-family', 'Cormorant Garamond, serif')
      .attr('font-weight', 'bold')
      .attr('font-size', d => d.status === 'Active' ? '12px' : '10px')
      .attr('fill', '#1A1215')
      .attr('stroke', '#FAF6EE')
      .attr('stroke-width', 3)
      .attr('paint-order', 'stroke')
      .style('pointer-events', 'none')
      .style('opacity', d => d.status === 'Active' || d.connectionCount! > 3 ? 1 : 0.8);

    // Drag Behaviors
    const drag = d3.drag<SVGGElement, DiplomaticGraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (layoutMode === 'force') {
          // Keep pinned position for user control
          d.fx = event.x;
          d.fy = event.y;
        }
      });

    nodeElements.call(drag);

    // Hover & Selection Interactive Events
    nodeElements
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);

        const neighbors = neighborMap.get(d.id) || new Set();

        // Highlight connected nodes & links, dim others
        nodeElements.style('opacity', n => n.id === d.id || neighbors.has(n.id) ? 1 : 0.15);
        linkElements
          .style('opacity', l => {
            const sId = typeof l.source === 'string' ? l.source : (l.source as DiplomaticGraphNode).id;
            const tId = typeof l.target === 'string' ? l.target : (l.target as DiplomaticGraphNode).id;
            return sId === d.id || tId === d.id ? 1 : 0.08;
          })
          .attr('stroke-width', l => {
            const sId = typeof l.source === 'string' ? l.source : (l.source as DiplomaticGraphNode).id;
            const tId = typeof l.target === 'string' ? l.target : (l.target as DiplomaticGraphNode).id;
            return sId === d.id || tId === d.id ? (l.strength || 1) * 2 + 1 : 1;
          });
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        nodeElements.style('opacity', 1);
        linkElements.style('opacity', 0.55).attr('stroke-width', l => Math.max(1.2, (l.strength || 1) * 0.9));
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        const originalHouse = houses.find(h => h.id === d.id);
        if (originalHouse && onInspectHouse) {
          onInspectHouse(originalHouse);
        } else if (onInspectHouseByName) {
          onInspectHouseByName(d.name);
        }
      });

    // Tick Handler
    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => (d.source as DiplomaticGraphNode).x!)
        .attr('y1', d => (d.source as DiplomaticGraphNode).y!)
        .attr('x2', d => (d.target as DiplomaticGraphNode).x!)
        .attr('y2', d => (d.target as DiplomaticGraphNode).y!);

      nodeElements.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Cleanup on unmount or re-render
    return () => {
      simulation.stop();
    };
  }, [graphData, layoutMode, chargeStrength, linkDistance, collisionRadius, isFullscreen, houses, isDiplomacyMode]);

  // Zoom control helpers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.35);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.75);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  // Search and focus node
  const handleSearchFocus = (houseName: string) => {
    setSearchQuery(houseName);
    if (!houseName) return;

    const targetNode = graphData.nodes.find(n => n.name.toLowerCase().includes(houseName.toLowerCase()));
    if (targetNode && svgRef.current && zoomBehaviorRef.current) {
      setSelectedNode(targetNode);
      const width = containerRef.current?.clientWidth || 900;
      const height = isFullscreen ? window.innerHeight - 180 : 640;
      
      const x = targetNode.x || width / 2;
      const y = targetNode.y || height / 2;
      const scale = 2.2;

      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity.translate(width / 2 - x * scale, height / 2 - y * scale).scale(scale)
        );
    }
  };

  return (
    <div 
      id="diplomatic-alliance-graph-container"
      ref={containerRef}
      className={`relative bg-[#FAF7F0] border border-[#DFCDB7] rounded-2xl shadow-md overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 bg-[#FAF7F0] overflow-auto' : 'p-5 sm:p-6'
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E3D9C9] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1215] text-[#E5C170] text-xs font-semibold uppercase tracking-wider">
            <Network className="w-3.5 h-3.5 text-[#E5C170]" />
            <span>D3.js Allianzen- & Friedensnetzwerk</span>
          </div>

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1215]">
            Interaktiver Dynastie- & Diplomatie-Graph (Acta Concordiae)
          </h3>

          <p className="text-xs text-[#6B5A4B] leading-relaxed max-w-3xl">
            Visualisiert die dynamischen diplomatischen Bündnisse, historischen Friedensverträge (u.a. Westfälischer Friede 1648, Wiener Kongress 1815) 
            und Erbverbrüderungen zwischen den <strong>Active</strong> (grün leuchtend) und <strong>Consulting</strong> (bernsteinfarben) Adelshäusern.
          </p>
        </div>

        {/* Top Metric Indicators & View Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{graphData.nodes.filter(n => n.status === 'Active').length} Active</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-950 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{graphData.nodes.filter(n => n.status === 'Consulting').length} Consulting</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-300 text-xs text-stone-800 font-semibold flex items-center gap-1.5">
            <Share2 className="w-3 h-3 text-[#8B1E2F]" />
            <span>{graphData.links.length} Allianzen</span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-white border border-[#D8CCBA] text-[#5C4C3E] hover:bg-[#F4ECE1] text-xs transition-colors cursor-pointer"
            title={isFullscreen ? 'Vollbild beenden' : 'Vollbildmodus'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter and Configuration Toolbar */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#EBE3D3] text-xs">
        {/* Status Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#D8CCBA]">
          <button
            onClick={() => setStatusFilter('ACTIVE_ONLY')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'ACTIVE_ONLY' ? 'bg-[#8B1E2F] text-white shadow-2xs' : 'text-[#5C4C3E] hover:bg-stone-100'
            }`}
          >
            👑 Nur Active ({houses.filter(h => (h.DiplomaticStatus || h.diplomaticStatus) === 'Active').length})
          </button>

          <button
            onClick={() => setStatusFilter('ACTIVE_CONSULTING')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'ACTIVE_CONSULTING' ? 'bg-[#8B1E2F] text-white shadow-2xs' : 'text-[#5C4C3E] hover:bg-stone-100'
            }`}
          >
            🛡️ Active + Consulting
          </button>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-[#8B1E2F] text-white shadow-2xs' : 'text-[#5C4C3E] hover:bg-stone-100'
            }`}
          >
            Alle Status
          </button>
        </div>

        {/* Layout Modes */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#8B1E2F] uppercase tracking-wider">Layout:</span>
          <select
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value as any)}
            className="px-2.5 py-1 bg-white border border-[#D8CCBA] rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#8B1E2F] cursor-pointer"
          >
            <option value="force">🌌 Kräftebasiert (Force-Directed)</option>
            <option value="radial">🪐 Regionale Sternhaufen (Radial)</option>
            <option value="circular">⭕ Friedens-Kreis (Ring)</option>
            <option value="bipartite">⚖️ Bipartit: Active ↔ Consulting</option>
          </select>
        </div>

        {/* Region Filter Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#8B1E2F] uppercase tracking-wider">Region:</span>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value as any)}
            className="px-2.5 py-1 bg-white border border-[#D8CCBA] rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#8B1E2F] cursor-pointer max-w-[200px] truncate"
          >
            <option value="ALL">🌐 Alle Großregionen</option>
            <option value="DACH & Heiliges Römisches Reich">🏰 DACH & HRR</option>
            <option value="Italien, Spanien, Portugal">🏛️ Italien & Iberien</option>
            <option value="Frankreich, Benelux, UK">⚜️ Frankreich, Benelux & UK</option>
            <option value="Skandinavien, Osteuropa, Russland">🌲 Nord- & Osteuropa</option>
            <option value="Weltweit (Asien, Afrika, Amerika, Naher Osten)">🌍 Global Dynasties</option>
          </select>
        </div>

        {/* Search within Graph */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Haus im Graph suchen..."
            value={searchQuery}
            onChange={(e) => handleSearchFocus(e.target.value)}
            className="w-full pl-8 pr-7 py-1 rounded-lg bg-white border border-[#D8CCBA] text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#8B1E2F]"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchFocus('')}
              className="absolute right-2 top-2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative w-full bg-[#FCFBF8] border border-[#E3D8C8] rounded-xl overflow-hidden mt-3">
        {/* The SVG Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full block select-none"
          style={{ minHeight: isFullscreen ? 'calc(100vh - 260px)' : '580px' }}
        />

        {/* Floating Zoom & Canvas Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-[#DFCDB7] shadow-md z-10">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-stone-100 text-[#4A3B2C] transition-colors cursor-pointer"
            title="Vergrößern"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-stone-100 text-[#4A3B2C] transition-colors cursor-pointer"
            title="Verkleinern"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetZoom}
            className="p-2 rounded-lg hover:bg-stone-100 text-[#8B1E2F] transition-colors cursor-pointer"
            title="Ansicht zentrieren & zurücksetzen"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="border-t border-stone-200 my-1" />

          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showControls ? 'bg-[#8B1E2F] text-white' : 'hover:bg-stone-100 text-[#4A3B2C]'
            }`}
            title="Physik- und Simulationsregler ein-/ausblenden"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay on Bottom Left */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-[#DFCDB7] shadow-sm z-10 text-[11px] space-y-2 max-w-xs pointer-events-auto">
          <div className="font-semibold text-[#1A1215] flex items-center justify-between border-b border-stone-200 pb-1">
            <span>Legende der Allianzen</span>
            <span className="text-[10px] text-stone-500">{graphData.nodes.length} Knoten</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded" />
              <span>Friedensvertrag</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 rounded" />
              <span>Concordia-Brücke</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-pink-500 rounded" />
              <span>Heiratsallianz</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 rounded" />
              <span>Diplomatischer Pakt</span>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-1 flex items-center justify-between text-[10px] text-stone-500">
            <span>🟢 Active (Souverän/Initiator)</span>
            <span>🟡 Consulting (Archiv/Rat)</span>
          </div>
        </div>

        {/* Physics Tuning Sliders Panel */}
        {showControls && layoutMode === 'force' && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#DFCDB7] shadow-lg z-10 text-xs space-y-3 w-64 animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold text-[#1A1215] border-b border-stone-200 pb-1.5">
              <span className="flex items-center gap-1 text-[#8B1E2F]">
                <Sliders className="w-3.5 h-3.5" />
                <span>Physik-Regler (Kräfte)</span>
              </span>
              <button
                onClick={() => setShowControls(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Abstoßungskraft (Repulsion):</span>
                <span className="font-mono">{chargeStrength}</span>
              </div>
              <input
                type="range"
                min="-600"
                max="-50"
                value={chargeStrength}
                onChange={(e) => setChargeStrength(Number(e.target.value))}
                className="w-full accent-[#8B1E2F] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Bündnisdistanz (Link Distance):</span>
                <span className="font-mono">{linkDistance}px</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                value={linkDistance}
                onChange={(e) => setLinkDistance(Number(e.target.value))}
                className="w-full accent-[#8B1E2F] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Kollisionsradius (Abstand):</span>
                <span className="font-mono">{collisionRadius}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={collisionRadius}
                onChange={(e) => setCollisionRadius(Number(e.target.value))}
                className="w-full accent-[#8B1E2F] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Min. Verbindungen:</span>
                <span className="font-mono">{minConnections}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={minConnections}
                onChange={(e) => setMinConnections(Number(e.target.value))}
                className="w-full accent-[#8B1E2F] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Selected / Hovered Node Callout Card */}
        {hoveredNode && (
          <div className="absolute top-4 right-20 bg-[#1A1115] text-[#FAF6EE] p-4 rounded-xl border border-[#C5A059] shadow-2xl z-20 text-xs max-w-sm space-y-2 pointer-events-none animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-2 border-b border-[#3D252E] pb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  hoveredNode.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                }`}>
                  {hoveredNode.status === 'Active' ? '👑 Active' : '🛡️ Consulting'}
                </span>
                <span className="text-[11px] text-[#C5A059] font-sans">{hoveredNode.country}</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">{hoveredNode.connectionCount || 0} Allianzen</span>
            </div>

            <h4 className="font-serif font-bold text-base text-[#FAF6EE]">
              {hoveredNode.name}
            </h4>

            {hoveredNode.period && (
              <div className="text-[11px] text-[#D8CCA9] italic">
                {hoveredNode.period}
              </div>
            )}

            {hoveredNode.significance && (
              <p className="text-[11px] text-[#B8AA98] leading-relaxed line-clamp-3">
                {hoveredNode.significance}
              </p>
            )}

            <div className="text-[10px] text-[#E5C170] pt-1 flex items-center justify-between border-t border-[#3D252E]">
              <span>Klicken für volles Diplomatie-Dossier</span>
              <span>↗</span>
            </div>
          </div>
        )}

        {/* Selected Link Detail Modal Card */}
        {selectedLink && !hoveredNode && (
          <div className="absolute bottom-4 right-4 bg-[#1A1115] text-[#FAF6EE] p-4 rounded-xl border border-[#C5A059] shadow-2xl z-20 text-xs max-w-md space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-[#3D252E] pb-1.5">
              <span className="text-[11px] font-bold text-[#E5C170] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Bündnis & Vertragspakt</span>
              </span>
              <button
                onClick={() => setSelectedLink(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="font-serif font-bold text-sm text-[#FAF6EE]">
              {selectedLink.label} {selectedLink.treatyYear && `(${selectedLink.treatyYear})`}
            </div>

            <p className="text-[11px] text-[#D8CCA9] leading-relaxed">
              {selectedLink.historicalContext}
            </p>

            <div className="text-[10px] text-stone-400 pt-1 flex items-center justify-between">
              <span>Bündnisstärke: <strong>{'★'.repeat(selectedLink.strength || 1)}</strong></span>
              <span className="text-emerald-400 font-semibold">Gültig im Rahmen der Acta Concordiae</span>
            </div>
          </div>
        )}
      </div>

      {/* Diplomatic Framework Summary Bar */}
      <div className="bg-[#FAF6EE] border border-[#DFCDB7] rounded-xl p-4 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-semibold text-[#8B1E2F] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Diplomatische Kohäsion im Friedenswerk der Acta Concordiae</span>
          </span>
          <p className="text-[#5C4C3E] text-[11px] leading-relaxed">
            Jede Linie repräsentiert ein rechtlich-dynastisches oder völkerrechtliches Bündnis, das jahrhundertelange Kriege beendete und im heutigen Friedensmanifest reaktiviert wird.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSearchFocus('Habsburg')}
            className="px-3 py-1.5 bg-white border border-[#D8CCBA] rounded-lg text-xs font-semibold text-[#1A1215] hover:border-[#8B1E2F] cursor-pointer"
          >
            Fokus: Habsburg
          </button>
          <button
            onClick={() => handleSearchFocus('Hohenzollern')}
            className="px-3 py-1.5 bg-white border border-[#D8CCBA] rounded-lg text-xs font-semibold text-[#1A1215] hover:border-[#8B1E2F] cursor-pointer"
          >
            Fokus: Hohenzollern
          </button>
          <button
            onClick={() => handleSearchFocus('Bourbon')}
            className="px-3 py-1.5 bg-white border border-[#D8CCBA] rounded-lg text-xs font-semibold text-[#1A1215] hover:border-[#8B1E2F] cursor-pointer"
          >
            Fokus: Bourbon
          </button>
        </div>
      </div>
    </div>
  );
};
