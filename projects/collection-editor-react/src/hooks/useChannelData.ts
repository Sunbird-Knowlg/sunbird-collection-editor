import { useQuery } from '@tanstack/react-query';
import { getChannelData } from '../api/channel';
import type { IChannelData } from '../api/channel';

export function useChannelData(channelId?: string): IChannelData & { isLoading: boolean } {
  const query = useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => getChannelData(channelId!),
    enabled: !!channelId,
    staleTime: 10 * 60 * 1000, // channel data rarely changes
  });

  return {
    identifier: query.data?.identifier ?? channelId ?? '',
    name: query.data?.name,
    frameworks: query.data?.frameworks,
    collectionAdditionalCategories: query.data?.collectionAdditionalCategories,
    contentAdditionalCategories: query.data?.contentAdditionalCategories,
    defaultLicense: query.data?.defaultLicense,
    defaultFramework: query.data?.defaultFramework,
    isLoading: query.isLoading,
  };
}
