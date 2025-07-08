import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog (Black-box)', () => {
  const createConfirmDialog = (isOpen = true, overrideProps = {}) => {
    const defaultProps = {
      isOpen,
      onClose: vi.fn(),
      onConfirm: vi.fn(), 
      title: "Test",
      message: "Test"
    };
    return <ConfirmDialog {...defaultProps} {...overrideProps} />;
  };

  it('should not render when isOpen is false', () => {
    render(createConfirmDialog(false, {
      title: "Test Title",
      message: "Test Message"
    }));
    expect(screen.queryByTestId('confirm-dialog')).toBeNull();
  });

  it('should render correctly when isOpen is true', () => {
    render(createConfirmDialog(true, {
      title: "Delete Confirmation",
      message: "Are you sure?"
    }));
    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete')).toHaveTextContent('Confirm');
    expect(screen.getByTestId('cancel-delete')).toHaveTextContent('Cancel');
  });

  it('should call onConfirm when the confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    render(createConfirmDialog(true, {
      onConfirm: handleConfirm
    }));
    fireEvent.click(screen.getByTestId('confirm-delete'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(createConfirmDialog(true, {
      onClose: handleClose
    }));
    fireEvent.click(screen.getByTestId('cancel-delete'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should display loading state and disable buttons when isLoading is true', () => {
    render(createConfirmDialog(true, {
      isLoading: true
    }));
    const confirmButton = screen.getByTestId('confirm-delete');
    const cancelButton = screen.getByTestId('cancel-delete');
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toHaveTextContent('Processing...');
  });
});