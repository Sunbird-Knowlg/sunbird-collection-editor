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
  visible?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: Array<{ label: string; value: string }>;
  levels?: NestedSelectLevel[];
  depends?: string[];
  tab: 'details' | 'audience' | 'licensing';
  section?: string;
  /** Framework category the field's options are sourced from (board/medium/…). */
  sourceCategory?: string;
  defaultValue?: unknown;
  currentValue?: unknown;
}

export const SECTION_DISPLAY: Record<string, { title: string; description?: string }> = {
  'First Section':  { title: 'Basic Information', description: 'Core details that define the content identity.' },
  'Second Section': { title: 'Categorisation', description: 'Category and type classification for the content.' },
  'Third Section':  { title: 'Categorisation', description: 'Category and type classification for the content.' },
  'Organisation Framework Terms': { title: 'Curriculum', description: 'Framework-aligned categorisation.' },
  'Target Framework Terms': { title: 'Target Audience', description: 'Curriculum alignment for the intended learners.' },
  'Fourth Section': { title: 'Licensing & Attribution', description: 'Copyright and usage rights information.' },
  'Sixth Section':  { title: 'Licensing & Attribution', description: 'Copyright and usage rights information.' },
};

export interface IFieldConfig extends PreparedField {
  frameworkId?: string;
  categoryCode?: string;
  range?: Array<{ name: string; identifier: string }>;
}

/**
 * Extra context the form needs to seed defaults / ranges and to decide
 * per-field editability — mirrors the data Angular reads from EditorService,
 * HelperService.channelInfo and ConfigService inside `prepareFields` /
 * `ifFieldIsEditable`. All fields optional so existing callers keep working.
 */
export interface IPrepareContext {
  editorMode?: string;
  /** editorConfig.config.editableFields — { review: ['name', …], … }. */
  editableFields?: Record<string, string[]>;
  /** editorConfig.config.objectType — picks the channel additionalCategories source. */
  objectType?: string;
  setDefaultCopyRight?: boolean;
  /** editorConfig.context.defaultLicense */
  defaultLicense?: string;
  /** editorConfig.context.additionalCategories (fallback). */
  contextAdditionalCategories?: string[];
  /** editorConfig.context.user.fullName */
  userFullName?: string;
  /** channelInfo.name — default copyright whenever the field is empty. */
  channelName?: string;
  /** channelInfo.collectionAdditionalCategories */
  collectionAdditionalCategories?: string[];
  /** channelInfo.contentAdditionalCategories */
  contentAdditionalCategories?: string[];
  /** Count of the active node's direct children — feeds maxQuestions range. */
  childCount?: number;
}

const REVIEW_MODES = new Set(['review', 'read', 'sourcingreview', 'orgreview']);

// ----- Tab assignment --------------------------------------------------------
// Sections from the category-definition map to editor tabs. Falls back to a
// per-code map, then to Details.
const SECTION_TAB_MAP: Record<string, PreparedField['tab']> = {
  'First Section':  'details',
  'Second Section': 'details',
  'Third Section':  'details',   // Content Playlist: primaryCategory, additionalCategories
  'Organisation Framework Terms': 'details',
  'Target Framework Terms': 'audience',
  'Fourth Section': 'licensing',
  'Sixth Section':  'licensing', // Content Playlist: author, copyright, license
};

// Alias map for live APIs that use section display title as the machine name.
const SECTION_TITLE_ALIAS: Record<string, string> = {
  'Categorisation':          'Second Section',
  'Basic Information':       'First Section',
  'Licensing & Attribution': 'Fourth Section',
  'Curriculum':              'Organisation Framework Terms',
  'Target Audience':         'Target Framework Terms',
};

