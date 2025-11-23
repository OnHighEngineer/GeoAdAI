import DashboardClient from '@/components/dashboard/dashboard-client';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <DashboardClient />
    </SidebarProvider>
  );
}
