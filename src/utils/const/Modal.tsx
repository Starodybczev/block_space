import type { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    children: ReactNode;
}

export default function Modal({isOpen, closeModal, children}: ModalProps){
    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className={`modal ${isOpen ? "active" : "not_active"}`} onClick={(e) => e.stopPropagation()}>
                {children}
                <button className='btn_run' onClick={closeModal}>close</button>
            </div>
        </div>
    )
}