const FIELD_TAB_MAP: Record<string, PreparedField['tab']> = {
  // Details
  name: 'details', description: 'details', keywords: 'details', appIcon: 'details',
  primaryCategory: 'details', additionalCategories: 'details',
  board: 'details', boardIds: 'details', subject: 'details', subjectIds: 'details', medium: 'details',
  framework: 'details', topicsIds: 'details', topic: 'details',
  dialcodeRequired: 'details', dialcodes: 'details',
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
  board: 'board', boardIds: 'board', medium: 'medium', gradeLevel: 'gradeLevel', subject: 'subject',
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
  isRoot: boolean,
  ctx: IPrepareContext = {},
): PreparedField[] {
  if (!formConfig?.length) {
    return adaptFrameworkFields(
      getDefaultFields(nodeMetadata, isRoot, frameworkDetails),
      frameworkDetails, nodeMetadata, isRoot,
    );
  }

  // Code → raw field config, so a dependent field can read its PARENT field's
  // sourceCategory (mirrors Angular's `findField(parentCode)`).
  const fieldsByCode = new Map<string, Record<string, unknown>>();
  for (const f of formConfig) {
    const c = f.code as string;
    if (c && !fieldsByCode.has(c)) fieldsByCode.set(c, f);
  }

  const seenCodes = new Set<string>();
  const prepared = formConfig.filter((field) => {
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
    const options = resolveOptions(field, frameworkDetails, nodeMetadata, fieldsByCode, ctx);
    const rawValue = nodeMetadata[code];
    const currentValue = applyFieldDefault(
      code, normalizeCurrentValue(rawValue, inputType), inputType, nodeMetadata, ctx,
    );
    const base: PreparedField = {
      code,
      label: (field.label as string) ?? code,
      inputType,
      required: !!(
        field.required === true ||
        (Array.isArray(field.validations) &&
          (field.validations as Array<Record<string, unknown>>).some(v => v.type === 'required'))
      ),
      editable: computeEditable(code, field.editable !== false, ctx),
      placeholder: field.placeholder as string | undefined,
      maxLength: field.maxLength as number | undefined,
      // Guarantee the stored value is selectable/displayable even when the API
      // gives no option source (primaryCategory, additionalCategories) or the
      // cascade filter trimmed it out — otherwise the widget renders blank.
      options: withSelectedOptions(options, currentValue, inputType, frameworkDetails),
      depends: field.depends as string[] | undefined,
      tab: resolveTab(field),
      section: field.section as string | undefined,
      sourceCategory: field.sourceCategory as string | undefined,
      defaultValue: field.defaultValue ?? field.default,
      currentValue,
    };

    // dialcodes is only visible and required when dialcodeRequired === 'Yes'.
    // The API marks it required unconditionally; override here to respect the
    // QR code toggle (default is "No").
    if (code === 'dialcodes') {
      const isQrRequired = (nodeMetadata['dialcodeRequired'] as string | undefined) === 'Yes';
      return { ...base, required: isQrRequired, visible: isQrRequired };
    }

    return base;
  });

  return adaptFrameworkFields(prepared, frameworkDetails, nodeMetadata, isRoot);
}

// ----- Editability (mirrors Angular ifFieldIsEditable) -----------------------
// Outside review modes a field is editable unless the API marked it
// non-editable. Inside a review mode (review/read/sourcingreview/orgreview) a
// field is editable ONLY if editorConfig.config.editableFields[mode] lists it.
function computeEditable(code: string, apiEditable: boolean, ctx: IPrepareContext): boolean {
  const mode = ctx.editorMode ?? 'edit';
  if (!REVIEW_MODES.has(mode)) {
    return apiEditable !== false;
  }
  const allowed = ctx.editableFields?.[mode];
  return !!(allowed && allowed.includes(code));
}

// ----- Per-field default & range seeding (mirrors prepareFields 180-244) -----
// Returns the effective currentValue. Only fills a value when the node has
// none — never overrides authored metadata.
function applyFieldDefault(
  code: string,
  currentValue: unknown,
  inputType: PreparedField['inputType'],
  meta: Record<string, unknown>,
  ctx: IPrepareContext,
): unknown {
  const isEmpty = currentValue === undefined || currentValue === null || currentValue === ''
    || (Array.isArray(currentValue) && currentValue.length === 0);

  switch (code) {
    case 'license':
      if (isEmpty) return ctx.defaultLicense ?? '';
      return currentValue;
    case 'copyright':
      // Default to the tenant/channel name whenever empty.
      if (isEmpty && ctx.channelName) return ctx.channelName;
      return currentValue;
    case 'copyrightYear':
      // Default to the current year; stays editable.
      if (isEmpty) return String(new Date().getFullYear());
      return currentValue;
    case 'author':
    case 'creator':
      if (isEmpty && ctx.userFullName) return ctx.userFullName;
      return currentValue;
    case 'instructions': {
      // metadata.instructions is an object { default: '...' }; always surface its
      // `default` string (Angular: _.get(meta, 'instructions.default') || '').
      const inst = meta['instructions'];
      if (inst && typeof inst === 'object' && !Array.isArray(inst)) {
        return ((inst as Record<string, unknown>)['default'] as string) ?? '';
      }
      return typeof currentValue === 'object' && currentValue !== null ? '' : currentValue;
    }
    case 'maxTime':
    case 'warningTime': {
      if (!isEmpty) return currentValue;
      const limits = meta['timeLimits'] as Record<string, unknown> | undefined;
      const raw = limits?.[code];
      if (raw !== undefined && raw !== null && raw !== '') {
        return formatDurationSeconds(Number(raw));
      }
      return currentValue;
    }
    default:
      return currentValue;
  }
}

