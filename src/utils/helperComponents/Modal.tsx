import React, { type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/20 z-40"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-2xl shadow-lg w-full max-w-md py-4 px-5 animate-fadeIn">
        {children}
      </div>
    </div>
  );
};
