import { describe, it, expect } from 'vitest';
import { useFieldPrepare } from './useFieldPrepare';
import type { IFrameworkDetails } from '../../../types/framework';

const fw: IFrameworkDetails = {};
const find = (fields: ReturnType<typeof useFieldPrepare>, code: string) => fields.find(f => f.code === code)!;

describe('per-field default seeding (mirrors prepareFields 180-244)', () => {
  it('defaults copyright to the channel name whenever empty', () => {
    const cfg = [{ code: 'copyright', label: 'Copyright' }];
    const seeded = find(useFieldPrepare(cfg, {}, fw, true, { setDefaultCopyRight: true, channelName: 'Acme Org' }), 'copyright');
    expect(seeded.currentValue).toBe('Acme Org');
    // No setDefaultCopyRight flag needed — channel name is the default.
    const alsoSeeded = find(useFieldPrepare(cfg, {}, fw, true, { channelName: 'Acme Org' }), 'copyright');
    expect(alsoSeeded.currentValue).toBe('Acme Org');
  });

  it('defaults copyrightYear to the current year and keeps it editable', () => {
    const cfg = [{ code: 'copyrightYear', label: 'Copyright Year' }];
    const f = find(useFieldPrepare(cfg, {}, fw, true, {}), 'copyrightYear');
    expect(f.currentValue).toBe(String(new Date().getFullYear()));
    expect(f.editable).toBe(true);
    const authored = find(useFieldPrepare(cfg, { copyrightYear: '2020' }, fw, true, {}), 'copyrightYear');
    expect(authored.currentValue).toBe('2020');
  });

  it('does not override an authored copyright value', () => {
    const cfg = [{ code: 'copyright', label: 'Copyright' }];
    const f = find(useFieldPrepare(cfg, { copyright: 'Existing' }, fw, true, { setDefaultCopyRight: true, channelName: 'Acme' }), 'copyright');
    expect(f.currentValue).toBe('Existing');
  });

  it('defaults author to the user full name and keeps it editable', () => {
    const cfg = [{ code: 'author', label: 'Author' }];
    const f = find(useFieldPrepare(cfg, {}, fw, true, { userFullName: 'Jane Doe', editorMode: 'edit' }), 'author');
    expect(f.currentValue).toBe('Jane Doe');
    expect(f.editable).toBe(true);
  });

  it('defaults license to the context/channel default license', () => {
    const cfg = [{ code: 'license', label: 'License', inputType: 'license' }];
    const f = find(useFieldPrepare(cfg, {}, fw, true, { defaultLicense: 'CC BY 4.0' }), 'license');
    expect(f.currentValue).toBe('CC BY 4.0');
  });

  it('reads instructions.default for the instructions field', () => {
    const cfg = [{ code: 'instructions', label: 'Instructions', inputType: 'textarea' }];
    const f = find(useFieldPrepare(cfg, { instructions: { default: 'Read carefully' } }, fw, true, {}), 'instructions');
    expect(f.currentValue).toBe('Read carefully');
  });

  it('sources additionalCategories per objectType', () => {
    const cfg = [{ code: 'additionalCategories', label: 'Additional', inputType: 'multiselect' }];
    const collection = find(useFieldPrepare(cfg, {}, fw, true, {
      objectType: 'Collection', collectionAdditionalCategories: ['Textbook'], contentAdditionalCategories: ['Explanation'],
    }), 'additionalCategories');
    expect(collection.options?.map(o => o.value)).toEqual(['Textbook']);

    const qset = find(useFieldPrepare(cfg, {}, fw, true, {
      objectType: 'QuestionSet', collectionAdditionalCategories: ['Textbook'], contentAdditionalCategories: ['Explanation'],
    }), 'additionalCategories');
    expect(qset.options?.map(o => o.value)).toEqual(['Explanation']);
  });
});

describe('per-field editability (mirrors ifFieldIsEditable)', () => {
  const cfg = [{ code: 'name', label: 'Name' }, { code: 'description', label: 'Desc', inputType: 'textarea' }];

  it('is editable in edit mode unless the API marks it non-editable', () => {
    const fields = useFieldPrepare([...cfg, { code: 'locked', label: 'L', editable: false }], {}, fw, true, { editorMode: 'edit' });
    expect(find(fields, 'name').editable).toBe(true);
    expect(find(fields, 'locked').editable).toBe(false);
  });

  it('in review mode only editableFields[review] codes stay editable', () => {
    const fields = useFieldPrepare(cfg, {}, fw, true, { editorMode: 'review', editableFields: { review: ['name'] } });
    expect(find(fields, 'name').editable).toBe(true);
    expect(find(fields, 'description').editable).toBe(false);
  });

  it('locks all fields in read mode with no editableFields', () => {
    const fields = useFieldPrepare(cfg, {}, fw, true, { editorMode: 'read' });
    expect(find(fields, 'name').editable).toBe(false);
    expect(find(fields, 'description').editable).toBe(false);
  });
});

