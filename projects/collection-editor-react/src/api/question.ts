import { apiClient } from './client';

/**
 * Reads the full QuestionSet hierarchy — the tree of units/questions with
 * child stubs.
 * Response shape: { result: { questionset: {...} } }
 */
export async function readQuestionSetHierarchy(
  questionSetId: string,
): Promise<Record<string, unknown>> {
  const response = await apiClient.get(
    `/action/questionset/v2/hierarchy/${questionSetId}`,
  );
  const questionset = response.data?.result?.questionset as
    | Record<string, unknown>
    | undefined;
  if (!questionset || !questionset['identifier']) {
    const reason =
      (response.data?.params?.errmsg as string) ||
      (response.data?.params?.err as string) ||
      (response.data?.responseCode as string) ||
      `No questionset returned for "${questionSetId}"`;
    throw new Error(`Unable to load questionset hierarchy: ${reason}`);
  }
  return questionset;
}

/**
 * Fetches full question data (body, responseDeclaration, interactions, etc.)
 * for the given identifiers.
 * Response shape: { result: { questions: [...] } }
 */
export async function getQuestionList(
  identifiers: string[],
): Promise<Array<Record<string, unknown>>> {
  if (!identifiers.length) return [];
  const response = await apiClient.post('/action/question/v2/list', {
    request: { search: { identifier: identifiers } },
  });
  return (response.data?.result?.questions ?? []) as Array<
    Record<string, unknown>
  >;
}
