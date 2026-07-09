import React, { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { checkDialCode } from '../../../api/dialcode';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

type ValidationStatus = 'idle' | 'loading' | 'valid' | 'invalid';

interface DialcodeInputFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const DialcodeInputField: React.FC<DialcodeInputFieldProps> = ({ name, label, required, disabled }) => {
  const lbl = useLabels();
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? lbl.dialcodeInputField.requiredError.replace('{field}', label) : false },
    defaultValue: '',
  });

  const [status, setStatus] = useState<ValidationStatus>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  const handleValidate = async () => {
    const code = (field.value as string ?? '').trim();
    if (!code) {
      setStatus('invalid');
      setValidationMessage(lbl.dialcodeInputField.enterCodeMessage);
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
        setValidationMessage(lbl.dialcodeInputField.validMessage);
      } else {
        setStatus('invalid');
        setValidationMessage(lbl.dialcodeInputField.notFoundMessage);
      }
    } catch {
      setStatus('invalid');
      setValidationMessage(lbl.dialcodeInputField.validationFailedMessage);
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
          placeholder={lbl.dialcodeInputField.placeholderExample}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className={styles.validateBtn}
          onClick={handleValidate}
          disabled={disabled || status === 'loading'}
          aria-label={lbl.dialcodeInputField.validateAriaLabel}
        >
          {status === 'loading' ? lbl.dialcodeInputField.validatingLabel : lbl.dialcodeInputField.validateButtonLabel}
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
