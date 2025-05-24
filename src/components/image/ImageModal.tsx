import type { FC } from 'react';
import Modal from 'react-modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './ImageModal.css';

interface ImageModalProps {
  images: { url: string }[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

Modal.setAppElement('#root');

const ImageModal: FC<ImageModalProps> = ({ images, isOpen, initialIndex, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Enlarged Image Modal"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <Swiper
        modules={[Navigation]}
        navigation
        initialSlide={initialIndex}
        className="modal-swiper"
      >
        {images.map(img => (
          <SwiperSlide key={img.url}>
            <img src={img.url} alt="Product image" className="modal-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </Modal>
  );
};

export default ImageModal;
