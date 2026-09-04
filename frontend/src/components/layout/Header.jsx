import { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header({ onOpenMobileNav, onRefresh = null, refreshing = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    if (path === '/') {
      return [{ label: 'Overview', to: null }];
    }
    if (path === '/payments') {
      return [{ label: 'Payments', to: null }];
    }
    if (path === '/human-review') {
      return [{ label: 'Human Review', to: null }];
    }
    if (path === '/new-payment') {
      return [{ label: 'New Payment Case', to: null }];
    }
    if (path.startsWith('/payments/')) {
      const parts = path.split('/').filter(Boolean);
      const paymentId = parts[1];
      const isAudit = parts[2] === 'audit';

      if (isAudit) {
        return [
          { label: 'Payments', to: '/payments' },
          { label: paymentId, to: `/payments/${paymentId}` },
          { label: 'Audit Timeline', to: null },
        ];
      }
      return [
        { label: 'Payments', to: '/payments' },
        { label: paymentId, to: null },
      ];
    }
    return [{ label: 'Dashboard', to: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <nav className="header-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            Operations
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <Fragment key={idx}>
              <ChevronRight size={14} className="text-muted" />
              {crumb.to ? (
                <Link to={crumb.to}>{crumb.label}</Link>
              ) : (
                <span className="current">{crumb.label}</span>
              )}
            </Fragment>
          ))}
        </nav>
      </div>

      <div className="header-right">
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            loading={refreshing}
            onClick={onRefresh}
            title="Refresh latest data"
          >
            Refresh
          </Button>
        )}

        {path !== '/new-payment' && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/new-payment')}
          >
            New Payment
          </Button>
        )}
      </div>
    </header>
  );
}
