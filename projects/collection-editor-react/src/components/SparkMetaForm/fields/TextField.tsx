import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface TextFieldProps {
  name: string; label: string; required?: boolean; disabled?: boolean;
  multiline?: boolean; maxLength?: number; placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ name, label, required, disabled, multiline, maxLength, placeholder }) => {
  const lbl = useLabels();
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];
  const registerOpts = {
    required: required ? lbl.textField.requiredError.replace('{field}', label) : false,
    maxLength: maxLength ? { value: maxLength, message: lbl.textField.maxLengthError.replace('{max}', String(maxLength)) } : undefined,
  };

  return (
    <div className={[styles.field, multiline ? styles.fullWidth : ''].join(' ')}>
      <label className={styles.label} htmlFor={name}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      {multiline ? (
        <textarea id={name} className={[styles.input, styles.textarea, error ? styles.inputError : ''].join(' ')} disabled={disabled} placeholder={placeholder} rows={3} {...register(name, registerOpts)} />
      ) : (
        <input id={name} type="text" className={[styles.input, error ? styles.inputError : ''].join(' ')} disabled={disabled} placeholder={placeholder} {...register(name, registerOpts)} />
      )}
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
