import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChevronDown, Check } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface Option { label: string; value: string; }
interface SelectFieldProps { name: string; label: string; options: Option[]; required?: boolean; disabled?: boolean; }

export const SelectField: React.FC<SelectFieldProps> = ({ name, label, options, required, disabled }) => {
  const lbl = useLabels();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const value = watch(name) as string;
  const selectedLabel = options.find(o => o.value === value)?.label ?? lbl.selectField.selectPlaceholder;
  const error = errors[name];

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  return (
    <div className={styles.field} ref={ref} style={{ position: 'relative' }}>
      <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>
      <input type="hidden" {...register(name, { required: required ? lbl.selectField.requiredError.replace('{field}', label) : false })} />
      <button type="button" disabled={disabled} className={[styles.selectBtn, error ? styles.inputError : '', open ? styles.selectOpen : ''].join(' ')} onClick={() => setOpen(v => !v)}>
        <span className={value ? styles.selectedVal : styles.placeholder}>{selectedLabel}</span>
        <ChevronDown size={14} className={open ? styles.chevronUp : ''} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map(opt => (
            <button key={opt.value} type="button" className={[styles.option, value === opt.value ? styles.optionSelected : ''].join(' ')}
              onClick={() => { setValue(name, opt.value, { shouldDirty: true, shouldValidate: true }); setOpen(false); }}>
              <span>{opt.label}</span>
              {value === opt.value && <Check size={13} />}
            </button>
          ))}
          {!options.length && <span className={styles.noOpts}>{lbl.selectField.noOptionsMessage}</span>}
        </div>
      )}
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
