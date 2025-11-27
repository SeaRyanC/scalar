import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { Note } from '../types';
import { CIRCLE_OF_FIFTHS, getEnharmonicDisplay } from '../musicTheory';

interface CircleOfFifthsProps {
  selectedKey: Note;
  onSelectKey: (key: Note) => void;
}

export function CircleOfFifths({ selectedKey, onSelectKey }: CircleOfFifthsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 280;
    const height = 280;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 120;
    const innerRadius = 70;

    svg.attr('width', width).attr('height', height);

    // Create group centered in SVG
    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Title
    svg.append('text')
      .attr('x', centerX)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#333')
      .text('Circle of Fifths');

    // Draw the circle segments
    const pie = d3.pie<Note>()
      .value(() => 1)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<Note>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const arcs = g.selectAll('.arc')
      .data(pie(CIRCLE_OF_FIFTHS))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .style('cursor', 'pointer');

    // Add segments
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data === selectedKey ? '#333' : '#f8f8f8')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .on('click', (_, d) => onSelectKey(d.data))
      .on('mouseenter', function(_, d) {
        if (d.data !== selectedKey) {
          d3.select(this).attr('fill', '#e0e0e0');
        }
      })
      .on('mouseleave', function(_, d) {
        d3.select(this).attr('fill', d.data === selectedKey ? '#333' : '#f8f8f8');
      });

    // Add labels
    const labelArc = d3.arc<d3.PieArcDatum<Note>>()
      .innerRadius((outerRadius + innerRadius) / 2)
      .outerRadius((outerRadius + innerRadius) / 2);

    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .attr('fill', d => d.data === selectedKey ? '#fff' : '#333')
      .attr('pointer-events', 'none')
      .text(d => getEnharmonicDisplay(d.data));

    // Center label showing selected key
    g.append('circle')
      .attr('r', innerRadius - 5)
      .attr('fill', '#f8f8f8')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '28px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text(getEnharmonicDisplay(selectedKey));

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', 28)
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text('selected key');

  }, [selectedKey, onSelectKey]);

  return (
    <div style={styles.container}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

const styles: Record<string, preact.JSX.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'center',
  },
};
