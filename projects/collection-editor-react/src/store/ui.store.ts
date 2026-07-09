import { create } from 'zustand';

export type ModalType =
  | 'publishChecklist'
  | 'qualityParams'
  | 'manageCollaborators'
  | 'csvUpload'
  | 'confirmDelete'
  | 'resourceReorder'
  | 'assignPageNumber'
  | null;

interface UiState {
  activeModal: ModalType;
  modalData: Record<string, unknown>;
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  modalData: {},
  openModal: (modal, data = {}) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),
}));
