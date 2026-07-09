import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface LevelOption { label: string; value: string; }
interface Level { code: string; label: string; options: LevelOption[]; }

interface NestedSelectFieldProps {
  name: string;
  label: string;
  levels: Level[];
  required?: boolean;
  disabled?: boolean;
}

export const NestedSelectField: React.FC<NestedSelectFieldProps> = ({
  name, label, levels, required, disabled,
}) => {
  const lbl = useLabels();
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? lbl.nestedSelectField.requiredError.replace('{field}', label) : false },
    defaultValue: {},
  });

  // field.value is a Record<string, string> mapping level.code → selected value
  const selections: Record<string, string> = (field.value as Record<string, string>) ?? {};

  const handleChange = (levelCode: string, levelIndex: number, value: string) => {
    const updated: Record<string, string> = {};
    // Keep selections up to and including the changed level, reset deeper ones
    for (let i = 0; i < levelIndex; i++) {
      updated[levels[i].code] = selections[levels[i].code] ?? '';
    }
    updated[levelCode] = value;
    // Clear child selections
    for (let i = levelIndex + 1; i < levels.length; i++) {
      updated[levels[i].code] = '';
    }
    field.onChange(updated);
  };

  return (
    <div className={[styles.field, styles.fullWidth].join(' ')}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.nestedSelectRow}>
        {levels.map((level, idx) => {
          const isLocked = idx > 0 && !selections[levels[idx - 1].code];
          return (
            <div key={level.code} className={styles.field} style={{ flex: 1 }}>
              <label className={styles.label} htmlFor={`${name}_${level.code}`}>
                {level.label}
              </label>
              <select
                id={`${name}_${level.code}`}
                className={[styles.input, error ? styles.inputError : ''].join(' ')}
                disabled={disabled || isLocked}
                value={selections[level.code] ?? ''}
                onChange={e => handleChange(level.code, idx, e.target.value)}
                onBlur={field.onBlur}
              >
                <option value="">{lbl.nestedSelectField.selectPlaceholder}</option>
                {level.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
