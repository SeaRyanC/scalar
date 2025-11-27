import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { Note, ScaleType, Orientation } from '../types';
import { MANDOLIN_TUNING, FRET_COUNT, generateFretboardNotes, getEnharmonicDisplay } from '../musicTheory';

interface FretboardProps {
  rootNote: Note;
  scale: ScaleType;
  orientation: Orientation;
  showNoteNames: boolean;
}

export function Fretboard({ rootNote, scale, orientation, showNoteNames }: FretboardProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const notes = generateFretboardNotes(rootNote, scale);

    // Dimensions
    const stringCount = MANDOLIN_TUNING.length;
    const fretCount = FRET_COUNT + 1; // include open position

    const isHorizontal = orientation === 'horizontal';
    
    // Sizing
    const fretWidth = isHorizontal ? 50 : 40;
    const stringSpacing = isHorizontal ? 40 : 50;
    const padding = 60;
    const noteRadius = 14;

    // Calculate SVG dimensions
    const fretboardWidth = fretCount * fretWidth;
    const fretboardHeight = (stringCount - 1) * stringSpacing;
    
    const svgWidth = isHorizontal 
      ? fretboardWidth + padding * 2 
      : fretboardHeight + padding * 2;
    const svgHeight = isHorizontal 
      ? fretboardHeight + padding * 2 
      : fretboardWidth + padding * 2;

    svg.attr('width', svgWidth).attr('height', svgHeight);

    const g = svg.append('g')
      .attr('transform', `translate(${padding}, ${padding})`);

    // Helper to get position based on orientation
    const getX = (fret: number, stringIdx: number) => 
      isHorizontal ? fret * fretWidth : stringIdx * stringSpacing;
    const getY = (fret: number, stringIdx: number) => 
      isHorizontal ? stringIdx * stringSpacing : fret * fretWidth;

    // Draw fret lines
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const x1 = isHorizontal ? fret * fretWidth : 0;
      const y1 = isHorizontal ? 0 : fret * fretWidth;
      const x2 = isHorizontal ? fret * fretWidth : fretboardHeight;
      const y2 = isHorizontal ? fretboardHeight : fret * fretWidth;

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', fret === 0 ? '#333' : '#999')
        .attr('stroke-width', fret === 0 ? 4 : 1);
    }

    // Draw strings
    for (let stringIdx = 0; stringIdx < stringCount; stringIdx++) {
      const x1 = isHorizontal ? 0 : stringIdx * stringSpacing;
      const y1 = isHorizontal ? stringIdx * stringSpacing : 0;
      const x2 = isHorizontal ? fretboardWidth : stringIdx * stringSpacing;
      const y2 = isHorizontal ? stringIdx * stringSpacing : fretboardWidth;

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#8B7355')
        .attr('stroke-width', 2 + stringIdx * 0.5); // Thicker strings for lower notes
    }

    // Draw fret position markers (at frets 3, 5, 7, 10, 12, 15, 17)
    const markerFrets = [3, 5, 7, 10, 12, 15, 17];
    const doubleMarkerFrets = [12]; // Double dot

    markerFrets.forEach(fret => {
      if (fret > FRET_COUNT) return;
      
      const markerX = isHorizontal 
        ? (fret - 0.5) * fretWidth 
        : fretboardHeight / 2;
      const markerY = isHorizontal 
        ? fretboardHeight / 2 
        : (fret - 0.5) * fretWidth;

      if (doubleMarkerFrets.includes(fret)) {
        // Double markers for octave fret
        const offset = stringSpacing;
        
        if (isHorizontal) {
          // Offset vertically (along cy) for horizontal orientation
          g.append('circle')
            .attr('cx', markerX)
            .attr('cy', markerY - offset)
            .attr('r', 6)
            .attr('fill', '#ddd');
          
          g.append('circle')
            .attr('cx', markerX)
            .attr('cy', markerY + offset)
            .attr('r', 6)
            .attr('fill', '#ddd');
        } else {
          // Offset horizontally (along cx) for vertical orientation
          g.append('circle')
            .attr('cx', markerX - offset)
            .attr('cy', markerY)
            .attr('r', 6)
            .attr('fill', '#ddd');
          
          g.append('circle')
            .attr('cx', markerX + offset)
            .attr('cy', markerY)
            .attr('r', 6)
            .attr('fill', '#ddd');
        }
      } else {
        g.append('circle')
          .attr('cx', markerX)
          .attr('cy', markerY)
          .attr('r', 6)
          .attr('fill', '#ddd');
      }
    });

    // Draw fret numbers
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const textX = isHorizontal ? fret * fretWidth : -30;
      const textY = isHorizontal ? -25 : fret * fretWidth;

      g.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#666')
        .text(fret === 0 ? 'Open' : fret);
    }

    // Draw string labels (tuning)
    for (let stringIdx = 0; stringIdx < stringCount; stringIdx++) {
      const labelX = isHorizontal ? -35 : stringIdx * stringSpacing;
      const labelY = isHorizontal ? stringIdx * stringSpacing : -30;

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', '#333')
        .text(getEnharmonicDisplay(MANDOLIN_TUNING[stringIdx]));
    }

    // Draw note circles
    notes.forEach(note => {
      const x = getX(note.fret, note.stringIndex);
      const y = getY(note.fret, note.stringIndex);

      if (note.isInScale) {
        // Root notes: black fill with white text
        // Non-root scale notes: white fill with black text (inverse)
        const fillColor = note.isRoot ? '#000' : '#fff';
        const strokeColor = '#000';
        const textColor = note.isRoot ? '#fff' : '#000';

        // Note circle
        g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', noteRadius)
          .attr('fill', fillColor)
          .attr('stroke', strokeColor)
          .attr('stroke-width', 2);

        // Note name (if enabled)
        if (showNoteNames) {
          g.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .attr('fill', textColor)
            .text(getEnharmonicDisplay(note.note));
        }
      }
    });

  }, [rootNote, scale, orientation, showNoteNames]);

  // Calculate dynamic container height
  const isHorizontal = orientation === 'horizontal';
  const containerStyle = {
    ...styles.container,
    overflowX: isHorizontal ? 'auto' as const : 'visible' as const,
    overflowY: !isHorizontal ? 'auto' as const : 'visible' as const,
  };

  return (
    <div style={containerStyle}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

const styles: Record<string, preact.JSX.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
