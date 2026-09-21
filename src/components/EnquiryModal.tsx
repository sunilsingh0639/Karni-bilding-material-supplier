import { useEffect } from 'react';
import EnquiryForm from './EnquiryForm';
import './EnquiryModal.css';

interface Props { isOpen: boolean; onClose: () => void; defaultProduct?: string; }

export default function EnquiryModal({ isOpen, onClose, defaultProduct }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel">
        <EnquiryForm isModal onClose={onClose} defaultProduct={defaultProduct} />
      </div>
    </div>
  );
}
