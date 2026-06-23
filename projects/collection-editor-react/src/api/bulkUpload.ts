import { apiClient } from './client';

// ---------------------------------------------------------------------------
// CSV import is a 3-stage flow (matching the Sunbird collection editor):
//   1. ask the content service for a pre-signed blob URL
//   2. PUT the CSV file straight to that blob URL
//   3. tell the collection service to import from the uploaded fileUrl
// ---------------------------------------------------------------------------

// Stage 1 — get a pre-signed upload URL for the hierarchy CSV.
async function getUploadUrl(contentId: string, fileName: string): Promise<string> {
  const response = await apiClient.post(
    `/action/content/v3/upload/url/${contentId}?type=hierarchy`,
    { request: { content: { fileName } } },
  );
  const result = response.data?.result ?? {};
  const url = (result.content?.preSignedURL ?? result.pre_signed_url ?? result.preSignedUrl) as
    | string
    | undefined;
  if (!url) throw new Error('Could not obtain an upload URL');
  return url;
}

// Stage 2 — upload the file binary to the (Azure) blob via the signed URL.
// Goes directly to blob storage, so it must NOT carry the apiClient auth header.
async function uploadToSignedUrl(signedUrl: string, file: File): Promise<string> {
  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': 'text/csv' },
    body: file,
  });
  if (!res.ok) throw new Error(`Blob upload failed (${res.status})`);
  // The committed file URL is the signed URL without its query string.
  return signedUrl.split('?')[0];
}

// Stage 3 — kick off the import from the uploaded fileUrl.
// The collection/v1/import API expects multipart/form-data with bare fields —
// NOT a JSON body with a request wrapper. Sending JSON causes a 400/422.
export async function uploadCsvHierarchy(
  contentId: string,
  file: File,
): Promise<{ processId: string }> {
  const signedUrl = await getUploadUrl(contentId, file.name);
  const fileUrl = await uploadToSignedUrl(signedUrl, file);

  const formData = new FormData();
  formData.append('fileUrl', fileUrl);
  formData.append('mimeType', file.type || 'text/csv');

  // Do NOT set Content-Type manually — let the browser/axios set
  // multipart/form-data with the correct boundary automatically.
  const response = await apiClient.post(
    `/action/collection/v1/import/${contentId}`,
    formData,
  );
  const result = response.data?.result ?? {};
  return { processId: (result.processId as string) ?? '' };
}

export async function getCsvUploadStatus(processId: string): Promise<{
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  failedRecords?: unknown[];
  successCount?: number;
}> {
  const response = await apiClient.get(`/action/collection/v1/import/status/${processId}`);
  return response.data?.result ?? { status: 'PENDING' };
}

// Export the current folder hierarchy as CSV. The export API returns a JSON
// body with a pre-signed `tocUrl`, not a file blob.
export async function exportFolderCsv(contentId: string): Promise<string> {
  const response = await apiClient.get(`/action/collection/v1/export/${contentId}`);
  const tocUrl = response.data?.result?.collection?.tocUrl as string | undefined;
  if (!tocUrl) throw new Error('No export URL returned');
  return tocUrl;
}

// Backwards-compatible alias — returns the export CSV URL for sample/download use.
export async function downloadSampleCsv(contentId: string): Promise<string> {
  return exportFolderCsv(contentId);
}
