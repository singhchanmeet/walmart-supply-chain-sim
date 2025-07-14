import React from 'react';

function ContextModal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {title && <h2 className="text-2xl font-bold mb-4 text-blue-800">{title}</h2>}
        <div className="mb-4">{children}</div>
        {actions && (
          <div className="flex gap-2 justify-end mt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContextModal; 