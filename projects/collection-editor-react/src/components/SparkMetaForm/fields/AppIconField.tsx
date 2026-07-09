import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ImageIcon, Trash2 } from 'lucide-react';
import { AppIconPickerModal } from './AppIconPickerModal';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface AppIconFieldProps {
  name: string;
  label: string;
  nodeId: string;
  required?: boolean;
  disabled?: boolean;
}

export const AppIconField: React.FC<AppIconFieldProps> = ({ name, label, nodeId, required, disabled }) => {
  const lbl = useLabels();
  const [pickerOpen, setPickerOpen] = useState(false);
  const { watch, setValue, register, formState: { errors } } = useFormContext();
  const value = watch(name) as string | undefined;
  const error = errors[name];

  const handleSelect = (url: string) => {
    setValue(name, url, { shouldDirty: true, shouldValidate: true });
    setPickerOpen(false);
  };

  const handleRemove = () => {
    setValue(name, '', { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <input
        type="hidden"
        {...register(name, { required: required ? lbl.appIconField.requiredError.replace('{field}', label) : false })}
      />
      <div
        className={styles.iconWrap}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={lbl.appIconField.selectIconAriaLabel}
        onClick={() => !disabled && setPickerOpen(true)}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) setPickerOpen(true); }}
      >
        {value ? (
          <img src={value} alt={lbl.appIconField.iconAlt} className={styles.iconPreview} />
        ) : (
          <div className={styles.iconPlaceholder}>
            <ImageIcon size={20} />
            <span>{lbl.appIconField.selectIconLabel}</span>
          </div>
        )}
      </div>
      {value && !disabled && (
        <button
          type="button"
          className={styles.removeIconBtn}
          onClick={handleRemove}
          aria-label={lbl.appIconField.removeIconAriaLabel}
        >
          <Trash2 size={13} />
          <span>{lbl.appIconField.removeLabel}</span>
        </button>
      )}
      {error && <span className={styles.error}>{String(error.message)}</span>}

      {pickerOpen && (
        <AppIconPickerModal
          nodeId={nodeId}
          currentValue={value}
          onSelect={handleSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
};
