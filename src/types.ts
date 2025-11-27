export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type ScaleType = 'major' | 'minor' | 'pentatonic' | 'blues';

export type Orientation = 'horizontal' | 'vertical';

export interface AppState {
  key: Note;
  scale: ScaleType;
  orientation: Orientation;
  showNoteNames: boolean;
}

export interface FretNote {
  stringIndex: number;
  fret: number;
  note: Note;
  isInScale: boolean;
  isRoot: boolean;
}
