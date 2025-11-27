import { Note, ScaleType } from './types';

// All 12 chromatic notes
export const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Circle of fifths order (clockwise from C)
export const CIRCLE_OF_FIFTHS: Note[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

// Scale intervals (semitones from root)
export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],        // W-W-H-W-W-W-H
  minor: [0, 2, 3, 5, 7, 8, 10],        // W-H-W-W-H-W-W (natural minor)
  pentatonic: [0, 2, 4, 7, 9],          // Major pentatonic
  blues: [0, 3, 5, 6, 7, 10],           // Blues scale
};

// Mandolin tuning (strings from low to high pitch): G, D, A, E (standard tuning)
// Each pair is tuned in unison, but we show 4 strings
export const MANDOLIN_TUNING: Note[] = ['G', 'D', 'A', 'E'];

export const FRET_COUNT = 17; // Typical mandolin fretboard

// Get the index of a note in the chromatic scale
export function getNoteIndex(note: Note): number {
  return NOTES.indexOf(note);
}

// Get note at a specific number of semitones from a root
export function getNoteAtInterval(root: Note, semitones: number): Note {
  const rootIndex = getNoteIndex(root);
  const targetIndex = (rootIndex + semitones) % 12;
  return NOTES[targetIndex];
}

// Get the note at a specific fret on a specific string
export function getNoteAtFret(openNote: Note, fret: number): Note {
  return getNoteAtInterval(openNote, fret);
}

// Get all notes in a scale
export function getScaleNotes(root: Note, scaleType: ScaleType): Note[] {
  const intervals = SCALE_INTERVALS[scaleType];
  return intervals.map(interval => getNoteAtInterval(root, interval));
}

// Check if a note is in a scale
export function isNoteInScale(note: Note, root: Note, scaleType: ScaleType): boolean {
  const scaleNotes = getScaleNotes(root, scaleType);
  return scaleNotes.includes(note);
}

// Check if a note is the root
export function isRoot(note: Note, root: Note): boolean {
  return note === root;
}

// Get enharmonic equivalent for display (with proper sharp symbol)
export function getEnharmonicDisplay(note: Note): string {
  return note.replace('#', '♯');
}

// Generate all fretboard notes
export function generateFretboardNotes(root: Note, scaleType: ScaleType) {
  const notes = [];
  
  for (let stringIndex = 0; stringIndex < MANDOLIN_TUNING.length; stringIndex++) {
    const openNote = MANDOLIN_TUNING[stringIndex];
    
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const note = getNoteAtFret(openNote, fret);
      notes.push({
        stringIndex,
        fret,
        note,
        isInScale: isNoteInScale(note, root, scaleType),
        isRoot: isRoot(note, root),
      });
    }
  }
  
  return notes;
}
