import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChevronDown, Check } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface Option { label: string; value: string; }
interface MultiSelectFieldProps { name: string; label: string; options: Option[]; required?: boolean; disabled?: boolean; }

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({ name, label, options, required, disabled }) => {
  const lbl = useLabels();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const values = (watch(name) as string[]) ?? [];
  const error = errors[name];
  const displayText = values.length ? `${values.length} ${lbl.multiSelectField.selectedCountSuffix}` : lbl.multiSelectField.selectPlaceholder;

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  const toggle = (v: string) => {
    const next = values.includes(v) ? values.filter(x => x !== v) : [...values, v];
    setValue(name, next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className={styles.field} ref={ref} style={{ position: 'relative' }}>
      <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>
      <input type="hidden" {...register(name, { required: required ? lbl.multiSelectField.requiredError.replace('{field}', label) : false })} />
      <button type="button" disabled={disabled} className={[styles.selectBtn, error ? styles.inputError : '', open ? styles.selectOpen : ''].join(' ')} onClick={() => setOpen(v => !v)}>
        <span className={values.length ? styles.selectedVal : styles.placeholder}>{displayText}</span>
        <ChevronDown size={14} className={open ? styles.chevronUp : ''} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map(opt => (
            <button key={opt.value} type="button" className={[styles.option, values.includes(opt.value) ? styles.optionSelected : ''].join(' ')} onClick={() => toggle(opt.value)}>
              <Check size={13} style={{ opacity: values.includes(opt.value) ? 1 : 0 }} />
              <span>{opt.label}</span>
            </button>
          ))}
          {!options.length && <span className={styles.noOpts}>{lbl.multiSelectField.noOptionsMessage}</span>}
        </div>
      )}
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
