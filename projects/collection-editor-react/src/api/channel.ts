import { apiClient } from './client';

export interface IChannelData {
  identifier: string;
  name?: string;
  frameworks?: Array<{ identifier: string; name: string; type?: string }>;
  collectionAdditionalCategories?: string[];
  contentAdditionalCategories?: string[];
  defaultLicense?: string;
  defaultFramework?: string;
  defaultCourseFramework?: string;
}

export async function getChannelData(channelId: string): Promise<IChannelData> {
  const response = await apiClient.get(`/api/channel/v1/read/${channelId}`);
  return response.data?.result?.channel as IChannelData;
}
