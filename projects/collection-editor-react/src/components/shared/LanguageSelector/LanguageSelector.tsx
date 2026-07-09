import React from 'react';
import { useI18nStore } from '../../../store/i18n.store';
import { SUPPORTED_LANGUAGES } from '../../../i18n';
import { useLabels } from '../../../hooks/useLabels';
import styles from './LanguageSelector.module.scss';

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  en: 'EN',
  ar: 'AR',
  fr: 'FR',
  pt: 'PT',
};

export const LanguageSelector: React.FC = () => {
  const lbl = useLabels();
  const lang = useI18nStore(s => s.lang);
  const setLanguage = useI18nStore(s => s.setLanguage);

  return (
    <div className={styles.languageSelector} role="group" aria-label={lbl.languageSelector.ariaLabel}>
      {SUPPORTED_LANGUAGES.map(code => (
        <button
          key={code}
          type="button"
          className={`${styles.languageBtn} ${lang === code ? styles.active : ''}`}
          onClick={() => setLanguage(code)}
          aria-pressed={lang === code}
        >
          {LANGUAGE_DISPLAY_NAMES[code]}
        </button>
      ))}
    </div>
  );
};
