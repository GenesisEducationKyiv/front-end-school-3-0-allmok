import { useState, useCallback } from 'react';

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

interface ModalStateHook {
  isOpen: (type: ModalType, trackId?: string) => boolean;
  activeModal: ModalType;
  modalPayload: ModalPayload | null;
  openModal: (type: ModalType, payload?: ModalPayload) => void;
  closeModal: () => void;
}

export const useModalState = (): ModalStateHook => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalPayload, setModalPayload] = useState<ModalPayload | null>(null);

  const openModal = useCallback((type: ModalType, payload?: ModalPayload) => {
    setActiveModal(type);
    setModalPayload(payload || null);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPayload(null);
  }, []);

  const isOpen = useCallback((type: ModalType, trackId?: string) => {
    if (activeModal !== type) return false;
    if (trackId && modalPayload?.trackId !== trackId) return false;
    return true;
  }, [activeModal, modalPayload]);


  return { isOpen, activeModal, modalPayload, openModal, closeModal };
};