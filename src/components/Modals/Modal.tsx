import { ReactNode, useEffect, useRef, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const onBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      console.log(e.target, e.currentTarget, "WHAT ARE THESE CLISCK");
      closeModal();
    }
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setIsModalOpen(false);
    onClose();
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
        document.body.style.overflow = "hidden";
      } else {
        modalElement.close();
      }
    }

    modalRef.current?.addEventListener("close", closeModal);
  }, [isModalOpen, modalRef.current]);

  return (
    <dialog
      ref={modalRef}
      className={`m-auto justify-center bg-inherit p-0 backdrop:bg-black/40`}
      onClick={(e) => onBackdropClick(e)}
    >
      {children}
    </dialog>
  );
}
