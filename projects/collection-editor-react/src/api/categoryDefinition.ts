import { apiClient } from './client';

// Default API version. Both sandbox and test environments serve v1.
// Callers can pass a version override via getCategoryDefinition's `version` param.
const DEFAULT_CATEGORY_DEFINITION_VERSION = 'v1';

// ---------------------------------------------------------------------------
// A single normalized field, derived from one entry in a form's `properties`
// (or a section's `fields[]`). Carries everything the form layer needs.
// ---------------------------------------------------------------------------
export interface ICategoryField {
  code: string;
  label: string;
  name?: string;
  inputType?: string;
  dataType?: string;
  required: boolean;
  editable: boolean;
  visible: boolean;
  placeholder?: string;
  maxLength?: number;
  depends?: string[];
  /** Framework category the field's options are sourced from (board/medium/…). */
  sourceCategory?: string;
  /** Raw range: string[] OR Array<{ name; identifier }>. */
  range?: unknown;
  enum?: string[];
  default?: unknown;
  defaultValue?: unknown;
  index?: number;
  /** Section title the field was grouped under (drives tab assignment). */
  section?: string;
  /** 'name' | 'identifier' — which term property to store as the value. */
  output?: string;
  [key: string]: unknown;
}

export interface IParsedCategoryDefinition {
  rootForm: ICategoryField[];          // forms.create
  unitForm: ICategoryField[];          // forms.unitMetadata  (name / description / keywords / topic)
  childForm: ICategoryField[];         // forms.childMetadata (name / author / copyright / license …)
  searchForm: ICategoryField[];        // forms.search
  relationalForm: ICategoryField[];    // forms.relationalMetadata
  publishChecklist: ICategoryField[];  // forms.publishchecklist
  reviewChecklist: ICategoryField[];   // forms.review
  rfcChecklist: ICategoryField[];      // forms.requestforchangeschecklist
  /** schema.properties[*].default keyed by property name (generateDIALCodes, …). */
  schemaDefaults: Record<string, unknown>;
  frameworkMetadata: { orgFWType?: string[]; targetFWType?: string[] };
  sourcingSettings: Record<string, unknown>;
}

// Back-compat alias retained for any older imports.
export type ICategoryDefinitionField = ICategoryField;

function maxLengthFromValidations(field: Record<string, unknown>): number | undefined {
  const validations = field.validations as Array<Record<string, unknown>> | undefined;
  const ml = validations?.find(v => v.type === 'maxlength' || v.type === 'maxLength');
  if (!ml) return field.maxLength as number | undefined;
  const n = Number(ml.value);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeField(raw: Record<string, unknown>, section?: string): ICategoryField {
  return {
    code: (raw.code as string) ?? '',
    label: (raw.label as string) ?? (raw.name as string) ?? (raw.code as string) ?? '',
    name: raw.name as string | undefined,
    inputType: raw.inputType as string | undefined,
    dataType: raw.dataType as string | undefined,
    // A field is required if flagged, has a required validation, or the
    // rendering-hints class includes "required" (Sunbird convention).
    required:
      raw.required === true ||
      (Array.isArray(raw.validations) &&
        (raw.validations as Array<Record<string, unknown>>).some(v => v.type === 'required')) ||
      String((raw.renderingHints as Record<string, unknown>)?.class ?? '').includes('required'),
    editable: raw.editable !== false,
    visible: raw.visible !== false,
    placeholder: raw.placeholder as string | undefined,
    maxLength: maxLengthFromValidations(raw),
    depends: raw.depends as string[] | undefined,
    sourceCategory: raw.sourceCategory as string | undefined,
    range: raw.range,
    enum: raw.enum as string[] | undefined,
    default: raw.default,
    defaultValue: raw.defaultValue,
    index: raw.index as number | undefined,
    section,
    output: raw.output as string | undefined,
  };
}

// Flatten a form's `properties` (sections with `fields[]`, or flat fields)
// into a single ordered field list, tagging each field with its section name.
// Fields are sorted within each section by their `index`, then sections are
// concatenated in API order — preserving section grouping for the tab renderer.
function parseForm(form: unknown): ICategoryField[] {
  const properties = (form as { properties?: unknown })?.properties;
  if (!Array.isArray(properties)) return [];

  const fields: ICategoryField[] = [];
  for (const item of properties as Array<Record<string, unknown>>) {
    if (Array.isArray(item.fields)) {
      // Use machine name (not display title) so SECTION_TAB_MAP / SECTION_DISPLAY lookups work.
      const sectionName = (item.name as string) ?? undefined;
      const sectionFields = (item.fields as Array<Record<string, unknown>>)
        .filter(f => !!f.code)
        .sort((a, b) => ((a.index as number) ?? 0) - ((b.index as number) ?? 0));
      for (const f of sectionFields) {
        fields.push(normalizeField(f, sectionName));
      }
    } else if (item.code) {
      fields.push(normalizeField(item));
    }
  }
  return fields;
}

function parseSchemaDefaults(schema: unknown): Record<string, unknown> {
  const props = (schema as { properties?: Record<string, Record<string, unknown>> })?.properties;
  if (!props) return {};
  const out: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(props)) {
    if (def && 'default' in def) out[key] = def.default;
  }
  return out;
}

export async function getCategoryDefinition(
  categoryName: string,
  channel: string,
  objectType = 'Collection',
  version: 'v1' | 'v4' = DEFAULT_CATEGORY_DEFINITION_VERSION,
): Promise<IParsedCategoryDefinition> {
  const response = await apiClient.post(
    `/action/object/category/definition/${version}/read?fields=objectMetadata,forms,name,label`,
    {
      request: {
        objectCategoryDefinition: {
          objectType,
          name: categoryName,
          ...(channel ? { channel } : {}),
        },
      },
    },
  );

  const ocd = response.data?.result?.objectCategoryDefinition as Record<string, unknown> | undefined;
  const forms = (ocd?.forms ?? {}) as Record<string, unknown>;
  const objectMetadata = (ocd?.objectMetadata ?? {}) as Record<string, unknown>;
  const config = (objectMetadata.config ?? {}) as Record<string, unknown>;

  return {
    rootForm: parseForm(forms.create),
    unitForm: parseForm(forms.unitMetadata),
    childForm: parseForm(forms.childMetadata),
    searchForm: parseForm(forms.search ?? forms.searchConfig),
    relationalForm: parseForm(forms.relationalMetadata),
    publishChecklist: parseForm(forms.publishchecklist),
    reviewChecklist: parseForm(forms.review),
    rfcChecklist: parseForm(forms.requestforchangeschecklist),
    schemaDefaults: parseSchemaDefaults(objectMetadata.schema),
    frameworkMetadata: (config.frameworkMetadata ?? {}) as { orgFWType?: string[]; targetFWType?: string[] },
    sourcingSettings: (config.sourcingSettings ?? {}) as Record<string, unknown>,
  };
}
