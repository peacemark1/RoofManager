
'use client';

import { useAuthStore } from '@/store/auth';
import RoofThemedDashboard from '@/components/dashboard/RoofThemedDashboard';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || 'Contractor';

  return <RoofThemedDashboard userName={userName} />;
}
