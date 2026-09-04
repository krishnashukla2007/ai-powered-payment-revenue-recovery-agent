import { Card, CardHeader, CardBody } from '../ui/Card';
import { formatCurrency, formatPercent } from '../../utils/formatCurrency';
import { CheckCircle2, RotateCcw, AlertTriangle, Clock } from 'lucide-react';

export function RecoveryPerformance({ stats }) {
  const s = stats || {};
  const totalRisk = s.totalAmountAtRisk || 0;
  const recovered = s.totalRecovered || 0;
  const refunded = s.totalRefunded || 0;
  const escalated = s.totalEscalated || 0;
  const recoveryRate = s.recoveryRate || 0;

  // Percentage shares of total risk
  const recoveredPct = totalRisk > 0 ? (recovered / totalRisk) * 100 : 0;
  const refundedPct = totalRisk > 0 ? (refunded / totalRisk) * 100 : 0;
  const escalatedPct = totalRisk > 0 ? (escalated / totalRisk) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardHeader
        title="Recovery Performance & Resolution Health"
        subtitle="Live automated reconciliation breakdown across total exposure"
      />
      <CardBody>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Rate Highlight Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Resolution Efficiency
                </span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.1, marginTop: '0.25rem' }}>
                  {formatPercent(recoveryRate)}
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.6rem',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success-text)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--success-border)',
                }}
              >
                Auto-Resolved
              </span>
            </div>

            <p className="text-sm text-muted" style={{ margin: 0 }}>
              Of the <strong>{formatCurrency(totalRisk)}</strong> total at risk, <strong>{formatCurrency(recovered)}</strong> has been recovered by the AI workflow.
            </p>

            {/* Reconciliation Stacked Bar */}
            <div style={{ marginTop: '0.5rem' }}>
              <div
                style={{
                  height: '10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--slate-200)',
                  display: 'flex',
                  overflow: 'hidden',
                }}
              >
                <div
                  title={`Recovered: ${formatPercent(recoveredPct)}`}
                  style={{
                    width: `${recoveredPct}%`,
                    backgroundColor: 'var(--success-solid)',
                    transition: 'width 0.5s ease',
                  }}
                />
                <div
                  title={`Refunded: ${formatPercent(refundedPct)}`}
                  style={{
                    width: `${refundedPct}%`,
                    backgroundColor: 'var(--primary-600)',
                    transition: 'width 0.5s ease',
                  }}
                />
                <div
                  title={`Escalated: ${formatPercent(escalatedPct)}`}
                  style={{
                    width: `${escalatedPct}%`,
                    backgroundColor: 'var(--danger-solid)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-solid)' }} />
                  <span className="text-muted">Recovered ({recoveredPct.toFixed(0)}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-600)' }} />
                  <span className="text-muted">Refunded ({refundedPct.toFixed(0)}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger-solid)' }} />
                  <span className="text-muted">Escalated ({escalatedPct.toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Health Breakdown Cells */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}
          >
            {/* Recovered */}
            <div
              style={{
                padding: '1rem 1.25rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--success-solid)" />
                <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
                  Recovered Amount
                </span>
              </div>
              <div className="font-mono text-xl font-bold" style={{ color: 'var(--slate-900)' }}>
                {formatCurrency(recovered)}
              </div>
              <span className="text-xs text-muted">
                {s.recoveredPayments ?? 0} payments secured
              </span>
            </div>

            {/* Refunded */}
            <div
              style={{
                padding: '1rem 1.25rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <RotateCcw size={16} color="var(--primary-600)" />
                <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
                  Refunded Amount
                </span>
              </div>
              <div className="font-mono text-xl font-bold" style={{ color: 'var(--slate-900)' }}>
                {formatCurrency(refunded)}
              </div>
              <span className="text-xs text-muted">
                {s.refundedPayments ?? 0} customer reversals
              </span>
            </div>

            {/* Escalated */}
            <div
              style={{
                padding: '1rem 1.25rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={16} color="var(--danger-solid)" />
                <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
                  Escalated Cases
                </span>
              </div>
              <div className="font-mono text-xl font-bold" style={{ color: 'var(--slate-900)' }}>
                {s.escalatedPayments ?? 0}
              </div>
              <span className="text-xs text-muted">
                {formatCurrency(escalated)} awaiting review
              </span>
            </div>

            {/* Unresolved */}
            <div
              style={{
                padding: '1rem 1.25rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Clock size={16} color="var(--warning-solid)" />
                <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
                  Unresolved Cases
                </span>
              </div>
              <div className="font-mono text-xl font-bold" style={{ color: 'var(--slate-900)' }}>
                {s.unresolvedPayments ?? 0}
              </div>
              <span className="text-xs text-muted">
                Active workflow checks
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
