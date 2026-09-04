import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useStats } from '../../hooks/useStats';

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { stats, refresh: refreshStats, loading: statsLoading } = useStats();
  const location = useLocation();

  const handleRefresh = () => {
    refreshStats();
    // Dispatch custom event for child pages to listen and refresh their own data
    window.dispatchEvent(new CustomEvent('app:refresh-data'));
  };

  return (
    <div className="app-shell">
      {/* Desktop Sticky Sidebar */}
      <Sidebar escalatedCount={stats?.escalatedPayments || 0} />

      {/* Mobile Nav Drawer */}
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        escalatedCount={stats?.escalatedPayments || 0}
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        <Header
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onRefresh={handleRefresh}
          refreshing={statsLoading}
        />

        <main className="page-container animate-fade-in" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
