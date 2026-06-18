import { create } from 'zustand';
import type { IEditorConfig, EditorMode, IButtonLoaders } from '../types/editor';
import type { ICategoryDefinitionField } from '../api/categoryDefinition';

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
  rootFormConfig: ICategoryDefinitionField[] | null;
  unitFormConfig: ICategoryDefinitionField[] | null;
  // actions
  setEditorConfig: (config: IEditorConfig) => void;
  setEditorMode: (mode: EditorMode) => void;
  setButtonLoader: (key: keyof IButtonLoaders, value: boolean) => void;
  setShowPreview: (show: boolean) => void;
  setPageId: (pageId: string) => void;
  setNodeFlags: (flags: { isFolder?: boolean; isRoot?: boolean; isQuml?: boolean }) => void;
  setLastSaved: (ts: string) => void;
  setIsDirty: (dirty: boolean) => void;
  setFormConfigs: (rootFields: ICategoryDefinitionField[], unitFields: ICategoryDefinitionField[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  editorConfig: null,
  editorMode: 'edit',
  buttonLoaders: {
    saveCollection: false,
    publishCollection: false,
    addFromLibrary: false,
    rejectCollection: false,
    sendBackCollection: false,
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
  rootFormConfig: null,
  unitFormConfig: null,

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
  setFormConfigs: (rootFields, unitFields) => set({ rootFormConfig: rootFields, unitFormConfig: unitFields }),
}));

export const getEditorStore = () => useEditorStore.getState;
