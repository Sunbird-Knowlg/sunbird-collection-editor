import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { IFieldConfig } from './useFieldPrepare';

// Re-export IFieldConfig so callers can import it from either location.
export type { IFieldConfig } from './useFieldPrepare';

/**
 * useCascade
 *
 * Resets a child field's value whenever one of its parent fields (declared via
 * `depends`) changes. The child's *options* are recomputed reactively in
 * useFieldPrepare (filtered by the parent's selected value via term
 * associations), so this hook only has to clear the now-stale child value.
 *
 * @param form   react-hook-form UseFormReturn instance.
 * @param fields Prepared field list (carries the `depends` graph).
 */
export function useCascade(
  form: UseFormReturn<Record<string, unknown>>,
  fields: IFieldConfig[],
): void {
  const { watch, setValue } = form;

  useEffect(() => {
    const subscription = watch((_values, { name: changedField }) => {
      if (!changedField) return;
      fields.forEach(f => {
        if (f.depends?.includes(changedField)) {
          setValue(
            f.code,
            f.inputType === 'multiselect' || f.inputType === 'chips' ? [] : '',
            { shouldDirty: true },
          );
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, fields]);
}
