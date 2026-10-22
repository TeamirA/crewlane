import { AppShell } from "@/components/features/layout/AppShell";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
