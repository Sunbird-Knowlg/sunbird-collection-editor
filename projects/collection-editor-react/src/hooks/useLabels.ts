import { useI18nStore } from '../store/i18n.store';
import type { LabelConfig } from '../i18n';

// `const lbl = useLabels(); ...{lbl.contextualEditor.reviewCommentLabel}` —
// mirrors the Angular library's `configService.labelConfig?.section?.key` lookup.
export function useLabels(): LabelConfig {
  return useI18nStore(s => s.labelConfig);
}
