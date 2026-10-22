import type { KeyboardEvent, RefObject } from "react";

function getMenuItems(container: HTMLElement | null): HTMLElement[] {
  return Array.from(container?.querySelectorAll<HTMLElement>("[data-dropdown-item]") ?? []);
}

// Arrow keys move focus between menu items; Escape closes the menu and restores focus.
export function useDropdownKeyboard(
  containerRef: RefObject<HTMLDivElement | null>,
  closeMenu: () => void,
) {
  return (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      closeMenu();
      containerRef.current?.querySelector<HTMLElement>("button")?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const menuItems = getMenuItems(containerRef.current);
    if (menuItems.length === 0) return;
    event.preventDefault();
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + step + menuItems.length) % menuItems.length;
    menuItems[nextIndex].focus();
  };
}
