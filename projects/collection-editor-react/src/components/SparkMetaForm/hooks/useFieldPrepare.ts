import type { IFrameworkDetails } from '../../../types/framework';

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
  defaultValue?: unknown;
  currentValue?: unknown;
}

export interface IFieldConfig extends PreparedField {
  frameworkId?: string;
  categoryCode?: string;
  range?: Array<{ name: string; identifier: string }>;
}

// ----- Tab assignment --------------------------------------------------------
// Org-framework fields (board, subject) live on Details as "Course Type" / "Subjects"
// Target-framework fields live on Audience & Curriculum
const FIELD_TAB_MAP: Record<string, PreparedField['tab']> = {
  // Details
  name: 'details', description: 'details', keywords: 'details', appIcon: 'details',
  primaryCategory: 'details', additionalCategories: 'details',
  board: 'details', subject: 'details', medium: 'details',
  topicsIds: 'details', topic: 'details',
  // Audience & Curriculum
  audience: 'audience',
  targetBoardIds: 'audience', targetMediumIds: 'audience',
  targetGradeLevelIds: 'audience', targetSubjectIds: 'audience',
  gradeLevel: 'audience',
  // Licensing
  creator: 'licensing', attributions: 'licensing', license: 'licensing',
  copyright: 'licensing', copyrightYear: 'licensing',
};

// ----- Framework category mapping -------------------------------------------
const FIELD_TO_FW_CATEGORY: Record<string, string> = {
  board: 'board',
  medium: 'medium',
  gradeLevel: 'gradeLevel',
  subject: 'subject',
  topicsIds: 'topic',
  topic: 'topic',
  targetBoardIds: 'board',
  targetMediumIds: 'medium',
  targetGradeLevelIds: 'gradeLevel',
  targetSubjectIds: 'subject',
};

// Which fields pull from the TARGET framework (not org framework)
const TARGET_FW_FIELDS = new Set(['targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds', 'targetSubjectIds']);

// ----- Public hook -----------------------------------------------------------
export function useFieldPrepare(
  formConfig: Array<Record<string, unknown>>,
  nodeMetadata: Record<string, unknown>,
  frameworkDetails: IFrameworkDetails,
  isRoot: boolean
): PreparedField[] {
  if (!formConfig?.length) return getDefaultFields(nodeMetadata, isRoot, frameworkDetails);

  return formConfig.filter((field) => {
    // QR/Dial Code is managed via header buttons, not the root form
    if (isRoot && (field.code === 'dialCode' || field.code === 'dialcode')) return false;
    return true;
  }).map((field): PreparedField => {
    const code = (field.code as string) ?? '';
    const inputType = resolveInputType(field);
    const options = resolveOptions(field, frameworkDetails);
    const rawValue = nodeMetadata[code];
    return {
      code,
      label: (field.label as string) ?? code,
      inputType,
      required: !!(field.required ?? field.validations),
      editable: field.editable !== false,
      placeholder: field.placeholder as string | undefined,
      maxLength: field.maxLength as number | undefined,
      options,
      depends: field.depends as string[] | undefined,
      tab: FIELD_TAB_MAP[code] ?? 'details',
      defaultValue: field.default,
      currentValue: normalizeCurrentValue(rawValue, inputType),
    };
  });
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
  if (type === 'select' || type === 'framework') return 'select';
  if (type === 'multiselect' || type === 'multi-select') return 'multiselect';
  if (type === 'keywords' || field.code === 'keywords') return 'chips';
  if (field.code === 'topic' || field.code === 'topicsIds') return 'chips';
  if (type === 'radio') return 'radio';
  if (field.code === 'appIcon' || type === 'appicon') return 'appIcon';
  if (type === 'textarea' || field.code === 'description') return 'textarea';
  if (type === 'datepicker' || type === 'date') return 'datepicker';
  if (type === 'datetime' || type === 'datetime-local') return 'datetime';
  if (type === 'tagsinput') return 'tagsinput';
  if (type === 'nestedselect' || type === 'nested-select') return 'nestedselect';
  if (type === 'license') return 'license';
  if (type === 'dialcode' || type === 'dial-code') return 'dialcode';
  return 'text';
}

// ----- Options resolver -----------------------------------------------------
function resolveOptions(
  field: Record<string, unknown>,
  fw: IFrameworkDetails,
): Array<{ label: string; value: string }> | undefined {
  const range = field.range as Array<{ name: string; identifier: string }> | undefined;
  if (range?.length) return range.map(r => ({ label: r.name, value: r.identifier }));
  const enumVals = field.enum as string[] | undefined;
  if (enumVals?.length) return enumVals.map(v => ({ label: v, value: v }));

  const code = (field.code as string) ?? '';
  return resolveFwOptions(code, fw);
}

