import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { IFieldConfig } from './useFieldPrepare';

// Re-export IFieldConfig so callers can import it from either location.
export type { IFieldConfig } from './useFieldPrepare';

/**
 * useCascade
 *
 * When a parent field changes, clear every field that depends on it —
 * TRANSITIVELY, in a single pass (board → clears medium → grade → subject all
 * at once). Mirrors Angular's `resetDependents` (spark-meta-form.component.ts:
 * 449-465), which walks the full `depends` graph rather than relying on the
 * RHF watch ripple to clear one level per microtask.
 *
 * The child's *options* are recomputed reactively in useFieldPrepare (filtered
 * by the parent's selected value via term associations), so this hook only has
 * to clear the now-stale child values.
 *
 * A re-entrancy guard stops the setValue calls we make here from re-triggering
 * the watch callback and clearing the same fields again.
 *
 * @param form   react-hook-form UseFormReturn instance.
 * @param fields Prepared field list (carries the `depends` graph).
 */
export function useCascade(
  form: UseFormReturn<Record<string, unknown>>,
  fields: IFieldConfig[],
): void {
  const { watch, setValue } = form;
  const clearingRef = useRef(false);

  useEffect(() => {
    const subscription = watch((_values, { name: changedField }) => {
      if (!changedField || clearingRef.current) return;

      clearingRef.current = true;
      try {
        const cleared = new Set<string>([changedField]);
        let progressed = true;
        while (progressed) {
          progressed = false;
          for (const f of fields) {
            if (cleared.has(f.code)) continue;
            if (f.depends?.some(d => cleared.has(d))) {
              setValue(
                f.code,
                f.inputType === 'multiselect' || f.inputType === 'chips' ? [] : '',
                { shouldDirty: true },
              );
              cleared.add(f.code);
              progressed = true;
            }
          }
        }
      } finally {
        clearingRef.current = false;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, fields]);
}
