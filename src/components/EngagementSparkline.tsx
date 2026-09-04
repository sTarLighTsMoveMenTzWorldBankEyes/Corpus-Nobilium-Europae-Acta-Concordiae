import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface EngagementSparklineProps {
  houseId?: string | number;
  houseName?: string;
  status?: string;
  width?: number;
  height?: number;
}

export const EngagementSparkline: React.FC<EngagementSparklineProps> = ({
  houseId = '1',
  houseName = '',
  status = 'Consulting',
  width = 110,
  height = 30
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Generate deterministic 5-year engagement data (2022 - 2026) based on houseName/id/status
    const seed = (houseName || String(houseId)).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseVal = status === 'Active' ? 70 : status === 'Founding' ? 85 : 45;
    
    const data = [
      { year: '22', value: Math.max(20, Math.min(100, baseVal - 25 + (seed % 20))) },
      { year: '23', value: Math.max(20, Math.min(100, baseVal - 15 + ((seed * 3) % 25))) },
      { year: '24', value: Math.max(20, Math.min(100, baseVal - 5 + ((seed * 7) % 20))) },
      { year: '25', value: Math.max(20, Math.min(100, baseVal + 5 + ((seed * 11) % 15))) },
      { year: '26', value: Math.max(20, Math.min(100, baseVal + 15 + ((seed * 13) % 15))) }
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 4, right: 4, bottom: 4, left: 4 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scalePoint()
      .domain(data.map(d => d.year))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Area generator for smooth gradient under line
    const area = d3.area<{ year: string; value: number }>()
      .x(d => x(d.year) || 0)
      .y0(innerHeight)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3.line<{ year: string; value: number }>()
      .x(d => x(d.year) || 0)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const color = status === 'Active' ? '#059669' : status === 'Founding' ? '#C5A059' : '#8C7A6B';

    // Append gradient
    const defs = svg.append('defs');
    const gradientId = `spark-gradient-${String(houseId).replace(/[^a-zA-Z0-9]/g, '')}`;
    const grad = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    grad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.35);

    grad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.0);

    // Draw Area
    g.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area);

    // Draw Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Draw end point circle
    const lastPoint = data[data.length - 1];
    g.append('circle')
      .attr('cx', x(lastPoint.year) || 0)
      .attr('cy', y(lastPoint.value))
      .attr('r', 3)
      .attr('fill', color);

  }, [houseId, houseName, status, width, height]);

  return (
    <div className="inline-flex items-center gap-1.5 bg-[#FAF6EE] px-2 py-1 rounded-md border border-[#E3D9C9] shadow-2xs" title="5-Jahres-Aktivitäts-Trend im Acta Concordiae Verbund">
      <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
      <span className="text-[10px] font-mono text-[#6C5D50]" title="Trend letzter 5 Jahre">
        {status === 'Active' ? '↗ +24%' : status === 'Founding' ? '↑ Stab.' : '↗ Akitv'}
      </span>
    </div>
  );
};
