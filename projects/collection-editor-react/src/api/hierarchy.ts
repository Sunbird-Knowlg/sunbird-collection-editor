import { apiClient } from './client';
import type { INode } from '../types/editor';

function mapToINode(raw: unknown, parentId?: string): INode {
  const r = raw as Record<string, unknown>;
  const identifier = (r['identifier'] as string) ?? '';
  const objectType = (r['objectType'] as string) ?? '';
  const mime = (r['mimeType'] as string) ?? '';
  const isFolder =
    mime === 'application/vnd.ekstep.content-collection' ||
    objectType.toLowerCase().includes('unit') ||
    objectType.toLowerCase().includes('textbook') ||
    objectType.toLowerCase().includes('collection') ||
    objectType.toLowerCase().includes('course') ||
    objectType.toLowerCase().includes('lesson') ||
    (r['visibility'] as string) === 'Parent';

  const rawChildren = r['children'];
  const children: INode[] = Array.isArray(rawChildren)
    ? rawChildren.map((child) => mapToINode(child, identifier))
    : [];

  return {
    id: identifier,
    identifier,
    name: (r['name'] as string) ?? 'Untitled',
    title: (r['name'] as string) ?? 'Untitled',
    description: r['description'] as string | undefined,
    primaryCategory: r['primaryCategory'] as string | undefined,
    mimeType: r['mimeType'] as string | undefined,
    objectType,
    contentType: r['contentType'] as string | undefined,
    visibility: r['visibility'] as string | undefined,
    status: r['status'] as string | undefined,
    appIcon: r['appIcon'] as string | undefined,
    isFolder,
    children,
    metadata: r as Record<string, unknown>,
    parent: parentId,
  };
}

export async function readHierarchy(
  contentId: string,
): Promise<{ content: Record<string, unknown>; rootNode: INode }> {
  const response = await apiClient.get(
    `/action/content/v3/hierarchy/${contentId}`,
    { params: { mode: 'edit' } },
  );
  const content = response.data?.result?.content as Record<string, unknown>;
  const rootNode = mapToINode(content);
  return { content, rootNode };
}

export async function updateHierarchy(
  _contentId: string,
  nodesModified: Record<string, unknown>,
  hierarchy: Record<string, unknown>,
): Promise<void> {
  await apiClient.patch('/action/content/v3/hierarchy/update', {
    request: {
      data: {
        nodesModified,
        hierarchy,
      },
    },
  });
}

export async function publishContent(contentId: string): Promise<void> {
  await apiClient.post(`/action/content/v3/publish/${contentId}`, {
    request: {
      content: {
        lastPublishedBy: '',
      },
    },
  });
}

export async function readContent(
  contentId: string,
): Promise<Record<string, unknown>> {
  const response = await apiClient.get(
    `/action/content/v3/read/${contentId}`,
  );
  return response.data?.result?.content as Record<string, unknown>;
}

export async function sendForReview(contentId: string): Promise<void> {
  await apiClient.post(`/action/content/v3/review/${contentId}`, {
    request: { content: {} },
  });
}

export async function rejectContent(contentId: string, comment: string): Promise<void> {
  await apiClient.post(`/action/content/v3/reject/${contentId}`, {
    request: { content: { rejectComment: comment } },
  });
}

export async function updateCollaborators(contentId: string, collaborators: string[]): Promise<void> {
  await apiClient.patch('/action/content/v3/hierarchy/update', {
    request: {
      data: {
        nodesModified: {
          [contentId]: {
            metadata: { collaborators },
            objectType: 'Collection',
            root: true,
            isNew: false,
          },
        },
        hierarchy: {},
      },
    },
  });
}
