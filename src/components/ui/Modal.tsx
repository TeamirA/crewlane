"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";

import { cn } from "@/lib/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "md" | "lg";
  children: ReactNode;
}

const sizeClasses = { md: "max-w-md", lg: "max-w-3xl" };

// Built on the native <dialog> element, which provides focus trapping and Escape handling.
export function Modal({ isOpen, onClose, title, description, size = "md", children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-xl bg-white p-0 shadow-xl backdrop:bg-neutral-900/40",
        sizeClasses[size],
      )}
    >
      {isOpen && (
        <div className="flex max-h-[85vh] flex-col">
          <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
              {description && <p className="text-sm text-neutral-500">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
            >
              <span aria-hidden="true" className="block text-xl leading-none">
                ×
              </span>
            </button>
          </header>
          <div className="overflow-y-auto px-5 py-4">{children}</div>
        </div>
      )}
    </dialog>
  );
}
