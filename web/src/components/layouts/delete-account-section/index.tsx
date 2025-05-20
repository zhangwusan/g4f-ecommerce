'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/xbutton';
import { ConfirmationModal } from '@/components/ui/confirm-model';


interface DeleteAccountProps {
  onDelete: () => void;
}

export default function DeleteAccountSection({ onDelete }: DeleteAccountProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setModalOpen(true); // Open confirmation modal
  };

  const handleConfirmDelete = () => {
    onDelete();
    setModalOpen(false); // Close modal after confirming
  };

  const handleCancelDelete = () => {
    setModalOpen(false); // Close modal without deleting
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
      <Button variant="destructive" onClick={handleDeleteClick}>
        Delete Account
      </Button>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        description="This action is irreversible. Once you delete your account, all your data will be permanently lost."
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
      />
    </section>
  );
}