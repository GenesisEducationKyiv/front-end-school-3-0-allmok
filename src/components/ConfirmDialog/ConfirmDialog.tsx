import React, { ReactNode } from 'react';
import Modal from '../modal/Modal'; 
import '../../css/ConfirmDialog.css'; 

interface ConfirmDialogProps {
  isOpen: boolean;          
  onClose: () => void;      
  onConfirm: () => void; 
  title: string;  
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false
}) => {

  if (!isOpen) {
    return null;
  }

  return (
 
    <Modal isOpen={isOpen} onClose={onClose} data-testid="confirm-dialog">
      <div className="confirm-dialog-content">
        <h2 className="confirm-dialog-title">{title}</h2>
        <div className="confirm-dialog-message">{message}</div>
        <div className="confirm-dialog-actions">
          <button
            onClick={onConfirm}
            className="confirm-button" 
            data-testid="confirm-delete" 
            disabled={isLoading} 
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>

          <button
            onClick={onClose}
            className="cancel-button" 
            data-testid="cancel-delete" 
            disabled={isLoading} 
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;