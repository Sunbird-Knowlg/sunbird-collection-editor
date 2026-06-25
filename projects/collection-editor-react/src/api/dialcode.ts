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

export async function reserveDialcodes(
  contentId: string,
  count: number,
): Promise<{ processId: string; reservedDialcodes: Record<string, unknown> }> {
  const response = await apiClient.post(`/action/dialcode/v1/reserve/${contentId}`, {
    request: {
      dialcodes: { count, qrCodeSpec: { errorCorrectionLevel: 'H' } },
    },
  });
  const result = response.data?.result ?? {};
  return {
    processId: (result.processId as string) ?? '',
    reservedDialcodes: (result.reservedDialcodes as Record<string, unknown>) ?? {},
  };
}

export async function getDialcodeProcessStatus(processId: string): Promise<{
  status: string;
  url?: string;
  dialcodes?: Array<{ identifier: string }>;
}> {
  const response = await apiClient.get(`/action/dialcode/v1/process/status/${processId}`);
  const raw = (response.data?.result ?? { status: 'PENDING' }) as { status: string; url?: string; dialcodes?: Array<{ identifier: string }> };
  // Normalize the API's 'PENDING' sentinel to the internal 'in-process' value
  // used by Topbar so both callers agree on a single status string.
  return { ...raw, status: raw.status === 'PENDING' ? 'in-process' : raw.status };
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
