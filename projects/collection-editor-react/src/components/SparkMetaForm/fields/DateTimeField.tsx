import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface DateTimeFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({ name, label, required, disabled }) => {
  const lbl = useLabels();
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? lbl.dateTimeField.requiredError.replace('{field}', label) : false },
  });

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        type="datetime-local"
        className={[styles.input, error ? styles.inputError : ''].join(' ')}
        disabled={disabled}
        value={field.value as string ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        ref={field.ref}
      />
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