// seconds → 'HH:MM:SS' (or 'MM:SS' when under an hour) — replaces moment.
function formatDurationSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '';
  const s = Math.floor(totalSeconds % 60);
  const m = Math.floor((totalSeconds / 60) % 60);
  const h = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
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
  if (section) {
    if (SECTION_TAB_MAP[section]) return SECTION_TAB_MAP[section];
    const alias = SECTION_TITLE_ALIAS[section];
    if (alias && SECTION_TAB_MAP[alias]) return SECTION_TAB_MAP[alias];
  }
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

  if (type === 'select') return 'select';
  // 'framework' inputType: respect dataType — list means multiple boards/frameworks allowed
  if (type === 'framework') return isList ? 'multiselect' : 'select';
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
  fieldsByCode: Map<string, Record<string, unknown>>,
  ctx: IPrepareContext,
): Array<{ label: string; value: string }> | undefined {
  const code = (field.code as string) ?? '';

  // maxQuestions: range is 1..(child count) — mirrors Angular's _.times(childCount).
  if (code === 'maxQuestions') {
    const n = ctx.childCount ?? 0;
    if (n > 0) return Array.from({ length: n }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }));
  }

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

  // Channel-derived fields: options come from the channel read API, not the framework API.
  if (code === 'framework') return fw.orgFrameworks;
  if (code === 'additionalCategories') {
    // Source depends on objectType: QuestionSet → contentAdditionalCategories,
    // otherwise collectionAdditionalCategories; falls back to context list.
    // (mirrors categoryConfig.additionalCategories[objectType] ∥ context.additionalCategories)
    const objType = ctx.objectType ?? '';
    const channelList = objType === 'QuestionSet'
      ? (ctx.contentAdditionalCategories ?? ctx.collectionAdditionalCategories)
      : (ctx.collectionAdditionalCategories ?? ctx.contentAdditionalCategories);
    const list = (channelList && channelList.length ? channelList : ctx.contextAdditionalCategories)
      ?? fw.channelAdditionalCategories;
    return list?.length ? uniq(list).map(c => ({ label: c, value: c })) : undefined;
  }

  // 3. Framework-backed — use the field's own sourceCategory, falling back to
  //    the legacy code→category map.
  const categoryCode = (field.sourceCategory as string | undefined) ?? FIELD_TO_FW_CATEGORY[code];
  if (!categoryCode) return undefined;

  return resolveFwOptions(code, categoryCode, field, fw, nodeMetadata, fieldsByCode);
}

// Decide whether a field's value is the term identifier (target fields,
// explicit output:'identifier', Target sections) or the term name (org default).
function usesIdentifier(code: string, field: Record<string, unknown>): boolean {
  return (
    TARGET_FW_FIELDS.has(code) ||
    (field.output as string | undefined) === 'identifier' ||
    (typeof (field.section as string) === 'string' && (field.section as string).includes('Target'))
  );
}

function prefersTargetFramework(code: string, field: Record<string, unknown>): boolean {
  return TARGET_FW_FIELDS.has(code) ||
    (typeof (field.section as string) === 'string' && (field.section as string).includes('Target'));
}

// Terms of a single framework category. Org cascade reads from the org
// framework; target cascade prefers the target framework, falling back to org.
function categoryTerms(fw: IFrameworkDetails, categoryCode: string, preferTarget: boolean): ITerm[] {
  const orgCat = fw.organisationFramework?.categories?.find(c => c.code === categoryCode);
  const targetCat = fw.targetFrameworks?.[0]?.categories?.find(c => c.code === categoryCode);
  if (preferTarget) return targetCat?.terms ?? orgCat?.terms ?? [];
  return orgCat?.terms ?? targetCat?.terms ?? [];
}

function uniqByIdentifier(terms: ITerm[]): ITerm[] {
  const seen = new Set<string>();
  const out: ITerm[] = [];
  for (const t of terms) {
    const key = t.identifier ?? t.name;
    if (key && !seen.has(key)) { seen.add(key); out.push(t); }
  }
  return out;
}

function uniq<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }

function asArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  return v != null && v !== '' ? [v] : [];
}

