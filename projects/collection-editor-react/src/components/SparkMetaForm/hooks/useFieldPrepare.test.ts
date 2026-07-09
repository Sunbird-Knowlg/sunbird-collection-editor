import { describe, it, expect } from 'vitest';
import { __computeFieldOptionsForTest as computeOptions } from './useFieldPrepare';
import type { IFrameworkDetails } from '../../../types/framework';

// ---------------------------------------------------------------------------
// Regression guard for the reported bug:
//   "English is not showing in Medium while creating a Playlist."
//
// The framework is modelled the way Sunbird actually stores it: the BOARD term
// carries associations down to its mediums (parent → child). The "English"
// medium term has its OWN associations (to grades) but NO back-association to
// the board. A *different* medium ("Hindi") happens to back-reference the board.
//
// Old React code filtered the medium category's own terms by whether each
// medium pointed back at the selected board → English was dropped while Hindi
// survived → "the One Case". The corrected code reads the board term's
// associations directly, so English always appears.
// ---------------------------------------------------------------------------

const boardField = { code: 'board', sourceCategory: 'board', inputType: 'select' };
const mediumField = { code: 'medium', sourceCategory: 'medium', inputType: 'multiselect', depends: ['board'] };

function frameworkWithAsymmetricMediumAssociations(): IFrameworkDetails {
  return {
    organisationFramework: {
      identifier: 'fw1', name: 'FW', code: 'fw1',
      categories: [
        {
          identifier: 'cat_board', name: 'Board', code: 'board',
          terms: [
            {
              identifier: 'cbse', name: 'CBSE', code: 'cbse', category: 'board',
              associations: [
                { identifier: 'eng', name: 'English', code: 'english', category: 'medium' },
                { identifier: 'hin', name: 'Hindi', code: 'hindi', category: 'medium' },
              ],
            },
          ],
        },
        {
          identifier: 'cat_medium', name: 'Medium', code: 'medium',
          terms: [
            // English: associates DOWN to a grade, but NOT back up to the board.
            {
              identifier: 'eng', name: 'English', code: 'english', category: 'medium',
              associations: [{ identifier: 'g1', name: 'Grade 1', code: 'grade1', category: 'gradeLevel' }],
            },
            // Hindi: happens to back-reference the board (asymmetry).
            {
              identifier: 'hin', name: 'Hindi', code: 'hindi', category: 'medium',
              associations: [{ identifier: 'cbse', name: 'CBSE', code: 'cbse', category: 'board' }],
            },
          ],
        },
      ],
    },
  };
}

describe('framework cascade (parent → child association traversal)', () => {
  it('lists English in Medium even when its term lacks a back-association to the board', () => {
    const fw = frameworkWithAsymmetricMediumAssociations();
    const opts = computeOptions(mediumField, fw, { board: 'CBSE' }, [boardField, mediumField]);
    const labels = (opts ?? []).map(o => o.label).sort();
    expect(labels).toEqual(['English', 'Hindi']);
  });

  it('returns no options until the parent (board) is selected — matches Angular', () => {
    const fw = frameworkWithAsymmetricMediumAssociations();
    const opts = computeOptions(mediumField, fw, {}, [boardField, mediumField]);
    expect(opts).toEqual([]);
  });

  it('matches the selected board by identifier as well as name', () => {
    const fw = frameworkWithAsymmetricMediumAssociations();
    const opts = computeOptions(mediumField, fw, { board: 'cbse' }, [boardField, mediumField]);
    expect((opts ?? []).map(o => o.label).sort()).toEqual(['English', 'Hindi']);
  });

  it('a non-dependent field returns its own category terms', () => {
    const fw = frameworkWithAsymmetricMediumAssociations();
    const opts = computeOptions(boardField, fw, {}, [boardField, mediumField]);
    expect((opts ?? []).map(o => o.value)).toEqual(['CBSE']);
  });
});

describe('target-framework synthesis fallback', () => {
  // Target framework whose board terms carry NO associations — Angular
  // synthesises a cross-product so every child shows. We fall back to the
  // child category's own terms (same observable outcome).
  const targetMedium = {
    code: 'targetMediumIds', sourceCategory: 'medium', inputType: 'multiselect',
    section: 'Target Framework Terms', depends: ['targetBoardIds'],
  };
  const targetBoard = {
    code: 'targetBoardIds', sourceCategory: 'board', inputType: 'select',
    section: 'Target Framework Terms',
  };

  const fw: IFrameworkDetails = {
    targetFrameworks: [
      {
        identifier: 'tfw', name: 'NCF', code: 'tfw',
        categories: [
          { identifier: 'tb', name: 'Board', code: 'board', terms: [{ identifier: 'tb1', name: 'State', code: 'state', category: 'board' }] },
          {
            identifier: 'tm', name: 'Medium', code: 'medium',
            terms: [
              { identifier: 'tm_en', name: 'English', code: 'english', category: 'medium' },
              { identifier: 'tm_hi', name: 'Hindi', code: 'hindi', category: 'medium' },
            ],
          },
        ],
      },
    ],
  };

  it('falls back to all child terms when parent terms carry no associations', () => {
    const opts = computeOptions(targetMedium, fw, { targetBoardIds: 'tb1' }, [targetBoard, targetMedium]);
    expect((opts ?? []).map(o => o.value).sort()).toEqual(['tm_en', 'tm_hi']);
  });

  it('uses term identifiers (not names) as values for target fields', () => {
    const opts = computeOptions(targetMedium, fw, { targetBoardIds: 'tb1' }, [targetBoard, targetMedium]);
    expect((opts ?? []).every(o => o.value.startsWith('tm_'))).toBe(true);
  });
});
