//import  IconClose  from '../../assets/icon-close.svg'
import './Modal.css';
interface ModalProps {
  isOpen: boolean;
  onClose: (/* e: React.MouseEvent<HTMLElement> */) => void;
  children: React.ReactNode;
}
export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const onWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.classList.contains('modal-wrapper'))
      onClose();
  };
  return (
    <>
      {isOpen && (
        <div className={`modal`}>
          <div className="modal-wrapper" onClick={onWrapperClick}>
            <div className="modal-content">
              <button className="modal-close-button" onClick={() => onClose()}></button>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
