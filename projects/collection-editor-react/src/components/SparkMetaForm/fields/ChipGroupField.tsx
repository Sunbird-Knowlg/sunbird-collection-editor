import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface ChipGroupFieldProps { name: string; label: string; required?: boolean; disabled?: boolean; placeholder?: string; }

export const ChipGroupField: React.FC<ChipGroupFieldProps> = ({ name, label, required, disabled, placeholder }) => {
  const lbl = useLabels();
  const effectivePlaceholder = placeholder ?? lbl.chipGroupField.addPlaceholder;
  const [inputVal, setInputVal] = useState('');
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { watch, setValue, formState: { errors } } = useFormContext();
  const values = (watch(name) as string[]) ?? [];
  const error = errors[name];

  const add = () => {
    const v = inputVal.trim();
    if (v && !values.includes(v)) setValue(name, [...values, v], { shouldDirty: true });
    setInputVal('');
    setAdding(false);
  };

  const remove = (v: string) => setValue(name, values.filter(x => x !== v), { shouldDirty: true });

  return (
    <div className={[styles.field, styles.fullWidth].join(' ')}>
      <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>
      <div className={styles.chipGroup}>
        {values.map(v => (
          <span key={v} className="sbx-chip filled">
            {v}
            {!disabled && <button type="button" className="sbx-chip-remove" onClick={() => remove(v)} aria-label={`Remove ${v}`}>×</button>}
          </span>
        ))}
        {!disabled && (
          adding ? (
            <input ref={inputRef} autoFocus className={styles.chipInput} value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } if (e.key === 'Escape') { setInputVal(''); setAdding(false); } }}
              onBlur={add} placeholder={effectivePlaceholder}
            />
          ) : (
            <button type="button" className={styles.addChipBtn} onClick={() => { setAdding(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
              <Plus size={12} /> {lbl.chipGroupField.addButtonLabel}
            </button>
          )
        )}
      </div>
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
