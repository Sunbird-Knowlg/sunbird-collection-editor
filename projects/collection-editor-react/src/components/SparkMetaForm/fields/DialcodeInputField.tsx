import React, { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { checkDialCode } from '../../../api/dialcode';
import styles from './Field.module.scss';

type ValidationStatus = 'idle' | 'loading' | 'valid' | 'invalid';

interface DialcodeInputFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const DialcodeInputField: React.FC<DialcodeInputFieldProps> = ({ name, label, required, disabled }) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label} is required` : false },
    defaultValue: '',
  });

  const [status, setStatus] = useState<ValidationStatus>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  const handleValidate = async () => {
    const code = (field.value as string ?? '').trim();
    if (!code) {
      setStatus('invalid');
      setValidationMessage('Enter a dial code to validate.');
      return;
    }
    setStatus('loading');
    setValidationMessage('');
    try {
      const data = await checkDialCode(code) as Record<string, unknown>;
      const result = data?.result as Record<string, unknown> | undefined;
      const dialcodes = result?.dialcodes as unknown[];
      if (Array.isArray(dialcodes) && dialcodes.length > 0) {
        setStatus('valid');
        setValidationMessage('Dial code is valid.');
      } else {
        setStatus('invalid');
        setValidationMessage('Dial code not found.');
      }
    } catch {
      setStatus('invalid');
      setValidationMessage('Validation failed. Please try again.');
    }
  };

  const statusIcon = () => {
    if (status === 'loading') return <Loader size={16} className={styles.dialcodeSpinner} />;
    if (status === 'valid') return <CheckCircle size={16} color="var(--sbx-success, #2e7d32)" />;
    if (status === 'invalid') return <XCircle size={16} color="var(--sbx-error)" />;
    return null;
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.dialcodeRow}>
        <input
          id={name}
          type="text"
          className={[styles.input, error ? styles.inputError : ''].join(' ')}
          disabled={disabled}
          value={field.value as string ?? ''}
          onChange={e => {
            field.onChange(e);
            setStatus('idle');
            setValidationMessage('');
          }}
          onBlur={field.onBlur}
          ref={field.ref}
          placeholder="e.g. A1B2C3"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className={styles.validateBtn}
          onClick={handleValidate}
          disabled={disabled || status === 'loading'}
          aria-label="Validate dial code"
        >
          {status === 'loading' ? 'Validating…' : 'Validate'}
        </button>
        {statusIcon()}
      </div>
      {error && <span className={styles.error}>{String(error.message)}</span>}
      {!error && validationMessage && (
        <span className={status === 'valid' ? styles.dialcodeValid : styles.error}>
          {validationMessage}
        </span>
      )}
    </div>
  );
};
