export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <div className="flex flex-1 flex-col bg-neutral-50">{children}</div>;
}
