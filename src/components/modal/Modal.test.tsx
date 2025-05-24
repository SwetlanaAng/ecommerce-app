import { render, screen, fireEvent, act } from '@testing-library/react';
import { Modal } from './Modal';

jest.useFakeTimers();

describe('Modal', () => {
  const onClose = jest.fn();
  const modalContent = <div>Modal Content</div>;

  afterEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={onClose}>
        {modalContent}
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal and locks body scroll when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    const modalDiv = screen.getByText('Modal Content').closest('.modal');
    expect(modalDiv).toHaveClass('modal--entering');

    act(() => {
      jest.advanceTimersByTime(10);
    });

    expect(modalDiv).toHaveClass('modal--entered');
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    const closeButton =
      screen.getByRole('button', { hidden: true }) ||
      screen.getByText('', { selector: '.modal-close-button' });

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside modal content (on wrapper)', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    const wrapper = screen.getByText('Modal Content').closest('.modal-wrapper');
    if (!wrapper) throw new Error('modal-wrapper not found');

    fireEvent.click(wrapper);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside modal content', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    const content = screen.getByText('Modal Content');
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('unlocks body scroll and hides modal after exit animation when isOpen changes from true to false', () => {
    const { rerender, container } = render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    const modalDiv = container.querySelector('.modal');
    expect(modalDiv).toHaveClass('modal--exiting');

    expect(document.body.style.overflow).toBe('auto');

    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(container.firstChild).toBeNull();
  });
});
