import { useState, useEffect } from 'preact/hooks';
import { Note, ScaleType, Orientation, AppState } from './types';
import { CircleOfFifths } from './components/CircleOfFifths';
import { Fretboard } from './components/Fretboard';
import { Controls } from './components/Controls';

const STORAGE_KEY = 'scalar-user-settings';

const defaultState: AppState = {
  key: 'C',
  scale: 'major',
  orientation: 'horizontal',
  showNoteNames: true,
};

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultState, ...parsed };
    }
  } catch {
    // If parsing fails, return default state
  }
  return defaultState;
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function App() {
  const [state, setState] = useState<AppState>(() => loadState());

  const setKey = (key: Note) => setState(prev => ({ ...prev, key }));
  const setScale = (scale: ScaleType) => setState(prev => ({ ...prev, scale }));
  const setOrientation = (orientation: Orientation) => setState(prev => ({ ...prev, orientation }));
  const toggleNoteNames = () => setState(prev => ({ ...prev, showNoteNames: !prev.showNoteNames }));

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mandolin Scale Visualizer</h1>
      
      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <CircleOfFifths 
            selectedKey={state.key} 
            onSelectKey={setKey} 
          />
          <Controls
            scale={state.scale}
            orientation={state.orientation}
            showNoteNames={state.showNoteNames}
            onScaleChange={setScale}
            onOrientationChange={setOrientation}
            onToggleNoteNames={toggleNoteNames}
          />
        </div>
        
        <div style={styles.rightPanel}>
          <Fretboard
            rootNote={state.key}
            scale={state.scale}
            orientation={state.orientation}
            showNoteNames={state.showNoteNames}
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, preact.JSX.CSSProperties> = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '24px',
    fontSize: '28px',
    fontWeight: '600',
  },
  mainContent: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
  },
  rightPanel: {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
};
