import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { getFramework } from '../../../api/framework';
import type { IFieldConfig } from './useFieldPrepare';

// Re-export IFieldConfig so callers can import it from either location.
export type { IFieldConfig } from './useFieldPrepare';

/**
 * useCascade
 *
 * Watches parent fields (e.g. board → medium → gradeLevel → subject) and:
 *   1. Resets the child field value whenever its parent changes.
 *   2. Reloads the child field's options from the framework API, filtered by
 *      the associations of the currently-selected parent value(s).
 *
 * Framework term parent-child relations are encoded in ITerm.associations —
 * a term's associations array contains its parent terms. We therefore keep
 * only those child terms whose associations include (by identifier or code)
 * one of the currently-selected parent values.
 *
 * @param form   react-hook-form UseFormReturn instance.
 * @param fields Mutable array of IFieldConfig objects (options/range are
 *               patched in-place so the referencing component re-renders
 *               when it reads them from state managed by the caller).
 */
export function useCascade(
  form: UseFormReturn<Record<string, unknown>>,
  fields: IFieldConfig[],
): void {
  const { watch, setValue } = form;
  const watchAll = watch();

  // ── Step 1: Reset child values when a parent field changes ──────────────
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

  // ── Step 2: Reload options for framework-backed dependent fields ─────────
  useEffect(() => {
    const dependentFields = fields.filter(
      f => f.depends && f.depends.length > 0 && f.frameworkId && f.categoryCode,
    );
    if (!dependentFields.length) return;

    let cancelled = false;

    const reload = async () => {
      for (const field of dependentFields) {
        if (!field.frameworkId || !field.categoryCode) continue;

        try {
          const fw = await getFramework(field.frameworkId);
          if (cancelled) return;

          const category = fw.categories?.find(c => c.code === field.categoryCode);
          if (!category) continue;

          let terms = category.terms ?? [];

          // Filter by parent association if a parent value is selected.
          // Sunbird encodes parent↔child relations in ITerm.associations:
          // a term's associations[] contains its parent term objects.
          if (field.depends && field.depends.length > 0) {
            const parentCode = field.depends[0];
            const parentValue = watchAll[parentCode];

            if (parentValue !== undefined && parentValue !== null && parentValue !== '') {
              const parentValues = (Array.isArray(parentValue) ? parentValue : [parentValue]) as string[];

              if (parentValues.length > 0) {
                terms = terms.filter(term => {
                  const assoc = term.associations;
                  if (!assoc || assoc.length === 0) {
                    // Term has no associations — include it (no filtering possible)
                    return true;
                  }
                  // Keep term if at least one association matches a selected parent value
                  // (compare by identifier or code, since callers may store either)
                  return assoc.some(
                    a => parentValues.includes(a.identifier) || parentValues.includes(a.code),
                  );
                });
              }
            }
          }

          // Patch options and range in-place so referencing components see
          // the updated list on their next render cycle.
          field.range = terms.map(t => ({ name: t.name, identifier: t.identifier }));
          field.options = terms.map(t => ({ label: t.name, value: t.identifier }));
        } catch {
          // Silently skip on API failure; existing options remain unchanged.
        }
      }
    };

    reload();
    return () => {
      cancelled = true;
    };
    // Re-run only when the parent field values change, not on every render.
    // We build a stable JSON key from just the parent codes that matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(
      Object.fromEntries(
        fields
          .flatMap(f => f.depends ?? [])
          .filter((code, i, arr) => arr.indexOf(code) === i) // dedupe
          .map(code => [code, watchAll[code]]),
      ),
    ),
  ]);
}
