import { useQuery } from '@tanstack/react-query';
import { searchFrameworks } from '../api/framework';

interface ChannelFramework { identifier: string; name: string; type?: string }

/**
 * Build the option list for the `framework` (Course Type) field.
 *
 * Mirrors Angular's getFrameworkDetails (editor.component.ts:277-318):
 *  - Start from the channel's frameworks.
 *  - If the category definition declares `orgFWType`, restrict to frameworks of
 *    those types; for any declared type the channel does NOT cover, fetch the
 *    system-default frameworks of that type via composite search and merge them.
 *  - With no `orgFWType`, fall back to all channel frameworks.
 */
export function useFrameworkOptions(
  channelFrameworks: ChannelFramework[] | undefined,
  orgFWType: string[] | undefined,
  channel: string | undefined,
): Array<{ label: string; value: string }> {
  const list = channelFrameworks ?? [];
  const channelTypes = new Set(list.map(f => f.type).filter(Boolean) as string[]);
  const missingTypes = (orgFWType ?? []).filter(t => !channelTypes.has(t));

  const { data: fetched } = useQuery({
    queryKey: ['framework-search', missingTypes.sort().join(','), channel],
    queryFn: () => searchFrameworks({ type: missingTypes, systemDefault: 'Yes' }),
    enabled: missingTypes.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const base = orgFWType && orgFWType.length
    ? list.filter(f => f.type && orgFWType.includes(f.type))
    : list;

  const merged = [
    ...(fetched ?? []).map(f => ({ label: f.name, value: f.identifier })),
    ...base.map(f => ({ label: f.name, value: f.identifier })),
  ];

  // De-dupe by value, preserving first occurrence.
  const seen = new Set<string>();
  return merged.filter(o => (seen.has(o.value) ? false : (seen.add(o.value), true)));
}
