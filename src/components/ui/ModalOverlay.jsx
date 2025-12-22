import React from 'react';

export const ModalOverlay = ({ children, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200`}>
        {children}
      </div>
    </div>
  );
};