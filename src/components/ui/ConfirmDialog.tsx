"use client";

import type { ReactNode } from "react";

import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  confirmLabel: string;
  isConfirming?: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children: ReactNode;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { isOpen, title, confirmLabel, isConfirming, errorMessage, onConfirm, onCancel } = props;
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutral-700">{props.children}</div>
        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={isConfirming} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
