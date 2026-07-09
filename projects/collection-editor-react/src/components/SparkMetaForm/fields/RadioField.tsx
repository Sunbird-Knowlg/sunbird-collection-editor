import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface Option { label: string; value: string; }
interface RadioFieldProps { name: string; label: string; options: Option[]; required?: boolean; disabled?: boolean; }

export const RadioField: React.FC<RadioFieldProps> = ({ name, label, options, required, disabled }) => {
  const lbl = useLabels();
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>
      <div className={styles.radioGroup}>
        {options.map(opt => (
          <label key={opt.value} className={styles.radioLabel}>
            <input type="radio" value={opt.value} disabled={disabled} {...register(name, { required: required ? lbl.radioField.requiredError.replace('{field}', label) : false })} />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
