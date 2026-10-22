"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Spinner } from "@/components/ui/Spinner";
import { useLogout } from "@/hooks/useAuthMutations";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function UserMenu() {
  const { data: currentUser } = useCurrentUser();
  const logout = useLogout();
  if (!currentUser) {
    return <Spinner size="sm" label="Loading account" />;
  }
  return (
    <Dropdown
      triggerLabel="Open account menu"
      triggerContent={<Avatar name={currentUser.displayName} seed={currentUser.id} />}
    >
      {() => (
        <>
          <div className="border-b px-4 py-2">
            <p className="text-sm font-medium">{currentUser.displayName}</p>
            <p className="text-xs text-neutral-500">@{currentUser.username}</p>
          </div>
          <DropdownItem onSelect={() => logout.mutate()} isDestructive>
            Sign out
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
