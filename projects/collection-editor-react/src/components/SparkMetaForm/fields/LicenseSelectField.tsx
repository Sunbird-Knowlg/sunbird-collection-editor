import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChevronDown, Check } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

const LICENSE_OPTIONS = [
  { label: 'CC BY 4.0', value: 'CC BY 4.0' },
  { label: 'CC BY-SA 4.0', value: 'CC BY-SA 4.0' },
  { label: 'CC BY-NC 4.0', value: 'CC BY-NC 4.0' },
  { label: 'CC BY-NC-SA 4.0', value: 'CC BY-NC-SA 4.0' },
  { label: 'CC BY-ND 4.0', value: 'CC BY-ND 4.0' },
  { label: 'CC0 1.0 (Public Domain)', value: 'CC0 1.0' },
];

interface LicenseSelectFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const LicenseSelectField: React.FC<LicenseSelectFieldProps> = ({ name, label, required, disabled }) => {
  const lbl = useLabels();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const value = watch(name) as string;
  const selectedOption = LICENSE_OPTIONS.find(o => o.value === value);
  const selectedLabel = selectedOption?.label ?? lbl.licenseSelectField.selectPlaceholder;
  const error = errors[name];

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  return (
    <div className={styles.field} ref={ref} style={{ position: 'relative' }}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <input
        type="hidden"
        {...register(name, { required: required ? lbl.licenseSelectField.requiredError.replace('{field}', label) : false })}
      />
      <button
        type="button"
        disabled={disabled}
        className={[styles.selectBtn, error ? styles.inputError : '', open ? styles.selectOpen : ''].join(' ')}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? styles.selectedVal : styles.placeholder}>{selectedLabel}</span>
        <ChevronDown size={14} className={open ? styles.chevronUp : ''} />
      </button>
      {open && (
        <div className={styles.dropdown} role="listbox">
          {LICENSE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              className={[styles.option, value === opt.value ? styles.optionSelected : ''].join(' ')}
              onClick={() => {
                setValue(name, opt.value, { shouldDirty: true, shouldValidate: true });
                setOpen(false);
              }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
