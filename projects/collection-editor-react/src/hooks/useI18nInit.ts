import { useEffect } from 'react';
import { APP_LANGUAGE_CHANGE_EVENT, APP_LANGUAGE_STORAGE_KEY, useI18nStore } from '../store/i18n.store';

// Applies the persisted/host-driven language on mount, and keeps this editor
// in sync with a sibling editor instance (e.g. the Angular collection-editor
// library) embedded in the same host page via the shared 'app-language'
// localStorage key + 'app-language-change' CustomEvent contract.
export function useI18nInit() {
  const setLanguage = useI18nStore(s => s.setLanguage);

  useEffect(() => {
    setLanguage(localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) || 'en', { broadcast: false });

    const onStorage = (e: StorageEvent) => {
      if (e.key === APP_LANGUAGE_STORAGE_KEY && e.newValue) {
        setLanguage(e.newValue, { broadcast: false });
      }
    };
    const onAppLanguageChange = (e: Event) => {
      const lang = (e as CustomEvent<{ lang?: string }>).detail?.lang;
      if (lang) {
        setLanguage(lang, { broadcast: false });
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(APP_LANGUAGE_CHANGE_EVENT, onAppLanguageChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(APP_LANGUAGE_CHANGE_EVENT, onAppLanguageChange);
    };
  }, [setLanguage]);
}