describe('default framework fields adapt to the framework shape', () => {
  const usfFw: IFrameworkDetails = {
    organisationFramework: {
      identifier: 'USF', name: 'USF', code: 'USF',
      categories: [
        {
          identifier: 'usf_industry', name: 'Industry', code: 'industry',
          terms: [{ identifier: 'usf_industry_it', name: 'Information Technology', code: 'it' }],
        },
        { identifier: 'usf_domain', name: 'Domain', code: 'domain', terms: [] },
        { identifier: 'usf_skill', name: 'Skill', code: 'skill', terms: [] },
      ],
    },
  };
  const ncfFw: IFrameworkDetails = {
    organisationFramework: {
      identifier: 'NCF', name: 'NCF', code: 'NCF',
      categories: [
        { identifier: 'ncf_board', name: 'Board', code: 'board', terms: [] },
        { identifier: 'ncf_medium', name: 'Medium', code: 'medium', terms: [] },
      ],
    },
  };

  it('generates one optional field per category for non-K12 frameworks and drops the BMGS cascade', () => {
    const fields = useFieldPrepare([], {}, usfFw, true, {});
    const codes = fields.map(f => f.code);
    expect(codes).toEqual(expect.arrayContaining(['industry', 'domain', 'skill']));
    expect(codes).not.toContain('subjectIds');
    expect(codes).not.toContain('targetBoardIds');
    expect(codes).not.toContain('targetMediumIds');
    expect(codes).not.toContain('targetGradeLevelIds');
    expect(codes).not.toContain('targetSubjectIds');
    const industry = find(fields, 'industry');
    expect(industry.required).toBeFalsy();
    expect(industry.tab).toBe('details');
    expect(industry.options?.map(o => o.value)).toEqual(['Information Technology']);
  });

  it('keeps the BMGS skeleton for K-12 frameworks', () => {
    const fields = useFieldPrepare([], {}, ncfFw, true, {});
    const codes = fields.map(f => f.code);
    expect(codes).toContain('subjectIds');
    expect(codes).toContain('targetBoardIds');
    expect(codes).not.toContain('board');
  });

  it('keeps the BMGS skeleton while the framework has not loaded yet', () => {
    const fields = useFieldPrepare([], {}, {}, true, {});
    expect(fields.map(f => f.code)).toContain('targetBoardIds');
  });

  // Production regression: the server's category definition returns a `create`
  // form that hardcodes the BMGS field set — the adaptation must apply to the
  // API-form-config path too, not just the local defaults.
  it('adapts an API form config to a non-K12 framework (drops BMGS, injects category fields)', () => {
    const apiCreateForm = [
      { code: 'name', label: 'Title', section: 'First Section' },
      { code: 'framework', label: 'Course Type', section: 'Organisation Framework Terms' },
      { code: 'subjectIds', label: 'Subjects covered', sourceCategory: 'subject', section: 'Organisation Framework Terms' },
      { code: 'topicsIds', label: 'Topics', sourceCategory: 'topic', section: 'Organisation Framework Terms' },
      { code: 'audience', label: 'Audience Type', section: 'Target Framework Terms' },
      { code: 'targetBoardIds', label: 'Board/Syllabus of the audience', sourceCategory: 'board', section: 'Target Framework Terms' },
      { code: 'targetMediumIds', label: 'Medium(s) of the audience', sourceCategory: 'medium', section: 'Target Framework Terms' },
      { code: 'license', label: 'License', section: 'Fourth Section' },
    ];
    const fields = useFieldPrepare(apiCreateForm, {}, usfFw, true, {});
    const codes = fields.map(f => f.code);
    // Non-framework fields survive untouched.
    expect(codes).toEqual(expect.arrayContaining(['name', 'framework', 'audience', 'license']));
    // BMGS/topic fields whose category is absent from USF are dropped.
    expect(codes).not.toContain('subjectIds');
    expect(codes).not.toContain('topicsIds');
    expect(codes).not.toContain('targetBoardIds');
    expect(codes).not.toContain('targetMediumIds');
    // USF's own categories are injected right after the framework field.
    expect(codes).toEqual(expect.arrayContaining(['industry', 'domain', 'skill']));
    expect(codes.indexOf('industry')).toBe(codes.indexOf('framework') + 1);
    const industry = find(fields, 'industry');
    expect(industry.required).toBeFalsy();
    expect(industry.options?.map(o => o.value)).toEqual(['Information Technology']);
  });

  it('leaves an API form config untouched for K-12 frameworks', () => {
    const apiCreateForm = [
      { code: 'framework', label: 'Course Type', section: 'Organisation Framework Terms' },
      { code: 'targetBoardIds', label: 'Board/Syllabus of the audience', sourceCategory: 'board', section: 'Target Framework Terms' },
    ];
    const fields = useFieldPrepare(apiCreateForm, {}, ncfFw, true, {});
    const codes = fields.map(f => f.code);
    expect(codes).toContain('targetBoardIds');
    expect(codes).not.toContain('board');
  });
});
