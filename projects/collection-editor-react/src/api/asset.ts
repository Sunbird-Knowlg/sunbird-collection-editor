import { apiClient } from './client';

export async function createMediaAsset(
  name: string,
  mimeType: string,
  createdBy: string,
  channel: string,
): Promise<string> {
  const resp = await apiClient.post('/action/asset/v1/create', {
    request: {
      asset: {
        primaryCategory: 'asset',
        language: ['English'],
        code: crypto.randomUUID(),
        name,
        mediaType: 'image',
        mimeType,
        createdBy,
        creator: null,
        channel,
        keywords: '',
      },
    },
  });
  const nodeId: string | undefined = resp.data?.result?.node_id;
  if (!nodeId) throw new Error('Asset creation failed: no node_id returned');
  return nodeId;
}

export async function getPreSignedUrl(
  assetId: string,
  fileName: string,
): Promise<string> {
  const resp = await apiClient.post(
    `/action/content/v3/upload/url/${assetId}`,
    { request: { content: { fileName } } },
  );
  const url: string | undefined = resp.data?.result?.pre_signed_url;
  if (!url) throw new Error('Pre-signed URL fetch failed');
  return url;
}

export async function uploadToBlob(
  signedUrl: string,
  file: File,
  presignedHeaders: Record<string, string> = {},
): Promise<void> {
  const resp = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': 'application/octet-stream',
      ...presignedHeaders,
    },
  });
  if (!resp.ok) throw new Error(`Blob upload failed: ${resp.status} ${resp.statusText}`);
}

export async function finalizeAssetUpload(
  assetId: string,
  fileUrl: string,
  mimeType: string,
): Promise<string> {
  const formData = new FormData();
  formData.append('fileUrl', fileUrl);
  formData.append('mimeType', mimeType);
  const resp = await apiClient.post(
    `/action/asset/v1/upload/${assetId}`,
    formData,
    {
      params: {
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
      },
    },
  );
  const contentUrl: string | undefined = resp.data?.result?.content_url;
  if (!contentUrl) throw new Error('Asset finalize failed: no content_url returned');
  return contentUrl;
}
