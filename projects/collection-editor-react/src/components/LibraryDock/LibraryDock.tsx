import React, { useCallback, useMemo, useState } from 'react';
import { Search, Library, SlidersHorizontal, ArrowUpAZ, Clock, PanelRightClose } from 'lucide-react';
import type { EditorMode } from '../../types/editor';
import type { IContent } from '../../types/content';
import { CT_FILTERS } from '../../types/content';
import { useLibrary } from '../../hooks/useLibrary';
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
        toast.error('Select a unit first');
        return;
      }
      const rootId = treeData[0]?.id;
      if (selectedNodeId === rootId) {
        toast('Select a unit from the outline to add content — resources cannot be added directly to the course.', {
          icon: 'ℹ️',
          duration: 4000,
        });
        return;
      }
      const added = addResource(item, selectedNodeId);
      if (added === false) {
        toast.error(`"${item.name}" is already in this collection`);
        return;
      }
      toast.success(`Added "${item.name}"`);
    },
    [selectedNodeId, addResource, treeData],
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
            aria-label="Collapse library panel"
            title="Collapse library"
          >
            <PanelRightClose size={15} />
          </button>
          <Library size={16} />
          <span className={styles.headerTitle}>Library</span>
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
            placeholder="Search content…"
            value={searchQuery}
            onChange={(e) => search(e.target.value)}
            aria-label="Search library"
          />
        </div>
        <button
          type="button"
          className={[styles.filterToggleBtn, sortAZ ? styles.filterToggleBtnActive : ''].join(' ')}
          onClick={toggleSort}
          aria-label={sortAZ ? 'Sort: A–Z (click for Recent)' : 'Sort: Recent (click for A–Z)'}
          title={sortAZ ? 'A–Z' : 'Recent'}
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
          aria-label="Toggle advanced filters"
          aria-pressed={filterPanelOpen}
          title="Advanced filters"
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
        <div className={styles.cardList} role="list" aria-label="Library content">
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
                  aria-label="Load more content"
                >
                  {isLoading ? 'Loading…' : 'Load More'}
                </button>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <Search size={24} />
              <p>No content found</p>
              <span>Try a different search or filter</span>
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
            onAdd={handlePreviewAdd}
            onClose={() => setPreviewContent(null)}
          />
        )}
      </div>
    </div>
  );
};