/**
 * Compute a framework-backed dropdown's options.
 *
 * Mirrors Angular `computeOptions` (spark-meta-form.component.ts:333-366):
 * a dependent field's options come from the SELECTED PARENT term's
 * `.associations`, filtered to this field's category — i.e. the graph is read
 * PARENT → CHILD. (The previous React code read CHILD → PARENT, which dropped
 * valid terms — e.g. "English" — whose own associations didn't point back at
 * the selected board. That was the "English not in Medium" bug.)
 *
 * Fallback (mirrors Angular's target-framework association synthesis,
 * prepareFields:144-178): when the matched parent terms carry no associations
 * for this category — common for target frameworks, or frameworks modelled in
 * reverse — fall back to this field's own category terms so the dropdown is
 * never wrongly emptied.
 */
function resolveFwOptions(
  code: string,
  categoryCode: string,
  field: Record<string, unknown>,
  fw: IFrameworkDetails,
  nodeMetadata: Record<string, unknown>,
  fieldsByCode: Map<string, Record<string, unknown>>,
): Array<{ label: string; value: string }> | undefined {
  const useIdentifier = usesIdentifier(code, field);
  const preferTarget = prefersTargetFramework(code, field);
  const fromTerm = (t: ITerm) => ({ label: t.name, value: useIdentifier ? t.identifier : t.name });

  const depends = field.depends as string[] | undefined;

  // Non-dependent field → its own category terms.
  if (!depends?.length) {
    return categoryTerms(fw, categoryCode, preferTarget).map(fromTerm);
  }

  // Dependent field → read the selected parent term's associations.
  const selected = depends.flatMap(p => asArray(nodeMetadata[p])).map(String);
  // Empty until a parent is chosen — matches Angular (computeOptions returns []).
  if (!selected.length) return [];

  // Gather parent terms (each carries `.associations`).
  const parentTerms: ITerm[] = [];
  for (const pCode of depends) {
    const pField = fieldsByCode.get(pCode);
    const pCat = (pField?.sourceCategory as string | undefined) ?? FIELD_TO_FW_CATEGORY[pCode] ?? pCode;
    parentTerms.push(...categoryTerms(fw, pCat, preferTarget));
  }

  // Parent terms matching the selected parent value(s) (by name / identifier / code).
  const matched = parentTerms.filter(t =>
    selected.includes(String(t.name)) ||
    selected.includes(String(t.identifier)) ||
    selected.includes(String(t.code)));

  // Their associations, filtered to THIS field's category.
  const associations = matched
    .flatMap(t => t.associations ?? [])
    .filter(a => String(a.category ?? '').toLowerCase() === categoryCode.toLowerCase());

  const uniqueAssoc = uniqByIdentifier(associations);
  if (uniqueAssoc.length) return uniqueAssoc.map(fromTerm);

  // Fallback: parents carry no associations for this category (target frameworks
  // / reverse-modelled data) → show the child's own terms. Equivalent outcome
  // to Angular's cross-product synthesis, without emptying the dropdown.
  return categoryTerms(fw, categoryCode, preferTarget).map(fromTerm);
}

// ----- Helper ----------------------------------------------------------------
function fwOpts(code: string, fw: IFrameworkDetails) {
  const categoryCode = FIELD_TO_FW_CATEGORY[code];
  if (!categoryCode) return undefined;
  return resolveFwOptions(code, categoryCode, { code }, fw, {}, new Map());
}

// ----- Default fields (used when no formConfig from API) --------------------
// Structural skeleton only — no hardcoded options. All option values come from
// the API category definition; this fallback exists only for graceful degradation.
function cv(meta: Record<string, unknown>, code: string, inputType: PreparedField['inputType']): unknown {
  return normalizeCurrentValue(meta[code], inputType);
}

// Category codes of the classic K-12 (BMGS) framework shape. When the resolved
// framework has none of these (e.g. a skills framework with industry/domain/
// skill), the hardcoded BMGS skeleton would render only empty required
// dropdowns — so the framework fields are generated from the framework's own
// categories instead.
const K12_CATEGORY_CODES = ['board', 'medium', 'gradeLevel', 'subject'];

function isK12Framework(fw: IFrameworkDetails): boolean {
  const categories = fw.organisationFramework?.categories ?? [];
  // Treat "not loaded yet" as K-12 so the familiar skeleton renders while the
  // framework read is in flight (options fill in once it resolves).
  if (!categories.length) return true;
  return categories.some(c => K12_CATEGORY_CODES.includes(c.code));
}

function frameworkHasCategory(fw: IFrameworkDetails, categoryCode: string): boolean {
  return !!(
    fw.organisationFramework?.categories?.some(c => c.code === categoryCode) ||
    fw.targetFrameworks?.some(f => f.categories?.some(c => c.code === categoryCode))
  );
}

