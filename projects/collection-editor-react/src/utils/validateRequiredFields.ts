import type { INode } from '../types/editor';
import type { IFrameworkDetails } from '../types/framework';
import { useFieldPrepare } from '../components/SparkMetaForm/hooks/useFieldPrepare';
import type { IPrepareContext } from '../components/SparkMetaForm/hooks/useFieldPrepare';

export interface MissingFieldsReport {
  nodeId: string;
  nodeName: string;
  /** Labels of the empty required fields, in form order. */
  missing: string[];
}

const EMPTY_FW: IFrameworkDetails = {};

function isEmptyValue(v: unknown): boolean {
  return (
    v === undefined ||
    v === null ||
    v === '' ||
    (Array.isArray(v) && v.length === 0)
  );
}

/**
 * Metadata-level required-field validation across the whole tree.
 *
 * formStatusMapper only records forms the user has mounted AND touched, so
 * validateAllForms passes nodes that were never visited. This walks every
 * root/unit node, prepares its field set through the same pipeline the form
 * uses (useFieldPrepare is pure — required flags, dialcode visibility and
 * seeded defaults all match what the form displays), and reports every node
 * with an empty required field. Leaf resources are excluded: they are edited
 * through ContentEditForm, not the SparkMetaForm configs.
 */
export function findMissingRequiredFields(
  treeData: INode[],
  treeCache: Record<string, Record<string, unknown>>,
  rootFormConfig: Array<Record<string, unknown>> | null,
  unitFormConfig: Array<Record<string, unknown>> | null,
  ctx: IPrepareContext,
  // The resolved framework must be passed for validation to agree with the
  // rendered form: useFieldPrepare adapts the field set to the framework's
  // categories (dropping BMGS fields for e.g. USF), so required-ness has to be
  // computed against that same adapted set — not the raw API form config.
  frameworkDetails: IFrameworkDetails = EMPTY_FW,
): MissingFieldsReport[] {
  const reports: MissingFieldsReport[] = [];

  const walk = (nodes: INode[], atRootLevel: boolean) => {
    for (const node of nodes) {
      const isRoot = atRootLevel && !node.parent;
      const formConfig = isRoot
        ? rootFormConfig
        : node.isFolder
          ? unitFormConfig
          : null;

      if (formConfig && formConfig.length > 0) {
        const merged = {
          ...(node.metadata ?? {}),
          ...(treeCache[node.id] ?? {}),
        };
        const fields = useFieldPrepare(formConfig, merged, frameworkDetails, isRoot, ctx);
        const missing = fields
          .filter(
            (f) =>
              f.required &&
              f.visible !== false &&
              // appIcon lives in the title row, not the form grid — matches
              // the fields the user actually sees asterisked.
              f.inputType !== 'appIcon' &&
              isEmptyValue(f.currentValue),
          )
          .map((f) => f.label);
        if (missing.length > 0) {
          reports.push({
            nodeId: node.id,
            nodeName: node.name || 'Untitled',
            missing,
          });
        }
      }

      if (node.children?.length) walk(node.children, false);
    }
  };

  walk(treeData, true);
  return reports;
}
