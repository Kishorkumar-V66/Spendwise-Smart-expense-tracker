import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger', // 'danger' | 'primary'
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl flex-shrink-0 border border-rose-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all disabled:opacity-50 ${
            confirmVariant === 'danger'
              ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
