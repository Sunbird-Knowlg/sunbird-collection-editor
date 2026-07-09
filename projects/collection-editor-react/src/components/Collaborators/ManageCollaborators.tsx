import React, { useState, useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '../shared/Button';
import { searchUsers, getUsersByIds } from '../../api/user';
import { updateCollaborators, readContent } from '../../api/hierarchy';
import { useEditorStore } from '../../store/editor.store';
import { useLabels } from '../../hooks/useLabels';
import type { IUser } from '../../api/user';
import styles from './ManageCollaborators.module.scss';

interface ManageCollaboratorsProps {
  contentId: string;
  onClose: () => void;
}

export const ManageCollaborators: React.FC<ManageCollaboratorsProps> = ({
  contentId,
  onClose,
}) => {
  const lbl = useLabels();
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const rootOrgId = editorConfig?.context?.channel;
  const objectType = editorConfig?.config?.objectType;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [collaborators, setCollaborators] = useState<IUser[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the content's existing collaborators on open so they can be viewed/removed.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const content = await readContent(contentId);
        const ids = (content?.collaborators as string[] | undefined) ?? [];
        if (!ids.length) return;
        const users = await getUsersByIds(ids);
        if (cancelled) return;
        // Fall back to a bare record for any id the search couldn't resolve.
        const resolved = ids.map(
          (id) => users.find((u) => u.identifier === id) ?? { identifier: id, firstName: id },
        );
        setCollaborators(resolved);
      } catch {
        // ignore — start with an empty list
      }
    })();
    return () => { cancelled = true; };
  }, [contentId]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(q, { rootOrgId, objectType });
        // Exclude already-added collaborators
        const collabIds = new Set(collaborators.map((c) => c.identifier));
        setSearchResults(results.filter((u) => !collabIds.has(u.identifier)));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, collaborators, rootOrgId, objectType]);

  const handleAdd = useCallback(
    (user: IUser) => {
      setCollaborators((prev) => {
        if (prev.find((c) => c.identifier === user.identifier)) return prev;
        return [...prev, user];
      });
      setSearchResults((prev) => prev.filter((u) => u.identifier !== user.identifier));
      setSaveSuccess(false);
    },
    [],
  );

  const handleRemove = useCallback((userId: string) => {
    setCollaborators((prev) => prev.filter((c) => c.identifier !== userId));
    setSaveSuccess(false);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await updateCollaborators(
        contentId,
        collaborators.map((c) => c.identifier),
      );
      setSaveSuccess(true);
    } catch {
      setSaveError(lbl.manageCollaborators.saveFailed);
    } finally {
      setIsSaving(false);
    }
  }, [contentId, collaborators, lbl.manageCollaborators.saveFailed]);

  const displayName = (user: IUser) =>
    `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{lbl.manageCollaborators.title}</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label={lbl.manageCollaborators.closeAriaLabel}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.body}>
        {/* Search */}
        <div className={styles.searchSection}>
          <label className={styles.label} htmlFor="collab-search">
            {lbl.manageCollaborators.searchUsersLabel}
          </label>
          <div className={styles.searchRow}>
            <input
              id="collab-search"
              type="text"
              className={styles.searchInput}
              placeholder={lbl.manageCollaborators.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearching && <span className={styles.searchSpinner} aria-label={lbl.manageCollaborators.searchingAriaLabel} />}
          </div>

          {searchResults.length > 0 && (
            <ul className={styles.resultsList} role="listbox" aria-label={lbl.manageCollaborators.searchResultsAriaLabel}>
              {searchResults.map((user) => (
                <li key={user.identifier} className={styles.resultItem} role="option" aria-selected="false">
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{displayName(user)}</span>
                    {user.email && (
                      <span className={styles.userEmail}>{user.email}</span>
                    )}
                    {(user.organisations?.[0]?.orgName ?? user.rootOrgName) && (
                      <span className={styles.userOrg}>
                        {user.organisations?.[0]?.orgName ?? user.rootOrgName}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd(user)}
                  >
                    {lbl.manageCollaborators.add}
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className={styles.noResults}>{lbl.manageCollaborators.noUsersFound}</p>
          )}
        </div>

        {/* Current collaborators */}
        <div className={styles.collabSection}>
          <h3 className={styles.sectionTitle}>
            {lbl.manageCollaborators.currentCollaborators}
            {collaborators.length > 0 && (
              <span className={styles.badge}>{collaborators.length}</span>
            )}
          </h3>

          {collaborators.length === 0 ? (
            <p className={styles.emptyCollab}>{lbl.manageCollaborators.noCollaboratorsYet}</p>
          ) : (
            <ul className={styles.collabList}>
              {collaborators.map((user) => (
                <li key={user.identifier} className={styles.collabItem}>
                  <div className={styles.userAvatar} aria-hidden="true">
                    {displayName(user).charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{displayName(user)}</span>
                    {user.email && (
                      <span className={styles.userEmail}>{user.email}</span>
                    )}
                    {(user.organisations?.[0]?.orgName ?? user.rootOrgName) && (
                      <span className={styles.userOrg}>
                        {user.organisations?.[0]?.orgName ?? user.rootOrgName}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(user.identifier)}
                  >
                    {lbl.manageCollaborators.remove}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {saveError && <p className={styles.error} role="alert">{saveError}</p>}
        {saveSuccess && (
          <p className={styles.success} role="status">{lbl.manageCollaborators.saveSuccess}</p>
        )}
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={onClose} disabled={isSaving}>
          {lbl.manageCollaborators.cancel}
        </Button>
        <Button
          variant="primary"
          isLoading={isSaving}
          onClick={handleSave}
        >
          {lbl.manageCollaborators.save}
        </Button>
      </div>
    </div>
  );
};
