import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';

export type LabelConfig = typeof en;

export const SUPPORTED_LANGUAGES = ['en', 'ar', 'fr', 'pt'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: readonly SupportedLanguage[] = ['ar'];

const locales: Record<SupportedLanguage, Partial<LabelConfig>> = { en, ar, fr, pt };

// Deep-merges a locale's translated keys over the English base, so a locale
// file missing a key (not yet translated) silently falls back to English
// instead of rendering "undefined" or crashing a lookup.
function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base } as T;
  for (const key of Object.keys(override) as Array<keyof T>) {
    const baseValue = base[key];
    const overrideValue = override[key];
    if (
      baseValue && overrideValue &&
      typeof baseValue === 'object' && typeof overrideValue === 'object' &&
      !Array.isArray(baseValue) && !Array.isArray(overrideValue)
    ) {
      result[key] = deepMerge(baseValue as Record<string, unknown>, overrideValue as Record<string, unknown>) as T[keyof T];
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue as T[keyof T];
    }
  }
  return result;
}

export function mergeLocale(lang: string): LabelConfig {
  const translated = locales[lang as SupportedLanguage];
  if (!translated || lang === 'en') {
    return en;
  }
  return deepMerge(en, translated);
}

export function isRtl(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang as SupportedLanguage);
}
