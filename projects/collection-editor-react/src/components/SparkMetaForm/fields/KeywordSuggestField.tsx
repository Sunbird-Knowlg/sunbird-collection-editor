import React, { useState, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import styles from './Field.module.scss';

interface KeywordSuggestFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const KeywordSuggestField: React.FC<KeywordSuggestFieldProps> = ({ name, label, required, disabled }) => {
  const lbl = useLabels();
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? lbl.keywordSuggestField.requiredError.replace('{field}', label) : false },
    defaultValue: [],
  });

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = (field.value as string[]) ?? [];

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    field.onChange([...tags, trimmed]);
  };

  const removeTag = (tag: string) => {
    field.onChange(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
      setInputValue('');
    }
    field.onBlur();
  };

  return (
    <div className={[styles.field, styles.fullWidth].join(' ')}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <div
        className={[styles.chipGroup, error ? styles.inputError : ''].join(' ')}
        onClick={() => !disabled && inputRef.current?.focus()}
        style={{ cursor: disabled ? 'not-allowed' : 'text' }}
      >
        {tags.map(tag => (
          <span key={tag} className={styles.tagChip}>
            {tag}
            {!disabled && (
              <button
                type="button"
                className={styles.tagChipRemove}
                onClick={e => { e.stopPropagation(); removeTag(tag); }}
                aria-label={`Remove ${tag}`}
              >
                <X size={11} />
              </button>
            )}
          </span>
        ))}
        {!disabled && (
          <input
            ref={inputRef}
            className={styles.chipInput}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? lbl.keywordSuggestField.inputPlaceholder : ''}
            style={{ flexGrow: 1, minWidth: 120 }}
          />
        )}
      </div>
      {error && <span className={styles.error}>{String(error.message)}</span>}
    </div>
  );
};
