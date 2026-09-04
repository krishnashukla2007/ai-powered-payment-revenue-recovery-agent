import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  UserCheck,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';

export function Sidebar({ escalatedCount = 0 }) {
  const [backendConnected, setBackendConnected] = useState(true);

  useEffect(() => {
    let mounted = true;
    const verifyBackend = async () => {
      try {
        await paymentService.checkHealth();
        if (mounted) setBackendConnected(true);
      } catch {
        if (mounted) setBackendConnected(false);
      }
    };

    verifyBackend();
    const interval = setInterval(verifyBackend, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <ShieldCheck size={20} />
        </div>
        <div className="brand-info">
          <span className="brand-title">RecoveryOS</span>
          <span className="brand-subtitle">Payment Recovery Operations</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav-section">
        <div className="nav-section-label">Operations</div>
        <ul className="nav-list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="nav-item-left">
                <LayoutDashboard size={18} />
                <span>Overview</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="nav-item-left">
                <CreditCard size={18} />
                <span>Payments</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/human-review"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="nav-item-left">
                <UserCheck size={18} />
                <span>Human Review</span>
              </div>
              {escalatedCount > 0 && (
                <span className="nav-badge">{escalatedCount}</span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/new-payment"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="nav-item-left">
                <PlusCircle size={18} />
                <span>New Payment</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Footer Info */}
      <div className="sidebar-footer">
        {/* Backend Connectivity Status */}
        <div className="system-status-indicator">
          <div className="status-left">
            <span
              className={`status-dot ${backendConnected ? 'online' : 'offline'}`}
            />
            <span>
              {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
            </span>
          </div>
          <span className="text-xs font-mono text-muted">
            {backendConnected ? '5000' : 'OFFLINE'}
          </span>
        </div>

        {/* User Profile Info */}
        <div className="user-profile-strip">
          <div className="user-avatar">KR</div>
          <div className="user-meta">
            <span className="user-name">Krishna</span>
            <span className="user-role">Payment Operations</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
