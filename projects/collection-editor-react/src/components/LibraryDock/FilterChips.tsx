import React from 'react';
import styles from './FilterChips.module.scss';

interface FilterChip { label: string; value: string; }
interface FilterChipsProps {
  filters: readonly FilterChip[];
  active: string;
  onChange: (value: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ filters, active, onChange }) => (
  <div className={styles.chips} role="group" aria-label="Content type filters">
    {filters.map(f => (
      <button
        key={f.value}
        type="button"
        role="radio"
        aria-checked={active === f.value}
        className={[`sbx-chip`, active === f.value ? 'filled' : 'outline', styles.chip].join(' ')}
        onClick={() => onChange(f.value)}
      >
        {f.label}
      </button>
    ))}
  </div>
);
