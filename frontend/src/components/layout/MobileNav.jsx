import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  UserCheck,
  PlusCircle,
  ShieldCheck,
  X,
} from 'lucide-react';

export function MobileNav({ open, onClose, escalatedCount = 0 }) {
  return (
    <>
      <div
        className={`mobile-nav-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`mobile-nav-drawer ${open ? 'open' : ''}`}>
        <div className="sidebar-brand" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon-box">
              <ShieldCheck size={20} />
            </div>
            <div className="brand-info">
              <span className="brand-title">RecoveryOS</span>
              <span className="brand-subtitle">Payment Operations</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: 'var(--slate-400)', padding: '0.5rem' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-nav-section">
          <div className="nav-section-label">Operations</div>
          <ul className="nav-list">
            <li>
              <NavLink
                to="/"
                end
                onClick={onClose}
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
                onClick={onClose}
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
                onClick={onClose}
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
                onClick={onClose}
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
      </div>
    </>
  );
}
