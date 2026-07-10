import { describe, it, expect } from 'vitest';
import { resolveFrameworkIds } from './useEditorInit';

describe('resolveFrameworkIds (content → channel default → context)', () => {
  it('older content keeps its authored framework even when the channel default differs', () => {
    const { framework } = resolveFrameworkIds(
      { framework: 'NCF' }, 'USF', { framework: 'NCF' },
    );
    expect(framework).toBe('NCF');
  });

  it('new content (no framework in metadata) follows the channel defaultFramework', () => {
    const { framework } = resolveFrameworkIds(
      {}, 'USF', { framework: 'NCF' },
    );
    expect(framework).toBe('USF');
  });

  it('falls back to context.framework when the channel has no default (or the read failed)', () => {
    const { framework } = resolveFrameworkIds({}, undefined, { framework: 'NCF' });
    expect(framework).toBe('NCF');
  });

  it('resolves to null when nothing provides a framework', () => {
    const { framework } = resolveFrameworkIds({}, undefined, {});
    expect(framework).toBeNull();
  });

  it('targetFWIds come from content metadata first, then context — never the channel default', () => {
    expect(resolveFrameworkIds({ targetFWIds: ['NCF'] }, 'USF', { targetFWIds: ['TPD'] }).targetFWIds)
      .toEqual(['NCF']);
    expect(resolveFrameworkIds({}, 'USF', { targetFWIds: ['TPD'] }).targetFWIds)
      .toEqual(['TPD']);
    expect(resolveFrameworkIds({}, 'USF', {}).targetFWIds).toBeNull();
  });
});
