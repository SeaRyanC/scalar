import { ScaleType, Orientation } from '../types';

interface ControlsProps {
  scale: ScaleType;
  orientation: Orientation;
  showNoteNames: boolean;
  onScaleChange: (scale: ScaleType) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onToggleNoteNames: () => void;
}

export function Controls({
  scale,
  orientation,
  showNoteNames,
  onScaleChange,
  onOrientationChange,
  onToggleNoteNames,
}: ControlsProps) {
  const scales: { value: ScaleType; label: string }[] = [
    { value: 'major', label: 'Major' },
    { value: 'minor', label: 'Minor' },
    { value: 'pentatonic', label: 'Pentatonic' },
    { value: 'blues', label: 'Blues' },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Options</h3>
      
      {/* Scale Selection */}
      <div style={styles.section}>
        <label style={styles.label}>Scale</label>
        <div style={styles.buttonGroup}>
          {scales.map(s => (
            <button
              key={s.value}
              onClick={() => onScaleChange(s.value)}
              style={{
                ...styles.button,
                ...(scale === s.value ? styles.buttonActive : {}),
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orientation Selection */}
      <div style={styles.section}>
        <label style={styles.label}>Orientation</label>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => onOrientationChange('horizontal')}
            style={{
              ...styles.button,
              ...(orientation === 'horizontal' ? styles.buttonActive : {}),
            }}
          >
            Horizontal
          </button>
          <button
            onClick={() => onOrientationChange('vertical')}
            style={{
              ...styles.button,
              ...(orientation === 'vertical' ? styles.buttonActive : {}),
            }}
          >
            Vertical
          </button>
        </div>
      </div>

      {/* Note Names Toggle */}
      <div style={styles.section}>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={showNoteNames}
            onChange={onToggleNoteNames}
            style={styles.checkbox}
          />
          <span style={styles.toggleText}>Show Note Names</span>
        </label>
      </div>
    </div>
  );
}

const styles: Record<string, preact.JSX.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    minWidth: '280px',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#666',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  button: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#f8f8f8',
    color: '#333',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonActive: {
    backgroundColor: '#333',
    color: '#fff',
    borderColor: '#333',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  toggleText: {
    fontSize: '14px',
    color: '#333',
  },
};
