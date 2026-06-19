import React, { useMemo, useState } from 'react';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { Button } from '../shared/Button';
import styles from './modals.module.scss';

interface PublishChecklistProps {
  contentId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface CheckItem {
  label: string;
  passed: boolean;
  critical: boolean;
}

function PassIcon(): React.ReactElement {
  return (
    <span className={`${styles.checkIcon} ${styles.pass}`} aria-label="passed">
      ✓
    </span>
  );
}

function FailIcon(): React.ReactElement {
  return (
    <span className={`${styles.checkIcon} ${styles.fail}`} aria-label="failed">
      ✗
    </span>
  );
}

export const PublishChecklist: React.FC<PublishChecklistProps> = ({
  contentId: _contentId,
  onConfirm,
  onCancel,
}) => {
  const treeData = useTreeStore((s) => s.treeData);

  // Manual confirmation items defined by the category definition (forms.publishchecklist).
  // The reviewer must tick each before publishing is enabled.
  const checklistItems = useEditorStore((s) => s.publishChecklist) ?? [];
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const allConfirmed = checklistItems.every((c) => confirmed[c.code]);

  const checks = useMemo<CheckItem[]>(() => {
    const root = treeData[0];

    // 1. Root node has title and description
    const hasTitle = Boolean(root?.name && root.name.trim().length > 0);
    const hasDescription = Boolean(
      root?.description?.trim() ||
      (root?.metadata?.description as string | undefined)?.trim()
    );

    // 2. Root node has an appIcon
    const hasAppIcon = Boolean(
      root?.appIcon ||
      (root?.metadata?.appIcon as string | undefined)
    );

    // 3. At least one unit exists (folder child of root)
    const rootChildren = root?.children ?? [];
    const hasUnit = rootChildren.some((child) => child.isFolder);

    // 4. At least one content item added (non-folder leaf anywhere in tree)
    function hasLeaf(nodes: typeof treeData): boolean {
      for (const node of nodes) {
        if (!node.isFolder) return true;
        if (node.children && hasLeaf(node.children)) return true;
      }
      return false;
    }
    const hasContent = hasLeaf(rootChildren);

    // 5. License field is set
    const hasLicense = Boolean(
      (root?.metadata?.license as string | undefined)?.trim()
    );

    return [
      {
        label: 'Root node has a title and description',
        passed: hasTitle && hasDescription,
        critical: true,
      },
      {
        label: 'Root node has an app icon',
        passed: hasAppIcon,
        critical: true,
      },
      {
        label: 'At least one unit exists',
        passed: hasUnit,
        critical: true,
      },
      {
        label: 'At least one content item added',
        passed: hasContent,
        critical: true,
      },
      {
        label: 'License field is set',
        passed: hasLicense,
        critical: true,
      },
    ];
  }, [treeData]);

  const canPublish = checks.every((c) => !c.critical || c.passed) && allConfirmed;
  const failCount = checks.filter((c) => !c.passed).length;

  // Publishing is performed centrally (useToolbarActions) after the modal
  // confirms — this just signals confirmation.
  const handlePublish = () => {
    onConfirm();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="publish-modal-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span id="publish-modal-title">Publish Checklist</span>
          <button
            className={styles.modalHeaderClose}
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.sectionTitle}>Pre-publish validation</p>

          {checks.map((item) => (
            <div key={item.label} className={styles.checkRow}>
              {item.passed ? <PassIcon /> : <FailIcon />}
              <span>{item.label}</span>
            </div>
          ))}

          {checklistItems.length > 0 && (
            <>
              <hr className={styles.divider} />
              <p className={styles.sectionTitle}>Reviewer confirmation</p>
              {checklistItems.map((item) => (
                <label key={item.code} className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={!!confirmed[item.code]}
                    onChange={(e) =>
                      setConfirmed((prev) => ({ ...prev, [item.code]: e.target.checked }))
                    }
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </>
          )}

          {failCount > 0 && (
            <>
              <hr className={styles.divider} />
              <div className={styles.errorBanner}>
                {failCount === 1
                  ? '1 check failed. Please resolve it before publishing.'
                  : `${failCount} checks failed. Please resolve them before publishing.`}
              </div>
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            disabled={!canPublish}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};
