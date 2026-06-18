import { apiClient } from './client';

export async function uploadCsvHierarchy(contentId: string, file: File): Promise<{ processId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post(
    `/action/collection/v1/import/${contentId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data?.result ?? { processId: '' };
}

export async function getCsvUploadStatus(processId: string): Promise<{
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  failedRecords?: unknown[];
  successCount?: number;
}> {
  const response = await apiClient.get(`/action/collection/v1/import/status/${processId}`);
  return response.data?.result ?? { status: 'PENDING' };
}

export async function downloadSampleCsv(contentId: string): Promise<Blob> {
  const response = await apiClient.get(`/action/collection/v1/export/${contentId}`, { responseType: 'blob' });
  return response.data as Blob;
}