function resolveFwOptions(
  code: string,
  fw: IFrameworkDetails,
): Array<{ label: string; value: string }> | undefined {
  const categoryCode = FIELD_TO_FW_CATEGORY[code];
  if (!categoryCode) return undefined;

  // target* fields: API validates against term identifiers (e.g. ncf_board_cbse)
  // org fields (board/subject/medium/gradeLevel): API validates against term names (e.g. CBSE)
  const toIdentifier = (t: { name: string; identifier: string }) => ({ label: t.name, value: t.identifier });
  const toName       = (t: { name: string; identifier: string }) => ({ label: t.name, value: t.name });

  if (TARGET_FW_FIELDS.has(code)) {
    const terms = fw.targetFrameworks?.[0]?.categories?.find(c => c.code === categoryCode)?.terms ?? [];
    if (terms.length) return terms.map(toIdentifier);
    const orgTerms = fw.organisationFramework?.categories?.find(c => c.code === categoryCode)?.terms ?? [];
    return orgTerms.map(toIdentifier);
  }

  // Org framework fields — use name as value
  const orgTerms = fw.organisationFramework?.categories?.find(c => c.code === categoryCode)?.terms ?? [];
  if (orgTerms.length) return orgTerms.map(toName);
  const targetTerms = fw.targetFrameworks?.[0]?.categories?.find(c => c.code === categoryCode)?.terms ?? [];
  return targetTerms.map(toName);
}

// ----- Helper ----------------------------------------------------------------
function fwOpts(code: string, fw: IFrameworkDetails) {
  return resolveFwOptions(code, fw);
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
      editable: true, tab: 'details', maxLength: 200, currentValue: cv(meta, 'name', 'text'),
    },
    {
      code: 'description', label: 'Description', inputType: 'textarea',
      editable: true, tab: 'details', maxLength: 2000, currentValue: cv(meta, 'description', 'textarea'),
    },
    {
      code: 'keywords', label: 'Keywords', inputType: 'chips',
      editable: true, tab: 'details', currentValue: cv(meta, 'keywords', 'chips'),
    },
  ];

  if (!isRoot) return fields;

  // ── Root (Course) node — Details tab ─────────────────────────────────────
  fields.push(
    {
      code: 'appIcon', label: 'Icon', inputType: 'appIcon',
      editable: true, tab: 'details', currentValue: meta.appIcon,
    },
    {
      code: 'primaryCategory', label: 'Category', inputType: 'select',
      editable: false, tab: 'details', currentValue: cv(meta, 'primaryCategory', 'select'),
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
      editable: true, tab: 'details', currentValue: cv(meta, 'additionalCategories', 'multiselect'),
      options: [
        { label: 'Lesson Plan', value: 'Lesson Plan' },
        { label: 'Textbook', value: 'Textbook' },
        { label: 'TV Lesson', value: 'TV Lesson' },
        { label: 'Revision Material', value: 'Revision Material' },
      ],
    },
    {
      code: 'board', label: 'Course Type', inputType: 'select',
      required: true, editable: true, tab: 'details',
      options: fwOpts('board', fw), currentValue: cv(meta, 'board', 'select'),
    },
    {
      code: 'subject', label: 'Subjects covered in the course', inputType: 'multiselect',
      required: true, editable: true, tab: 'details',
      options: fwOpts('subject', fw), currentValue: cv(meta, 'subject', 'multiselect'),
    },
  );

  // ── Root (Course) node — Audience & Curriculum tab ───────────────────────
  fields.push(
    {
      code: 'audience', label: 'Audience Type', inputType: 'multiselect',
      editable: true, tab: 'audience', options: AUDIENCE_OPTIONS,
      currentValue: cv(meta, 'audience', 'multiselect'),
    },
    {
      code: 'targetBoardIds', label: 'Board/Syllabus of the audience', inputType: 'select',
      required: true, editable: true, tab: 'audience',
      options: fwOpts('targetBoardIds', fw), currentValue: cv(meta, 'targetBoardIds', 'select'),
    },
    {
      code: 'targetMediumIds', label: 'Medium(s) of the audience', inputType: 'multiselect',
      required: true, editable: true, tab: 'audience', depends: ['targetBoardIds'],
      options: fwOpts('targetMediumIds', fw), currentValue: cv(meta, 'targetMediumIds', 'multiselect'),
    },
    {
      code: 'targetGradeLevelIds', label: 'Class(es) of the audience', inputType: 'multiselect',
      required: true, editable: true, tab: 'audience', depends: ['targetMediumIds'],
      options: fwOpts('targetGradeLevelIds', fw), currentValue: cv(meta, 'targetGradeLevelIds', 'multiselect'),
    },
    {
      code: 'targetSubjectIds', label: 'Subject(s) of the audience', inputType: 'multiselect',
      required: true, editable: true, tab: 'audience', depends: ['targetGradeLevelIds'],
      options: fwOpts('targetSubjectIds', fw), currentValue: cv(meta, 'targetSubjectIds', 'multiselect'),
    },
  );

  // ── Root (Course) node — Licensing tab ──────────────────────────────────
  fields.push(
    {
      code: 'creator', label: 'Author', inputType: 'text',
      editable: true, tab: 'licensing', currentValue: cv(meta, 'creator', 'text'),
    },
    {
      code: 'attributions', label: 'Attributions', inputType: 'text',
      editable: true, tab: 'licensing', currentValue: cv(meta, 'attributions', 'text'),
    },
    {
      code: 'copyright', label: 'Copyright', inputType: 'text',
      required: true, editable: true, tab: 'licensing', currentValue: cv(meta, 'copyright', 'text'),
    },
    {
      code: 'copyrightYear', label: 'Copyright Year', inputType: 'text',
      required: true, editable: true, tab: 'licensing', currentValue: cv(meta, 'copyrightYear', 'text'),
    },
    {
      code: 'license', label: 'License', inputType: 'select',
      required: true, editable: true, tab: 'licensing',
      options: LICENSE_OPTIONS, currentValue: cv(meta, 'license', 'select'),
    },
  );

  return fields;
}
