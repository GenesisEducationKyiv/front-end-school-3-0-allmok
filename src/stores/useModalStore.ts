import { create } from 'zustand';

export type ModalType =
  | 'createTrack'
  | 'editTrack'
  | 'deleteTrack'
  | 'uploadTrackFile'
  | 'deleteTrackFile'
  | null;

export interface ModalPayload {
  trackId?: string;
}

interface ModalState {
  activeModal: ModalType;
  payload: ModalPayload | null;
  openModal: (type: ModalType, payload?: ModalPayload) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  payload: null,
  openModal: (type, payload: ModalPayload | null = null) => set({ activeModal: type, payload }),
  closeModal: () => set({ activeModal: null, payload: null }),
}));