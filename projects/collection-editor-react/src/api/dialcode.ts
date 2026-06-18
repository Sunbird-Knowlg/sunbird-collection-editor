import { apiClient } from './client';

export async function checkDialCode(dialCode: string): Promise<unknown> {
  const response = await apiClient.post('/api/dialcode/v1/read', {
    request: {
      dialcodes: [dialCode],
    },
  });
  return response.data;
}

export async function linkDialCode(
  contentId: string,
  dialCode: string,
): Promise<unknown> {
  const response = await apiClient.post('/api/content/v3/dialcode/link', {
    request: {
      content: [
        {
          identifier: contentId,
          dialcodes: [dialCode],
        },
      ],
    },
  });
  return response.data;
}

export async function reserveDialcodes(contentId: string, count: number): Promise<string> {
  const response = await apiClient.post(`/action/dialcode/v1/reserve/${contentId}`, {
    request: {
      dialcodes: { count, qrCodeSpec: { errorCorrectionLevel: 'H' } },
    },
  });
  return response.data?.result?.processId as string ?? '';
}

export async function getDialcodeProcessStatus(processId: string): Promise<{
  status: string;
  zipFileName?: string;
  dialcodes?: Array<{ identifier: string }>;
}> {
  const response = await apiClient.get(`/action/dialcode/v1/process/status/${processId}`);
  return response.data?.result ?? { status: 'PENDING' };
}

export async function releaseDialcodes(_contentId: string, ids: string[]): Promise<void> {
  await apiClient.patch('/api/dialcode/v1/update', {
    request: { dialcodes: ids.map(id => ({ identifier: id, status: 'Draft' })) },
  });
}

export async function unlinkDialcode(contentId: string): Promise<void> {
  await apiClient.post('/api/content/v3/dialcode/link', {
    request: { content: [{ identifier: contentId, dialcodes: [] }] },
  });
}
