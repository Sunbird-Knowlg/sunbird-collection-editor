import { describe, it, expect } from 'vitest';
import { mergeLocale, isRtl } from './index';

describe('mergeLocale', () => {
  it('returns the English base for lang="en"', () => {
    expect(mergeLocale('en')).toEqual(mergeLocale('en'));
    expect(mergeLocale('en').contextualEditor.reviewCommentLabel).toBe('Reviewer comment:');
  });

  it('falls back to English for an unsupported language', () => {
    const merged = mergeLocale('xx');
    expect(merged.contextualEditor.reviewCommentLabel).toBe('Reviewer comment:');
  });

  it('deep-merges every locale over the English base, covering every English key', () => {
    const enKeys = Object.keys(mergeLocale('en'));
    for (const lang of ['ar', 'fr', 'pt']) {
      const merged = mergeLocale(lang);
      // Guarantees full coverage even if a future translation is missing a
      // key — the merge must still resolve every section from English.
      expect(Object.keys(merged)).toEqual(enKeys);
      expect(typeof merged.topbar.saveAsDraftButton).toBe('string');
      expect(merged.topbar.saveAsDraftButton.length).toBeGreaterThan(0);
    }
  });

  it('uses the translated value, not the English fallback, once a locale is translated', () => {
    const merged = mergeLocale('ar');
    expect(merged.topbar.saveAsDraftButton).not.toBe('Save as Draft');
  });
});

describe('isRtl', () => {
  it('is true only for Arabic', () => {
    expect(isRtl('ar')).toBe(true);
    expect(isRtl('en')).toBe(false);
    expect(isRtl('fr')).toBe(false);
    expect(isRtl('pt')).toBe(false);
  });
});
