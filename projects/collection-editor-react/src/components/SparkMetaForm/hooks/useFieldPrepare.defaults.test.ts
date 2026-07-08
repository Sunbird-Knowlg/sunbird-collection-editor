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
