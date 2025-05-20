'use client';

import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import Button from '@/components/ui/xbutton/base';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <Description className="mt-2 text-sm text-gray-500">
            {description}
          </Description>

          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={onClose} className="bg-blue-500 text-black">
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm} className="bg-red-500 text-white">
              {confirmLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};