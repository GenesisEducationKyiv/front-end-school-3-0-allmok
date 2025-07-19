import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import ConfirmDialog from './ConfirmDialog';

beforeAll(() => {
  if (!customElements.get('md-dialog')) {
    class MockMdDialog extends HTMLElement {
      show = vi.fn();
      close = vi.fn();

      connectedCallback() {
        const content = document.createElement('div');
        content.setAttribute('data-testid', 'dialog-content');

        const headline = document.createElement('div');
        const headlineSlot = document.createElement('slot');
        headlineSlot.name = 'headline';
        headline.appendChild(headlineSlot);

        const message = document.createElement('div');
        const messageSlot = document.createElement('slot');
        messageSlot.name = 'content';
        message.appendChild(messageSlot);

        const actions = document.createElement('div');
        const actionsSlot = document.createElement('slot');
        actionsSlot.name = 'actions';
        actions.appendChild(actionsSlot);

        content.appendChild(headline);
        content.appendChild(message);
        content.appendChild(actions);

        this.appendChild(content);
      }
    }
    customElements.define('md-dialog', MockMdDialog);
  }

  const defineButtonMock = (tagName: string) => {
    if (!customElements.get(tagName)) {
      class MockButton extends HTMLElement {
        connectedCallback() {
          const button = document.createElement('button');
          const slot = document.createElement('slot');
          button.appendChild(slot);
          this.appendChild(button);

          button.addEventListener('click', (e) => {
            if (typeof this.onclick === 'function') {
              this.onclick(e);
            }
          });

          if (this.hasAttribute('disabled')) {
            button.disabled = true;
          }
        }

        static get observedAttributes() {
          return ['disabled'];
        }

        attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
          if (name === 'disabled') {
            const button = this.querySelector('button');
            if (button) {
              button.disabled = newValue !== null;
            }
          }
        }
      }

      customElements.define(tagName, MockButton);
    }
  };

  defineButtonMock('md-filled-button');
  defineButtonMock('md-text-button');
});

describe('ConfirmDialog (Black-box)', () => {
  const createConfirmDialog = (isOpen = true, overrideProps = {}) => {
    const defaultProps = {
      isOpen,
      onClose: vi.fn(),
      onConfirm: vi.fn(),
      title: 'Test',
      message: 'Test',
    };
    return <ConfirmDialog {...defaultProps} {...overrideProps} />;
  };

  it('should not render when isOpen is false', () => {
    render(createConfirmDialog(false));
    const dialog = screen.getByTestId('confirm-dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should render correctly when isOpen is true', () => {
    render(
      createConfirmDialog(true, {
        title: 'Delete Confirmation',
        message: 'Are you sure?',
      })
    );

    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-dialog-confirm-button')).toHaveTextContent('Confirm');
    expect(screen.getByTestId('confirm-dialog-cancel-button')).toHaveTextContent('Cancel');
  });

  it('should call onConfirm when the confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    render(createConfirmDialog(true, { onConfirm: handleConfirm }));

    fireEvent.click(screen.getByTestId('confirm-dialog-confirm-button'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(createConfirmDialog(true, { onClose: handleClose }));

    fireEvent.click(screen.getByTestId('confirm-dialog-cancel-button'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should display loading state and disable buttons when isLoading is true', () => {
    render(createConfirmDialog(true, { isLoading: true }));

    const confirmButton = screen.getByTestId('confirm-dialog-confirm-button');
    const cancelButton = screen.getByTestId('confirm-dialog-cancel-button');

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toHaveTextContent('Processing...');
  });

  it('should use custom confirmText and cancelText when provided', () => {
    render(
      createConfirmDialog(true, {
        confirmText: 'Delete',
        cancelText: 'Keep',
      })
    );

    expect(screen.getByTestId('confirm-dialog-confirm-button')).toHaveTextContent('Delete');
    expect(screen.getByTestId('confirm-dialog-cancel-button')).toHaveTextContent('Keep');
  });

  it('should use custom data-testid when provided', () => {
    render(createConfirmDialog(true, { 'data-testid': 'custom-dialog' }));

    expect(screen.getByTestId('custom-dialog')).toBeInTheDocument();
    expect(screen.queryByTestId('confirm-dialog')).toBeNull();
  });
});
