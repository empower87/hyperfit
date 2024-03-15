import { ReactNode, useEffect, useRef, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  const handleOnClose = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      setIsModalOpen(false);
    }
  };

  return (
    <dialog
      ref={modalRef}
      className={`flex w-auto justify-center bg-inherit p-0`}
      onClick={(e) => handleOnClose(e)}
    >
      {children}
    </dialog>
  );
}
