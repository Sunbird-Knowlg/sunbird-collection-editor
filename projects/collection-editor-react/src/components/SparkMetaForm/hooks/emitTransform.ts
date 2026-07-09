// Pure form-value transforms, ported from Angular SparkMetaFormComponent.emitValue
// (spark-meta-form.component.ts:507-543). Keeps the watch handler in
// SparkMetaForm thin and unit-testable.

// Internal/UI-only keys that must never reach the save payload.
export const EMIT_OMIT_KEYS = ['allowECM', 'levels', 'setPeriod', 'instances'] as const;

// levels[] → { L1: { label }, L2: { label }, … } (outcomeDeclaration shape).
export function createLevels(levels: unknown[]): Record<string, { label: unknown }> {
  const obj: Record<string, { label: unknown }> = {};
  levels.forEach((el, i) => { obj[`L${i + 1}`] = { label: el }; });
  return obj;
}

/**
 * Transform the full form value object before it is written to the node /
 * emitted — used for batch / cascade writes (Angular emits the whole `data`).
 */
export function transformEmit(
  values: Record<string, unknown>,
  opts: { isReview?: boolean; nodeTitle?: string } = {},
): Record<string, unknown> {
  const data: Record<string, unknown> = { ...values };
  for (const k of EMIT_OMIT_KEYS) delete data[k];

  const levels = values.levels;
  if (Array.isArray(levels) && levels.length) {
    data.outcomeDeclaration = { levels: createLevels(levels) };
  }
  const instances = values.instances;
  if (instances !== undefined && instances !== null && instances !== '') {
    data.instances = { label: instances };
  }
  // In review modes the name field may be hidden/empty; preserve the node title.
  if (opts.isReview && (data.name === undefined || data.name === null || data.name === '') && opts.nodeTitle) {
    data.name = opts.nodeTitle;
  }
  return data;
}

/**
 * Transform a single changed field into the patch to persist. Returns null
 * when the field is UI-only and must not be written (allowECM / setPeriod).
 */
export function transformFieldPatch(
  changedField: string,
  value: unknown,
): Record<string, unknown> | null {
  if (changedField === 'allowECM' || changedField === 'setPeriod') return null;
  if (changedField === 'levels') {
    return { outcomeDeclaration: { levels: Array.isArray(value) ? createLevels(value) : {} } };
  }
  if (changedField === 'instances') {
    return { instances: value !== undefined && value !== null && value !== '' ? { label: value } : '' };
  }
  return { [changedField]: value };
}
