import { CheckCircle2, RotateCcw, AlertTriangle, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { ConfidenceMeter } from '../ui/ConfidenceMeter';

export function ResolutionSummary({ payment, latestDecision = null }) {
  if (!payment) return null;

  const status = payment.resolutionStatus || 'UNRESOLVED';
  const confidence = latestDecision?.confidence ?? (status === 'RECOVERED' ? 0.95 : null);
  const reason =
    latestDecision?.reason ||
    (status === 'RECOVERED'
      ? 'The external payment provider confirmed that the transaction was successful without discrepancies.'
      : status === 'REFUNDED'
      ? 'Payment failed or contradictory statuses detected. Customer funds safely returned.'
      : status === 'ESCALATED'
      ? 'The case exceeded automated retry limits or presented conflicting terminal states requiring human review.'
      : 'The automated recovery workflow is actively monitoring for settlement updates.');

  let icon = Clock;
  let title = 'Recovery in Progress';
  let badgeText = 'Awaiting Settlement';
  let badgeClass = 'badge-warning';
  let bannerBorder = 'var(--warning-border)';
  let bannerBg = 'var(--warning-bg)';
  let bannerColor = 'var(--warning-solid)';

  if (status === 'RECOVERED') {
    icon = CheckCircle2;
    title = 'Payment Recovered Successfully';
    badgeText = `${formatCurrency(payment.recoveredAmount || payment.amount, payment.currency)} Recovered`;
    badgeClass = 'badge-success';
    bannerBorder = 'var(--success-border)';
    bannerBg = 'var(--success-bg)';
    bannerColor = 'var(--success-solid)';
  } else if (status === 'REFUNDED') {
    icon = RotateCcw;
    title = 'Customer Refund Initiated';
    badgeText = `${formatCurrency(payment.refundedAmount || payment.amount, payment.currency)} Refunded`;
    badgeClass = 'badge-info';
    bannerBorder = 'var(--info-border)';
    bannerBg = 'var(--info-bg)';
    bannerColor = 'var(--info-solid)';
  } else if (status === 'ESCALATED') {
    icon = AlertTriangle;
    title = 'Human Review Required';
    badgeText = 'Manual Intervention Required';
    badgeClass = 'badge-danger';
    bannerBorder = 'var(--danger-border)';
    bannerBg = 'var(--danger-bg)';
    bannerColor = 'var(--danger-solid)';
  }

  const IconComponent = icon;

  return (
    <div
      style={{
        backgroundColor: bannerBg,
        border: `1px solid ${bannerBorder}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: '1 1 340px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card-subtle)',
            color: bannerColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <IconComponent size={24} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              className="text-xs font-semibold"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: bannerColor,
              }}
            >
              {status === 'UNRESOLVED' ? 'Workflow Status' : 'Payment Resolved'}
            </span>
            <span className={`badge ${badgeClass}`}>{badgeText}</span>
          </div>

          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--slate-900)',
              marginTop: '0.25rem',
              marginBottom: '0.375rem',
            }}
          >
            {title}
          </h3>

          <p className="text-sm" style={{ color: 'var(--slate-700)', margin: 0, lineHeight: 1.5 }}>
            {reason}
          </p>
        </div>
      </div>

      {/* AI Confidence Metric Box */}
      {confidence !== null && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            backgroundColor: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            minWidth: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
        >
          <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
            AI Agent Confidence
          </span>
          <ConfidenceMeter confidence={confidence} />
        </div>
      )}
    </div>
  );
}
