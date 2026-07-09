import React, { useCallback, useMemo, useState } from 'react';
import { Search, Library, SlidersHorizontal, ArrowUpAZ, Clock, PanelRightClose, Info } from 'lucide-react';
import type { EditorMode } from '../../types/editor';
import type { IContent } from '../../types/content';
import { CT_FILTERS } from '../../types/content';
import { useLibrary } from '../../hooks/useLibrary';
import { useLabels } from '../../hooks/useLabels';
import { useTreeStore } from '../../store/tree.store';
import { LibraryCard } from './LibraryCard';
import { FilterChips } from './FilterChips';
import { LibraryFilterPanel } from './LibraryFilterPanel';
import type { LibraryFilters } from './LibraryFilterPanel';
import { LibraryPreviewPanel } from './LibraryPreviewPanel';
import toast from 'react-hot-toast';
import styles from './LibraryDock.module.scss';

interface LibraryDockProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  editorMode: EditorMode;
}

// Collect all resource identifiers from the tree (non-folder nodes)
function collectResourceIds(nodes: ReturnType<typeof useTreeStore.getState>['treeData']): Set<string> {
  const ids = new Set<string>();
  const queue = [...nodes];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (!node.isFolder) {
      ids.add(node.identifier);
    }
    if (node.children) queue.push(...node.children);
  }
  return ids;
}

export const LibraryDock: React.FC<LibraryDockProps> = ({ editorMode, collapsed = false, onToggleCollapse }) => {
  const lbl = useLabels();
  const {
    content,
    isLoading,
    totalCount,
    activeFilter,
    searchQuery,
    sortAZ,
    hasMore,
    search,
    setFilter,
    applyAdvancedFilters,
    toggleSort,
    loadMore,
  } = useLibrary();

  const { addResource, selectedNodeId, treeData } = useTreeStore();
  const isEditable = editorMode === 'edit';

  // Panel state
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<LibraryFilters>({});
  const [previewContent, setPreviewContent] = useState<IContent | null>(null);

  // Build a set of already-added resource identifiers for O(1) lookup
  const addedIds = useMemo(() => collectResourceIds(treeData), [treeData]);

  const handleAdd = useCallback(
    (item: IContent) => {
      if (!selectedNodeId) {
        toast.error(lbl.libraryDock.selectUnitFirstToast);
        return;
      }
      const rootId = treeData[0]?.id;
      if (selectedNodeId === rootId) {
        toast(lbl.libraryDock.selectUnitFromOutlineToast, {
          icon: <Info size={16} />,
          duration: 4000,
        });
        return;
      }
      const added = addResource(item, selectedNodeId);
      if (added === false) {
        toast.error(lbl.libraryDock.itemAlreadyAddedToast.replace('{name}', item.name));
        return;
      }
      toast.success(lbl.libraryDock.itemAddedToast.replace('{name}', item.name));
    },
    [selectedNodeId, addResource, treeData, lbl],
  );

  const handleApplyFilters = useCallback(
    (filters: LibraryFilters) => {
      setActiveFilters(filters);
      applyAdvancedFilters(filters);
    },
    [applyAdvancedFilters],
  );

  const handleCardPreview = useCallback((item: IContent) => {
    setPreviewContent(item);
  }, []);

  const handlePreviewAdd = useCallback(
    (item: IContent) => {
      handleAdd(item);
      setPreviewContent(null);
    },
    [handleAdd],
  );

  // Count active advanced filters for badge
  const activeFilterCount = useMemo(
    () =>
      Object.values(activeFilters).reduce(
        (sum, arr) => sum + (arr?.length ?? 0),
        0,
      ),
    [activeFilters],
  );

  return (
    <div className={styles.dock}>
      {/* Header — collapse control sits to the left of the Library icon */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onToggleCollapse}
            aria-label={lbl.libraryDock.collapseLibraryPanelAriaLabel}
            title={lbl.libraryDock.collapseLibraryTitle}
          >
            <PanelRightClose size={15} />
          </button>
          <Library size={16} />
          <span className={styles.headerTitle}>{lbl.libraryDock.headerTitle}</span>
          {totalCount > 0 && (
            <span className={styles.count}>{totalCount}</span>
          )}
        </div>
      </div>

      {/* Search + Filter button row */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder={lbl.libraryDock.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => search(e.target.value)}
            aria-label={lbl.libraryDock.searchAriaLabel}
          />
        </div>
        <button
          type="button"
          className={[styles.filterToggleBtn, sortAZ ? styles.filterToggleBtnActive : ''].join(' ')}
          onClick={toggleSort}
          aria-label={sortAZ ? lbl.libraryDock.sortAZAriaLabel : lbl.libraryDock.sortRecentAriaLabel}
          title={sortAZ ? lbl.libraryDock.sortAZTitle : lbl.libraryDock.sortRecentTitle}
        >
          {sortAZ ? <ArrowUpAZ size={15} /> : <Clock size={15} />}
        </button>
        <button
          type="button"
          className={[
            styles.filterToggleBtn,
            filterPanelOpen ? styles.filterToggleBtnActive : '',
          ].join(' ')}
          onClick={() => setFilterPanelOpen((v) => !v)}
          aria-label={lbl.libraryDock.toggleAdvancedFiltersAriaLabel}
          aria-pressed={filterPanelOpen}
          title={lbl.libraryDock.advancedFiltersTitle}
        >
          <SlidersHorizontal size={15} />
          {activeFilterCount > 0 && (
            <span className={styles.filterBadge}>{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Content type filter chips */}
      <div className={styles.filters}>
        <FilterChips filters={CT_FILTERS} active={activeFilter} onChange={setFilter} />
      </div>

      {/* Main area: card list + optional side panels */}
      <div className={styles.mainArea}>
        {/* Card list */}
        <div className={styles.cardList} role="list" aria-label={lbl.libraryDock.libraryContentAriaLabel}>
          {isLoading && content.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeleton} aria-hidden="true">
                <div className={styles.skeletonIcon} />
                <div className={styles.skeletonText}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineSm} />
                </div>
              </div>
            ))
          ) : content.length > 0 ? (
            <>
              {content.map((item) => (
                <LibraryCard
                  key={item.identifier}
                  item={item}
                  onAdd={handleAdd}
                  onPreview={handleCardPreview}
                  isDraggable={isEditable}
                  isAdded={addedIds.has(item.identifier)}
                />
              ))}

              {/* Load More */}
              {hasMore && (
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={loadMore}
                  disabled={isLoading}
                  aria-label={lbl.libraryDock.loadMoreAriaLabel}
                >
                  {isLoading ? lbl.libraryDock.loadingText : lbl.libraryDock.loadMoreText}
                </button>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <Search size={24} />
              <p>{lbl.libraryDock.noContentFound}</p>
              <span>{lbl.libraryDock.tryDifferentSearch}</span>
            </div>
          )}
        </div>

        {/* Advanced filter panel */}
        {filterPanelOpen && (
          <div className={styles.sidePanelOverlay}>
            <LibraryFilterPanel
              isOpen={filterPanelOpen}
              filters={activeFilters}
              onApply={handleApplyFilters}
              onClose={() => setFilterPanelOpen(false)}
            />
          </div>
        )}

        {/* Preview — opens directly as a centered modal (self-portaled) */}
        {previewContent && (
          <LibraryPreviewPanel
            content={previewContent}
            editorMode={editorMode}
            onAdd={handlePreviewAdd}
            onClose={() => setPreviewContent(null)}
          />
        )}
      </div>
    </div>
  );
};
