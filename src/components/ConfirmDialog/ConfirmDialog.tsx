import React, { ReactNode, useRef, useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  'data-testid'?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  'data-testid': dataTestId,
}) => {
  const dialogRef = useRef<HTMLElement & { show: () => void; close: () => void }>(null);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (dialogNode) {
      if (isOpen) {
        dialogNode.show();
      } else {
        dialogNode.close();
      }
    }
  }, [isOpen]);

  return (
    <md-dialog
      ref={dialogRef}
      onClosed={onClose}
      data-testid={dataTestId ?? 'confirm-dialog'}
    >
      <div slot="headline">{title}</div>
      <div slot="content">{message}</div>
      <div slot="actions">
        <md-text-button
          onClick={onClose}
          disabled={isLoading}
          data-testid="confirm-dialog-cancel-button"
        >
          {cancelText}
        </md-text-button>
        <md-filled-button
          onClick={onConfirm}
          disabled={isLoading}
          data-testid="confirm-dialog-confirm-button"
        >
          {isLoading ? 'Processing...' : confirmText}
        </md-filled-button>
      </div>
    </md-dialog>
  );
};

export default ConfirmDialog;