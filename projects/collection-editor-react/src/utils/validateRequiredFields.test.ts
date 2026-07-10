import { describe, it, expect } from 'vitest';
import { findMissingRequiredFields } from './validateRequiredFields';
import type { INode } from '../types/editor';

const node = (over: Partial<INode>): INode => ({
  id: 'n1',
  identifier: 'n1',
  name: 'Node',
  isFolder: false,
  children: [],
  metadata: {},
  ...over,
});

const rootConfig = [
  { code: 'name', label: 'Title', required: true },
  { code: 'description', label: 'Description', required: true },
];
const unitConfig = [{ code: 'description', label: 'Description', required: true }];

describe('findMissingRequiredFields', () => {
  it('reports empty required fields on root and unit nodes', () => {
    const tree = [
      node({
        id: 'root', identifier: 'root', name: 'Course', isFolder: true,
        metadata: { name: 'Course' }, // description missing
        children: [
          node({ id: 'u1', identifier: 'u1', name: 'Unit 1', isFolder: true, parent: 'root', metadata: {} }),
        ],
      }),
    ];
    const reports = findMissingRequiredFields(tree, {}, rootConfig, unitConfig, {});
    expect(reports).toHaveLength(2);
    expect(reports[0]).toMatchObject({ nodeId: 'root', missing: ['Description'] });
    expect(reports[1]).toMatchObject({ nodeId: 'u1', missing: ['Description'] });
  });

  it('passes when metadata or treeCache fills the required fields', () => {
    const tree = [
      node({
        id: 'root', identifier: 'root', name: 'Course', isFolder: true,
        metadata: { name: 'Course', description: 'From metadata' },
        children: [
          node({ id: 'u1', identifier: 'u1', name: 'Unit 1', isFolder: true, parent: 'root', metadata: {} }),
        ],
      }),
    ];
    const cache = { u1: { description: 'From cache' } };
    expect(findMissingRequiredFields(tree, cache, rootConfig, unitConfig, {})).toHaveLength(0);
  });

  it('skips leaf resources (edited via ContentEditForm, not SparkMetaForm)', () => {
    const tree = [
      node({
        id: 'root', identifier: 'root', name: 'Course', isFolder: true,
        metadata: { name: 'Course', description: 'ok' },
        children: [
          node({ id: 'leaf', identifier: 'leaf', name: 'Video', isFolder: false, parent: 'root', metadata: {} }),
        ],
      }),
    ];
    expect(findMissingRequiredFields(tree, {}, rootConfig, unitConfig, {})).toHaveLength(0);
  });

  it('counts seeded defaults (author/copyrightYear) as filled', () => {
    const licensingConfig = [
      { code: 'author', label: 'Author', required: true },
      { code: 'copyrightYear', label: 'Copyright Year', required: true },
    ];
    const tree = [
      node({ id: 'root', identifier: 'root', name: 'Course', isFolder: true, metadata: {} }),
    ];
    const reports = findMissingRequiredFields(
      tree, {}, licensingConfig, null, { userFullName: 'Jane Doe' },
    );
    expect(reports).toHaveLength(0);
  });

  // Production regression ("C1: please fill required fields — Subjects covered,
  // Board/Syllabus of the audience, …"): required BMGS fields from the server's
  // create form must NOT be validated when the resolved framework (USF) has no
  // such categories — validation must see the same adapted field set the form
  // renders.
  it('does not demand BMGS fields when the framework has no BMGS categories', () => {
    const bmgsConfig = [
      { code: 'name', label: 'Title', required: true },
      { code: 'subjectIds', label: 'Subjects covered in the course', required: true, sourceCategory: 'subject' },
      { code: 'targetBoardIds', label: 'Board/Syllabus of the audience', required: true, sourceCategory: 'board' },
      { code: 'targetMediumIds', label: 'Medium(s) of the audience', required: true, sourceCategory: 'medium' },
    ];
    const usfFw = {
      organisationFramework: {
        identifier: 'USF', name: 'USF', code: 'USF',
        categories: [
          { identifier: 'usf_industry', name: 'Industry', code: 'industry', terms: [] },
          { identifier: 'usf_skill', name: 'Skill', code: 'skill', terms: [] },
        ],
      },
    };
    const tree = [
      node({ id: 'root', identifier: 'root', name: 'C1', isFolder: true, metadata: { name: 'C1' } }),
    ];
    // Without the framework (legacy call shape) the BMGS fields are demanded…
    expect(findMissingRequiredFields(tree, {}, bmgsConfig, null, {})).toHaveLength(1);
    // …but with the resolved USF framework they are dropped from validation.
    expect(findMissingRequiredFields(tree, {}, bmgsConfig, null, {}, usfFw)).toHaveLength(0);
  });
});
