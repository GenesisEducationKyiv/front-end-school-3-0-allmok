import React, { ReactNode, useEffect } from 'react';
import '../../css/Modal.css'; 

interface ModalProps {
  isOpen: boolean; 
  onClose: () => void;
  children: ReactNode; 
  'data-testid'?: string; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, 'data-testid': dataTestId }) => {

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); 
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]); 
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      data-testid={dataTestId || "modal-overlay"} 
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-content" data-testid="modal-content">

        <button className="modal-close-button" onClick={onClose} aria-label="close">
          × 
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;