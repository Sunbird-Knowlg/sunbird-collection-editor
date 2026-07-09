import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { readQuestionSetHierarchy, getQuestionList } from '../api/question';

const QUESTION_MIME = 'application/vnd.sunbird.question';

interface UseQumlContentOptions {
  enabled?: boolean;
}

type Node = Record<string, unknown> & { children?: Node[] };

function maxScoreDecl(source: Node): Record<string, unknown> {
  return {
    cardinality: 'single',
    type: 'integer',
    defaultValue: (source['maxScore'] as number) ?? 1,
  };
}

/**
 * Finds a question node and its immediate parent within an enriched hierarchy.
 */
function findQuestionWithParent(
  node: Node | undefined,
  questionId: string,
  parent?: Node,
): { question: Node; parent?: Node } | null {
  if (!node) return null;
  if (node['identifier'] === questionId) return { question: node, parent };
  for (const child of node.children ?? []) {
    const found = findQuestionWithParent(child, questionId, node);
    if (found) return found;
  }
  return null;
}

/**
 * Builds a single-question questionset hierarchy from an enriched base set,
 * mirroring Angular's qumlplayer-page.component.initQumlPlayer(): keep the
 * questionset shell but expose only the selected question, so the player
 * renders exactly one question.
 */
export function buildSingleQuestionHierarchy(
  base: Record<string, unknown>,
  questionId: string,
): Record<string, unknown> | null {
  const match = findQuestionWithParent(base as Node, questionId);
  if (!match) return null;
  const { question, parent } = match;

  const hierarchy: Record<string, unknown> = {
    ...base,
    children: [question],
    childNodes: [questionId],
    shuffle: parent?.['shuffle'],
    showSolutions: (parent?.['showSolutions'] as string) ?? 'No',
    showFeedback: (parent?.['showFeedback'] as string) ?? 'No',
  };

  // maxScore rules from Angular: shuffle → 1; short-answer (SA) → omit;
  // otherwise carry the question's own maxScore.
  if (parent?.['shuffle'] === true) {
    hierarchy['maxScore'] = 1;
  } else if (question['qType'] === 'SA') {
    delete hierarchy['maxScore'];
  } else if (question['maxScore'] != null) {
    hierarchy['maxScore'] = question['maxScore'];
  }

  return hierarchy;
}

/**
 * Fetches and assembles the QuestionSet metadata a QuML player needs.
 *  - reads the questionset hierarchy
 *  - collects all question identifiers from the tree
 *  - fetches full question bodies via /question/v2/list
 *  - replaces question stubs in the hierarchy with the full data
 *  - backfills outcomeDeclaration.maxScore where missing
 * The result is passed straight to <sunbird-quml-player> as `metadata`.
 */
export function useQumlContent(
  questionSetId: string,
  options?: UseQumlContentOptions,
): UseQueryResult<Record<string, unknown>, Error> {
  const enabled = (options?.enabled ?? true) && Boolean(questionSetId);

  return useQuery<Record<string, unknown>, Error>({
    queryKey: ['quml', 'questionset', questionSetId],
    enabled,
    queryFn: async () => {
      const metadata = (await readQuestionSetHierarchy(questionSetId)) as Node;

      // Collect all question IDs from the hierarchy
      const collectQuestionIds = (node: Node | undefined): string[] => {
        if (!node) return [];
        const currentId =
          node['mimeType'] === QUESTION_MIME && node['identifier']
            ? [node['identifier'] as string]
            : [];
        const childIds = (node.children ?? []).flatMap(collectQuestionIds);
        return [...currentId, ...childIds];
      };

      const questionIds = collectQuestionIds(metadata);

      // Fetch full question data and index it by identifier
      const questionMap = new Map<string, Node>();
      if (questionIds.length) {
        const questions = await getQuestionList(questionIds);
        questions.forEach((q) => {
          const id = q['identifier'] as string | undefined;
          if (id) questionMap.set(id, q as Node);
        });
      }

      // Replace question stubs in the hierarchy with full question data
      const replaceQuestions = (node: Node | undefined): Node | undefined => {
        if (!node) return node;
        if (node['mimeType'] === QUESTION_MIME && node['identifier']) {
          const q = questionMap.get(node['identifier'] as string) ?? node;
          const outcome = q['outcomeDeclaration'] as
            | Record<string, unknown>
            | undefined;
          if (!outcome?.['maxScore']) {
            q['outcomeDeclaration'] = { ...(outcome ?? {}), maxScore: maxScoreDecl(q) };
          }
          return q;
        }
        if (Array.isArray(node.children)) {
          node.children = node.children.map((c) => replaceQuestions(c) as Node);
        }
        return node;
      };

      const enriched = replaceQuestions(metadata) as Node;

      // Ensure the questionset itself carries an outcomeDeclaration.maxScore
      const outcome = enriched['outcomeDeclaration'] as
        | Record<string, unknown>
        | undefined;
      if (!outcome?.['maxScore']) {
        enriched['outcomeDeclaration'] = {
          ...(outcome ?? {}),
          maxScore: maxScoreDecl(enriched),
        };
      }

      return enriched;
    },
  });
}