/**
 * Adapt a prepared field list to the shape of the resolved framework. Applied
 * to BOTH the API-form-config path and the local defaults path (the server's
 * category definition hardcodes the BMGS field set too, so patching only the
 * defaults left production — which gets a `create` form from the API — broken).
 *
 * For K-12 (BMGS) frameworks, or while the framework read is still in flight,
 * this is a no-op. For custom frameworks (e.g. USF: industry/domain/skill):
 * - drops framework-backed fields whose category doesn't exist in the resolved
 *   org/target frameworks (they'd render as empty required dropdowns that
 *   block validation);
 * - inserts one optional multiselect per actual framework category, saved
 *   under the category code, right after the 'framework' (Course Type) field.
 */
function adaptFrameworkFields(
  fields: PreparedField[],
  fw: IFrameworkDetails,
  meta: Record<string, unknown>,
  isRoot: boolean,
): PreparedField[] {
  if (!isRoot || isK12Framework(fw)) return fields;

  const kept = fields.filter(f => {
    const categoryCode = f.sourceCategory ?? FIELD_TO_FW_CATEGORY[f.code];
    return !categoryCode || frameworkHasCategory(fw, categoryCode);
  });

  const existingCodes = new Set(kept.map(f => f.code));
  const dynamic: PreparedField[] = [];
  for (const cat of fw.organisationFramework?.categories ?? []) {
    if (existingCodes.has(cat.code)) continue;
    dynamic.push({
      code: cat.code, label: cat.name, inputType: 'multiselect',
      editable: true, tab: 'details', section: 'Organisation Framework Terms',
      options: (cat.terms ?? []).map(t => ({ label: t.name, value: t.name })),
      currentValue: cv(meta, cat.code, 'multiselect'),
    });
  }
  if (!dynamic.length) return kept;

  const frameworkFieldIndex = kept.findIndex(f => f.code === 'framework');
  if (frameworkFieldIndex >= 0) {
    return [
      ...kept.slice(0, frameworkFieldIndex + 1),
      ...dynamic,
      ...kept.slice(frameworkFieldIndex + 1),
    ];
  }
  return [...kept, ...dynamic];
}

function getDefaultFields(
  meta: Record<string, unknown>,
  isRoot: boolean,
  fw: IFrameworkDetails,
): PreparedField[] {
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

  // ── Root node — Details tab ───────────────────────────────────────────────
  fields.push(
    {
      code: 'primaryCategory', label: 'Category', inputType: 'select',
      editable: false, tab: 'details', section: 'Second Section', currentValue: cv(meta, 'primaryCategory', 'select'),
    },
    {
      code: 'additionalCategories', label: 'Additional Category', inputType: 'multiselect',
      editable: true, tab: 'details', section: 'Second Section', currentValue: cv(meta, 'additionalCategories', 'multiselect'),
      options: fw.channelAdditionalCategories?.map(c => ({ label: c, value: c })),
    },
    {
      code: 'framework', label: 'Course Type', inputType: 'select',
      required: true, editable: true, tab: 'details', section: 'Organisation Framework Terms',
      options: fw.orgFrameworks, currentValue: cv(meta, 'framework', 'select'),
    },
    {
      code: 'subjectIds', label: 'Subjects covered', inputType: 'multiselect',
      required: true, editable: true, tab: 'details', section: 'Organisation Framework Terms',
      options: fwOpts('subjectIds', fw), currentValue: cv(meta, 'subjectIds', 'multiselect'),
    },
  );

  // ── Root node — Audience & Curriculum tab ─────────────────────────────────
  fields.push(
    {
      code: 'audience', label: 'Audience Type', inputType: 'multiselect',
      editable: true, tab: 'audience', section: 'Target Framework Terms',
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

  // ── Root node — Licensing tab ─────────────────────────────────────────────
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
      currentValue: cv(meta, 'license', 'select'),
    },
  );

  return fields;
}

// ----- Testable pure export --------------------------------------------------
// Direct access to the cascade resolver for unit tests (the "English in Medium"
// regression guard). Mirrors what useFieldPrepare computes for one field.
export function __computeFieldOptionsForTest(
  field: Record<string, unknown>,
  fw: IFrameworkDetails,
  nodeMetadata: Record<string, unknown>,
  siblingFields: Array<Record<string, unknown>> = [],
): Array<{ label: string; value: string }> | undefined {
  const fieldsByCode = new Map<string, Record<string, unknown>>();
  for (const f of siblingFields) {
    const c = f.code as string;
    if (c && !fieldsByCode.has(c)) fieldsByCode.set(c, f);
  }
  return resolveOptions(field, fw, nodeMetadata, fieldsByCode, {});
}
