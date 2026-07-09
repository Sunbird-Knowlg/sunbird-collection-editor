import { create } from 'zustand';
import type { IEditorConfig, EditorMode, IButtonLoaders } from '../types/editor';
import type { ICategoryField, IParsedCategoryDefinition } from '../api/categoryDefinition';

interface EditorState {
  editorConfig: IEditorConfig | null;
  editorMode: EditorMode;
  buttonLoaders: IButtonLoaders;
  showPreview: boolean;
  pageId: string;
  isCurrentNodeFolder: boolean;
  isCurrentNodeRoot: boolean;
  isQumlPlayer: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  rootFormConfig: ICategoryField[] | null;
  unitFormConfig: ICategoryField[] | null;
  childFormConfig: ICategoryField[] | null;
  searchFormConfig: ICategoryField[] | null;
  relationalFormConfig: ICategoryField[] | null;
  publishChecklist: ICategoryField[] | null;
  reviewChecklist: ICategoryField[] | null;
  rfcChecklist: ICategoryField[] | null;
  categoryMeta: {
    schemaDefaults: Record<string, unknown>;
    frameworkMetadata: { orgFWType?: string[]; targetFWType?: string[] };
    sourcingSettings: Record<string, unknown>;
  } | null;
  // Per-node form validity map — mirrors Angular's formStatusMapper.
  // Keys are node ids; value is false only when the form has been touched and is invalid.
  formStatusMapper: Record<string, boolean>;
  // Framework resolved from the loaded collection (rootNode.framework /
  // targetFWIds). Mirrors Angular's `collection.framework || context.framework`
  // precedence — the content's own framework wins over the editor context.
  contentFramework: string | null;
  contentTargetFWIds: string[] | null;
  // actions
  setEditorConfig: (config: IEditorConfig) => void;
  setEditorMode: (mode: EditorMode) => void;
  setButtonLoader: (key: keyof IButtonLoaders, value: boolean) => void;
  setShowPreview: (show: boolean) => void;
  setPageId: (pageId: string) => void;
  setNodeFlags: (flags: { isFolder?: boolean; isRoot?: boolean; isQuml?: boolean }) => void;
  setLastSaved: (ts: string) => void;
  setIsDirty: (dirty: boolean) => void;
  setCategoryDefinition: (parsed: IParsedCategoryDefinition) => void;
  setContentFramework: (framework: string | null, targetFWIds: string[] | null) => void;
  setFormStatus: (nodeId: string, isValid: boolean) => void;
  validateAllForms: (treeNodes: import('../types/editor').INode[]) => boolean;
}

export const useEditorStore = create<EditorState>((set) => ({
  editorConfig: null,
  editorMode: 'edit',
  buttonLoaders: {
    saveCollection: false,
    publishCollection: false,
    addFromLibrary: false,
    rejectCollection: false,
    sourcingApproveCollection: false,
    sourcingRejectCollection: false,
  },
  showPreview: false,
  pageId: 'collection_editor',
  isCurrentNodeFolder: false,
  isCurrentNodeRoot: false,
  isQumlPlayer: false,
  isDirty: false,
  lastSaved: null,
  formStatusMapper: {},
  contentFramework: null,
  contentTargetFWIds: null,
  rootFormConfig: null,
  unitFormConfig: null,
  childFormConfig: null,
  searchFormConfig: null,
  relationalFormConfig: null,
  publishChecklist: null,
  reviewChecklist: null,
  rfcChecklist: null,
  categoryMeta: null,

  setEditorConfig: (config) => set({ editorConfig: config }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  setButtonLoader: (key, value) =>
    set((state) => ({
      buttonLoaders: { ...state.buttonLoaders, [key]: value },
    })),
  setShowPreview: (show) => set({ showPreview: show }),
  setPageId: (pageId) => set({ pageId }),
  setNodeFlags: (flags) =>
    set({
      ...(flags.isFolder !== undefined && { isCurrentNodeFolder: flags.isFolder }),
      ...(flags.isRoot !== undefined && { isCurrentNodeRoot: flags.isRoot }),
      ...(flags.isQuml !== undefined && { isQumlPlayer: flags.isQuml }),
    }),
  setLastSaved: (ts) => set({ lastSaved: ts }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  setContentFramework: (framework, targetFWIds) =>
    set({ contentFramework: framework, contentTargetFWIds: targetFWIds }),
  setFormStatus: (nodeId, isValid) =>
    set((state) => ({
      formStatusMapper: { ...state.formStatusMapper, [nodeId]: isValid },
    })),
  validateAllForms: (treeNodes) => {
    const mapper = useEditorStore.getState().formStatusMapper;
    const queue = [...treeNodes];
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (mapper[node.id] === false) return false;
      if (node.children) queue.push(...node.children);
    }
    return true;
  },
  setCategoryDefinition: (parsed) =>
    set({
      rootFormConfig: parsed.rootForm,
      unitFormConfig: parsed.unitForm,
      childFormConfig: parsed.childForm,
      searchFormConfig: parsed.searchForm,
      relationalFormConfig: parsed.relationalForm,
      publishChecklist: parsed.publishChecklist,
      reviewChecklist: parsed.reviewChecklist,
      rfcChecklist: parsed.rfcChecklist,
      categoryMeta: {
        schemaDefaults: parsed.schemaDefaults,
        frameworkMetadata: parsed.frameworkMetadata,
        sourcingSettings: parsed.sourcingSettings,
      },
    }),
}));

export const getEditorStore = () => useEditorStore.getState;
