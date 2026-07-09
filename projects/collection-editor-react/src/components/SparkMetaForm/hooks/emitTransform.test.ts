import { describe, it, expect } from 'vitest';
import { transformEmit, transformFieldPatch, createLevels } from './emitTransform';

describe('transformEmit (batch write — mirrors Angular emitValue)', () => {
  it('omits UI-only keys allowECM / setPeriod / levels / instances', () => {
    const out = transformEmit({ name: 'X', allowECM: true, setPeriod: 5, levels: [], instances: '' });
    expect(out.allowECM).toBeUndefined();
    expect(out.setPeriod).toBeUndefined();
    expect(out.levels).toBeUndefined();
    expect(out.instances).toBeUndefined();
    expect(out.name).toBe('X');
  });

  it('maps levels[] → outcomeDeclaration.levels', () => {
    const out = transformEmit({ levels: ['Beginner', 'Advanced'] });
    expect(out.outcomeDeclaration).toEqual({ levels: { L1: { label: 'Beginner' }, L2: { label: 'Advanced' } } });
  });

  it('maps instances → { label }', () => {
    const out = transformEmit({ instances: 'Set A' });
    expect(out.instances).toEqual({ label: 'Set A' });
  });

  it('falls back to the node title for an empty name in review mode', () => {
    const out = transformEmit({ name: '' }, { isReview: true, nodeTitle: 'My Course' });
    expect(out.name).toBe('My Course');
  });

  it('does not override a present name in review mode', () => {
    const out = transformEmit({ name: 'Typed' }, { isReview: true, nodeTitle: 'My Course' });
    expect(out.name).toBe('Typed');
  });
});

describe('transformFieldPatch (single-field write)', () => {
  it('returns null for UI-only fields so they are never persisted', () => {
    expect(transformFieldPatch('allowECM', true)).toBeNull();
    expect(transformFieldPatch('setPeriod', 3)).toBeNull();
  });

  it('maps levels and instances on single-field change', () => {
    expect(transformFieldPatch('levels', ['A'])).toEqual({ outcomeDeclaration: { levels: { L1: { label: 'A' } } } });
    expect(transformFieldPatch('instances', 'S')).toEqual({ instances: { label: 'S' } });
  });

  it('passes ordinary fields through unchanged', () => {
    expect(transformFieldPatch('medium', ['English'])).toEqual({ medium: ['English'] });
  });
});

describe('createLevels', () => {
  it('builds L1..Ln keyed labels', () => {
    expect(createLevels(['a', 'b', 'c'])).toEqual({
      L1: { label: 'a' }, L2: { label: 'b' }, L3: { label: 'c' },
    });
  });
});
