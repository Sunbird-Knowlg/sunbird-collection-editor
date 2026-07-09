import { create } from 'zustand';
import { mergeLocale, isRtl, type LabelConfig } from '../i18n';

export const APP_LANGUAGE_STORAGE_KEY = 'app-language';
export const APP_LANGUAGE_CHANGE_EVENT = 'app-language-change';

interface I18nState {
  lang: string;
  labelConfig: LabelConfig;
  setLanguage: (lang: string, options?: { broadcast?: boolean }) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: 'en',
  labelConfig: mergeLocale('en'),
  setLanguage: (lang, options = {}) => {
    set({ lang, labelConfig: mergeLocale(lang) });
    localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.setAttribute('dir', isRtl(lang) ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    // Broadcast so a sibling editor instance (e.g. the Angular library)
    // embedded in the same host page can react too. Skipped when applying a
    // language change that arrived FROM that same event, to avoid an echo loop.
    if (options.broadcast !== false) {
      window.dispatchEvent(new CustomEvent(APP_LANGUAGE_CHANGE_EVENT, { detail: { lang } }));
    }
  },
}));
