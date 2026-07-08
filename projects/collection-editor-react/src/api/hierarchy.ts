import { apiClient } from './client';
import type { INode } from '../types/editor';
import { readQuestionSetHierarchy } from './question';

export function mapToINode(raw: unknown, parentId?: string): INode {
  const r = (raw ?? {}) as Record<string, unknown>;
  const identifier = (r['identifier'] as string) ?? '';
  const objectType = (r['objectType'] as string) ?? '';
  const mime = (r['mimeType'] as string) ?? '';

  const rawChildren = r['children'];
  const children: INode[] = Array.isArray(rawChildren)
    ? rawChildren.map((child) => mapToINode(child, identifier))
    : [];

  const isFolder =
    mime === 'application/vnd.ekstep.content-collection' ||
    objectType.toLowerCase().includes('unit') ||
    objectType.toLowerCase().includes('textbook') ||
    objectType.toLowerCase().includes('collection') ||
    objectType.toLowerCase().includes('course') ||
    objectType.toLowerCase().includes('lesson') ||
    (r['visibility'] as string) === 'Parent' ||
    // A QuestionSet with children is the root of a questionset editor (a
    // container of units/questions). A childless QuestionSet is a leaf
    // resource inside a Collection — kept as a leaf so it previews as a set.
    (mime === 'application/vnd.sunbird.questionset' && children.length > 0);

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
  const content = response.data?.result?.content as Record<string, unknown> | undefined;
  if (!content || !content['identifier']) {
    // Surface the API's own error (auth failure, missing content, unexpected
    // shape) instead of crashing in mapToINode on undefined content.
    const reason =
      (response.data?.params?.errmsg as string) ||
      (response.data?.params?.err as string) ||
      (response.data?.responseCode as string) ||
      `No content returned for "${contentId}"`;
    throw new Error(`Unable to load hierarchy: ${reason}`);
  }
  const rootNode = mapToINode(content);
  return { content, rootNode };
}

/**
 * Loads a QuestionSet hierarchy as an editor tree. Used when the editor root
 * itself is a QuestionSet (objectType === 'QuestionSet'), where the correct
 * endpoint is /questionset/v2/hierarchy (payload under result.questionset)
 * rather than the content-collection endpoint.
 */
export async function readQuestionSetHierarchyTree(
  questionSetId: string,
): Promise<{ content: Record<string, unknown>; rootNode: INode }> {
  const questionset = await readQuestionSetHierarchy(questionSetId);
  const rootNode = mapToINode(questionset);
  return { content: questionset, rootNode };
}

export async function updateHierarchy(
  _contentId: string,
  nodesModified: Record<string, unknown>,
  hierarchy: Record<string, unknown>,
  lastUpdatedBy?: string,
): Promise<{ identifiers?: Record<string, string> }> {
  const response = await apiClient.patch('/action/content/v3/hierarchy/update', {
    request: {
      data: {
        nodesModified,
        hierarchy,
        // lastUpdatedBy belongs at the data level, not inside nodesModified entries
        ...(lastUpdatedBy ? { lastUpdatedBy } : {}),
      },
    },
  });
  return (response.data?.result ?? {}) as { identifiers?: Record<string, string> };
}

export async function publishContent(
  contentId: string,
  lastPublishedBy = '',
): Promise<void> {
  await apiClient.post(`/action/content/v3/publish/${contentId}`, {
    request: {
      content: {
        lastPublishedBy,
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
  // Collaborators are managed by a dedicated endpoint, not the hierarchy update.
  await apiClient.patch(`/action/content/v1/collaborator/update/${contentId}`, {
    request: {
      content: { collaborators },
    },
  });
}
