import type { IFrameworkDetails, ITerm } from '../../../types/framework';

export interface NestedSelectLevel {
  code: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

export interface PreparedField {
  code: string;
  label: string;
  inputType: 'text' | 'textarea' | 'select' | 'multiselect' | 'chips' | 'radio' | 'appIcon'
    | 'datepicker' | 'datetime' | 'keywords' | 'tagsinput' | 'nestedselect' | 'license' | 'dialcode';
  required?: boolean;
  editable?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: Array<{ label: string; value: string }>;
  levels?: NestedSelectLevel[];
  depends?: string[];
  tab: 'details' | 'audience' | 'licensing';
  section?: string;
  defaultValue?: unknown;
  currentValue?: unknown;
}

export const SECTION_DISPLAY: Record<string, { title: string; description?: string }> = {
  'First Section': { title: 'Basic Information', description: 'Core details that define the content identity.' },
  'Second Section': { title: 'Categorisation', description: 'Category and type classification for the content.' },
  'Organisation Framework Terms': { title: 'Curriculum', description: 'Framework-aligned categorisation.' },
  'Target Framework Terms': { title: 'Target Audience', description: 'Curriculum alignment for the intended learners.' },
  'Fourth Section': { title: 'Licensing & Attribution', description: 'Copyright and usage rights information.' },
};

export interface IFieldConfig extends PreparedField {
  frameworkId?: string;
  categoryCode?: string;
  range?: Array<{ name: string; identifier: string }>;
}

// ----- Tab assignment --------------------------------------------------------
// Sections from the category-definition map to editor tabs. Falls back to a
// per-code map, then to Details.
const SECTION_TAB_MAP: Record<string, PreparedField['tab']> = {
  'First Section': 'details',
  'Second Section': 'details',
  'Organisation Framework Terms': 'details',
  'Target Framework Terms': 'audience',
  'Fourth Section': 'licensing',
};

const FIELD_TAB_MAP: Record<string, PreparedField['tab']> = {
  // Details
  name: 'details', description: 'details', keywords: 'details', appIcon: 'details',
  primaryCategory: 'details', additionalCategories: 'details',
  board: 'details', subject: 'details', subjectIds: 'details', medium: 'details',
  framework: 'details', topicsIds: 'details', topic: 'details',
  // Audience & Curriculum
  audience: 'audience',
  targetBoardIds: 'audience', targetMediumIds: 'audience',
  targetGradeLevelIds: 'audience', targetSubjectIds: 'audience',
  gradeLevel: 'audience',
  // Licensing
  creator: 'licensing', author: 'licensing', attributions: 'licensing', license: 'licensing',
  copyright: 'licensing', copyrightYear: 'licensing',
};

// ----- Framework category mapping (fallback when field has no sourceCategory) -
const FIELD_TO_FW_CATEGORY: Record<string, string> = {
  board: 'board', medium: 'medium', gradeLevel: 'gradeLevel', subject: 'subject',
  subjectIds: 'subject', topicsIds: 'topic', topic: 'topic',
  targetBoardIds: 'board', targetMediumIds: 'medium',
  targetGradeLevelIds: 'gradeLevel', targetSubjectIds: 'subject',
};

// Fields whose values are stored/validated as term identifiers (not names).
const TARGET_FW_FIELDS = new Set(['targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds', 'targetSubjectIds']);

// ----- Public hook -----------------------------------------------------------
export function useFieldPrepare(
  formConfig: Array<Record<string, unknown>>,
  nodeMetadata: Record<string, unknown>,
  frameworkDetails: IFrameworkDetails,
  isRoot: boolean
): PreparedField[] {
  if (!formConfig?.length) return getDefaultFields(nodeMetadata, isRoot, frameworkDetails);

  const seenCodes = new Set<string>();
  return formConfig.filter((field) => {
    // QR/Dial Code is managed via header buttons, not the root form
    if (isRoot && (field.code === 'dialCode' || field.code === 'dialcode')) return false;
    // Honor the API `visible` flag
    if (field.visible === false) return false;
    // Deduplicate — first occurrence of each code wins
    const code = field.code as string;
    if (seenCodes.has(code)) return false;
    seenCodes.add(code);
    return true;
  }).map((field): PreparedField => {
    const code = (field.code as string) ?? '';
    const inputType = resolveInputType(field);
    const options = resolveOptions(field, frameworkDetails, nodeMetadata);
    const rawValue = nodeMetadata[code];
    const currentValue = normalizeCurrentValue(rawValue, inputType);
    return {
      code,
      label: (field.label as string) ?? code,
      inputType,
      required: !!(
        field.required === true ||
        (Array.isArray(field.validations) &&
          (field.validations as Array<Record<string, unknown>>).some(v => v.type === 'required'))
      ),
      editable: field.editable !== false,
      placeholder: field.placeholder as string | undefined,
      maxLength: field.maxLength as number | undefined,
      // Guarantee the stored value is selectable/displayable even when the API
      // gives no option source (primaryCategory, additionalCategories) or the
      // cascade filter trimmed it out — otherwise the widget renders blank.
      options: withSelectedOptions(options, currentValue, inputType, frameworkDetails),
      depends: field.depends as string[] | undefined,
      tab: resolveTab(field),
      section: field.section as string | undefined,
      defaultValue: field.defaultValue ?? field.default,
      currentValue,
    };
  });
}

// ----- Selected-value guarantee ---------------------------------------------
// Build a value→name lookup over every term in both frameworks so a stored
// identifier (e.g. ncf_medium_english) can be labelled "English".
function buildTermLabelMap(fw: IFrameworkDetails): Map<string, string> {
  const map = new Map<string, string>();
  const add = (terms?: ITerm[]) => terms?.forEach(t => {
    if (t.identifier) map.set(t.identifier, t.name);
    if (t.name) map.set(t.name, t.name);
  });
  fw.organisationFramework?.categories?.forEach(c => add(c.terms));
  fw.targetFrameworks?.forEach(f => f.categories?.forEach(c => add(c.terms)));
  return map;
}

// Ensure every selected value is present in the option list (for select /
// multiselect / radio). Missing values are appended, labelled from the
// framework where possible, otherwise from the value itself.
function withSelectedOptions(
  options: Array<{ label: string; value: string }> | undefined,
  currentValue: unknown,
  inputType: PreparedField['inputType'],
  fw: IFrameworkDetails,
): Array<{ label: string; value: string }> | undefined {
  if (inputType !== 'select' && inputType !== 'multiselect' && inputType !== 'radio') return options;
  const values = Array.isArray(currentValue)
    ? currentValue
    : (currentValue != null && currentValue !== '' ? [currentValue] : []);
  if (!values.length) return options;

  const opts = options ? [...options] : [];
  const have = new Set(opts.map(o => o.value));
  const labelMap = buildTermLabelMap(fw);
  for (const v of values) {
    const sv = String(v);
    if (!have.has(sv)) {
      opts.push({ label: labelMap.get(sv) ?? sv, value: sv });
      have.add(sv);
    }
  }
  return opts;
}

// ----- Tab resolver ----------------------------------------------------------
function resolveTab(field: Record<string, unknown>): PreparedField['tab'] {
  const section = field.section as string | undefined;
  if (section && SECTION_TAB_MAP[section]) return SECTION_TAB_MAP[section];
  const code = (field.code as string) ?? '';
  return FIELD_TAB_MAP[code] ?? 'details';
}

// ----- Value normalizer ------------------------------------------------------
// Ensures currentValue matches what the field widget expects:
//   select/text/radio  → scalar string  (takes first element if array)
//   multiselect/chips  → always an array
function normalizeCurrentValue(raw: unknown, inputType: PreparedField['inputType']): unknown {
  const arrayTypes = new Set<PreparedField['inputType']>(['multiselect', 'chips', 'keywords', 'tagsinput']);
  const scalarTypes = new Set<PreparedField['inputType']>(['select', 'text', 'textarea', 'radio', 'datepicker', 'datetime', 'license']);

  if (arrayTypes.has(inputType)) {
    if (Array.isArray(raw)) return raw;
    if (raw !== null && raw !== undefined && raw !== '') return [raw];
    return [];
  }
  if (scalarTypes.has(inputType)) {
    if (Array.isArray(raw)) return raw[0] ?? '';
    return raw ?? '';
  }
  return raw;
}

// ----- Input type resolver --------------------------------------------------
function resolveInputType(field: Record<string, unknown>): PreparedField['inputType'] {
  const type = (field.inputType as string ?? field.dataType as string ?? '').toLowerCase();
  const dataType = (field.dataType as string ?? '').toLowerCase();
  const isList = dataType === 'list';

  if (type === 'select' || type === 'framework') return 'select';
  // Framework category selects (subjectIds, targetMediumIds, …): list ⇒ multi
  if (type === 'frameworkcategoryselect') return isList ? 'multiselect' : 'select';
  if (type === 'topicselector') return 'chips';
  if (type === 'multiselect' || type === 'multi-select') return 'multiselect';
  if (type === 'keywords' || field.code === 'keywords') return 'chips';
  if (field.code === 'topic' || field.code === 'topicsIds') return 'chips';
  if (type === 'radio') return 'radio';
  if (field.code === 'appIcon' || type === 'appicon') return 'appIcon';
  if (type === 'textarea' || field.code === 'description') return 'textarea';
  if (type === 'datepicker' || type === 'date') return 'datepicker';
  if (type === 'datetime' || type === 'datetime-local') return 'datetime';
  if (type === 'tagsinput') return 'tagsinput';
  if (type === 'nestedselect' || type === 'nested-select') return isList ? 'multiselect' : 'select';
  if (type === 'license') return 'license';
  if (type === 'dialcode' || type === 'dial-code') return 'dialcode';
  return 'text';
}

// ----- Options resolver -----------------------------------------------------
function resolveOptions(
  field: Record<string, unknown>,
  fw: IFrameworkDetails,
  nodeMetadata: Record<string, unknown>,
): Array<{ label: string; value: string }> | undefined {
  // 1. Explicit range — either string[] (e.g. audience) or {name, identifier}[]
  const range = field.range as Array<unknown> | undefined;
  if (Array.isArray(range) && range.length) {
    if (typeof range[0] === 'string') {
      return (range as string[]).map(v => ({ label: v, value: v }));
    }
    return (range as Array<{ name: string; identifier: string }>).map(r => ({ label: r.name, value: r.identifier }));
  }
  // 2. enum
  const enumVals = field.enum as string[] | undefined;
  if (enumVals?.length) return enumVals.map(v => ({ label: v, value: v }));

  // 3. Framework-backed — use the field's own sourceCategory, falling back to
  //    the legacy code→category map.
  const code = (field.code as string) ?? '';

  // Channel-derived fields: options come from the channel read API, not the framework API.
  if (code === 'framework') return fw.orgFrameworks;
  if (code === 'additionalCategories') {
    return fw.channelAdditionalCategories?.map(c => ({ label: c, value: c }));
  }

  const categoryCode = (field.sourceCategory as string | undefined) ?? FIELD_TO_FW_CATEGORY[code];
  if (!categoryCode) return undefined;

  return resolveFwOptions(code, categoryCode, field, fw, nodeMetadata);
}

function resolveFwOptions(
  code: string,
  categoryCode: string,
  field: Record<string, unknown>,
  fw: IFrameworkDetails,
  nodeMetadata: Record<string, unknown>,
): Array<{ label: string; value: string }> | undefined {
  // Decide value source: target fields & explicit output:'identifier' use the
  // term identifier; org fields default to the term name (Sunbird convention).
  const useIdentifier =
    TARGET_FW_FIELDS.has(code) ||
    (field.output as string | undefined) === 'identifier' ||
    (typeof (field.section as string) === 'string' && (field.section as string).includes('Target'));

  const fromTerm = (t: ITerm) => ({ label: t.name, value: useIdentifier ? t.identifier : t.name });

  // Source framework: target fields prefer the target framework, then org.
  const orgCat = fw.organisationFramework?.categories?.find(c => c.code === categoryCode);
  const targetCat = fw.targetFrameworks?.[0]?.categories?.find(c => c.code === categoryCode);
  let terms: ITerm[] = (TARGET_FW_FIELDS.has(code) ? targetCat?.terms : orgCat?.terms)
    ?? targetCat?.terms ?? orgCat?.terms ?? [];

  // Cascade filtering: if this field depends on parent fields, keep only terms
  // whose associations include a currently-selected parent value. Parent values
  // are read from nodeMetadata (which merges live form edits), so options
  // re-filter reactively as parents change — no extra fetch needed.
  const depends = field.depends as string[] | undefined;
  if (depends?.length) {
    const parentValues = depends
      .flatMap(p => {
        const v = nodeMetadata[p];
        return Array.isArray(v) ? v : (v != null && v !== '' ? [v] : []);
      })
      .map(String);
    if (parentValues.length) {
      const filtered = terms.filter(t => {
        const assoc = t.associations;
        if (!assoc || !assoc.length) return true; // no association info ⇒ keep
        return assoc.some(a => parentValues.includes(a.identifier) || parentValues.includes(a.code) || parentValues.includes(a.name));
      });
      // Only narrow when the association graph actually matched something —
      // otherwise (associations absent or modelled the other direction) keep
      // the full list so the dropdown isn't emptied.
      if (filtered.length) terms = filtered;
    }
  }

  return terms.map(fromTerm);
}

// ----- Helper ----------------------------------------------------------------
function fwOpts(code: string, fw: IFrameworkDetails) {
  const categoryCode = FIELD_TO_FW_CATEGORY[code];
  if (!categoryCode) return undefined;
  return resolveFwOptions(code, categoryCode, { code }, fw, {});
}

const AUDIENCE_OPTIONS = [
  { label: 'Student', value: 'Student' },
  { label: 'Teacher', value: 'Teacher' },
  { label: 'Administrator', value: 'Administrator' },
  { label: 'Parent', value: 'Parent' },
  { label: 'Other', value: 'Other' },
];

const LICENSE_OPTIONS = [
  { label: 'CC BY 4.0', value: 'CC BY 4.0' },
  { label: 'CC BY-SA 4.0', value: 'CC BY-SA 4.0' },
  { label: 'CC BY-ND 4.0', value: 'CC BY-ND 4.0' },
  { label: 'CC BY-NC 4.0', value: 'CC BY-NC 4.0' },
  { label: 'CC BY-NC-SA 4.0', value: 'CC BY-NC-SA 4.0' },
  { label: 'CC BY-NC-ND 4.0', value: 'CC BY-NC-ND 4.0' },
  { label: 'CC0 1.0', value: 'CC0 1.0' },
  { label: 'All Rights Reserved', value: 'All Rights Reserved' },
];

// ----- Default fields (used when no formConfig from API) --------------------
function cv(meta: Record<string, unknown>, code: string, inputType: PreparedField['inputType']): unknown {
  return normalizeCurrentValue(meta[code], inputType);
}

function getDefaultFields(
  meta: Record<string, unknown>,
  isRoot: boolean,
  fw: IFrameworkDetails,
): PreparedField[] {
  // Fields shown for all nodes (root + units)
  const fields: PreparedField[] = [
    {
      code: 'name', label: 'Title', inputType: 'text', required: true,
      editable: true, tab: 'details', section: 'First Section', maxLength: 200, currentValue: cv(meta, 'name', 'text'),
    },
    {
      code: 'description', label: 'Description', inputType: 'textarea',
      editable: true, tab: 'details', section: 'First Section', maxLength: 2000, currentValue: cv(meta, 'description', 'textarea'),
    },
    {
      code: 'keywords', label: 'Keywords', inputType: 'chips',
      editable: true, tab: 'details', section: 'First Section', currentValue: cv(meta, 'keywords', 'chips'),
    },
  ];

  if (!isRoot) return fields;

  // ── Root (Course) node — Details tab ─────────────────────────────────────
  fields.push(
    {
      code: 'primaryCategory', label: 'Category', inputType: 'select',
      editable: false, tab: 'details', section: 'Second Section', currentValue: cv(meta, 'primaryCategory', 'select'),
      options: [
        { label: 'Course', value: 'Course' },
        { label: 'Digital Textbook', value: 'Digital Textbook' },
        { label: 'Teacher Resource', value: 'Teacher Resource' },
        { label: 'Learning Resource', value: 'Learning Resource' },
        { label: 'Practice Question Set', value: 'Practice Question Set' },
      ],
    },
    {
      code: 'additionalCategories', label: 'Additional Category', inputType: 'multiselect',
      editable: true, tab: 'details', section: 'Second Section', currentValue: cv(meta, 'additionalCategories', 'multiselect'),
      options: [
        { label: 'Lesson Plan', value: 'Lesson Plan' },
        { label: 'Textbook', value: 'Textbook' },
        { label: 'TV Lesson', value: 'TV Lesson' },
        { label: 'Revision Material', value: 'Revision Material' },
      ],
    },
    {
      code: 'board', label: 'Course Type', inputType: 'select',
      required: true, editable: true, tab: 'details', section: 'Organisation Framework Terms',
      options: fwOpts('board', fw), currentValue: cv(meta, 'board', 'select'),
    },
    {
      code: 'subject', label: 'Subjects covered in the course', inputType: 'multiselect',
      required: true, editable: true, tab: 'details', section: 'Organisation Framework Terms',
      options: fwOpts('subject', fw), currentValue: cv(meta, 'subject', 'multiselect'),
    },
  );

  // ── Root (Course) node — Audience & Curriculum tab ───────────────────────
  fields.push(
    {
      code: 'audience', label: 'Audience Type', inputType: 'multiselect',
      editable: true, tab: 'audience', section: 'Target Framework Terms', options: AUDIENCE_OPTIONS,
      currentValue: cv(meta, 'audience', 'multiselect'),
    },
    {
      code: 'targetBoardIds', label: 'Board/Syllabus of the audience', inputType: 'select',
      required: true, editable: true, tab: 'audience', section: 'Target Framework Terms',
      options: fwOpts('targetBoardIds', fw), currentValue: cv(meta, 'targetBoardIds', 'select'),
    },
    {
      code: 'targetMediumIds', label: 'Medium(s) of the audience', inputType: 'multiselect',
      required: true, editable: true, tab: 'audience', section: 'Target Framework Terms', depends: ['targetBoardIds'],
      options: fwOpts('targetMediumIds', fw), currentValue: cv(meta, 'targetMediumIds', 'multiselect'),
    },
    {
      code: 'targetGradeLevelIds', label: 'Class(es) of the audience', inputType: 'multiselect',
      required: true, editable: true, tab: 'audience', section: 'Target Framework Terms', depends: ['targetMediumIds'],
      options: fwOpts('targetGradeLevelIds', fw), currentValue: cv(meta, 'targetGradeLevelIds', 'multiselect'),
    },
    {
      code: 'targetSubjectIds', label: 'Subject(s) of the audience', inputType: 'multiselect',
      required: true, editable: true, tab: 'audience', section: 'Target Framework Terms', depends: ['targetGradeLevelIds'],
      options: fwOpts('targetSubjectIds', fw), currentValue: cv(meta, 'targetSubjectIds', 'multiselect'),
    },
  );

  // ── Root (Course) node — Licensing tab ──────────────────────────────────
  fields.push(
    {
      code: 'creator', label: 'Author', inputType: 'text',
      editable: true, tab: 'licensing', section: 'Fourth Section', currentValue: cv(meta, 'creator', 'text'),
    },
    {
      code: 'attributions', label: 'Attributions', inputType: 'text',
      editable: true, tab: 'licensing', section: 'Fourth Section', currentValue: cv(meta, 'attributions', 'text'),
    },
    {
      code: 'copyright', label: 'Copyright', inputType: 'text',
      required: true, editable: true, tab: 'licensing', section: 'Fourth Section', currentValue: cv(meta, 'copyright', 'text'),
    },
    {
      code: 'copyrightYear', label: 'Copyright Year', inputType: 'text',
      required: true, editable: true, tab: 'licensing', section: 'Fourth Section', currentValue: cv(meta, 'copyrightYear', 'text'),
    },
    {
      code: 'license', label: 'License', inputType: 'select',
      required: true, editable: true, tab: 'licensing', section: 'Fourth Section',
      options: LICENSE_OPTIONS, currentValue: cv(meta, 'license', 'select'),
    },
  );

  return fields;
}
