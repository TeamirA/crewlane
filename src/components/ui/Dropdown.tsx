"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { useDropdownKeyboard } from "./useDropdownKeyboard";

interface DropdownProps {
  triggerLabel: string;
  triggerContent: ReactNode;
  align?: "left" | "right";
  menuClassName?: string;
  children: (closeMenu: () => void) => ReactNode;
}

export function Dropdown(props: DropdownProps) {
  const { triggerLabel, triggerContent, align = "right", menuClassName, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const closeMenu = () => setIsOpen(false);
  const handleMenuKeyDown = useDropdownKeyboard(containerRef, closeMenu);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleMenuKeyDown}>
      <button
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center rounded-md p-1 hover:bg-neutral-100"
      >
        {triggerContent}
      </button>
      {isOpen && (
        <div
          id={menuId}
          className={cn(
            "absolute z-30 mt-2 min-w-48 rounded-lg border bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {children(closeMenu)}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  onSelect: () => void;
  children: ReactNode;
  isDestructive?: boolean;
}

export function DropdownItem({ onSelect, children, isDestructive }: DropdownItemProps) {
  return (
    <button
      type="button"
      data-dropdown-item
      onClick={onSelect}
      className={cn(
        "block w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 focus:bg-neutral-100",
        isDestructive ? "text-red-600" : "text-neutral-800",
      )}
    >
      {children}
    </button>
  );
}
