import './Modal.css';
import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting'>(
    'entering'
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => setAnimationState('entering'));
      setTimeout(() => setAnimationState('entered'), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && isVisible) {
      setAnimationState('exiting');
      const timeout = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'auto';
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isOpen, isVisible]);

  const onWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.classList.contains('modal-wrapper')) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`modal modal--${animationState}`}>
      <div className="modal-wrapper" onClick={onWrapperClick}>
        <div className="modal-content">
          <button className="modal-close-button" onClick={onClose}></button>
          {children}
        </div>
      </div>
    </div>
  );
};
