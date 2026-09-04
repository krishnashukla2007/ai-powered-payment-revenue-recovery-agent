import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayments } from '../hooks/usePayments';
import { EscalatedPaymentsTable } from '../components/human-review/EscalatedPaymentsTable';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { formatCurrency } from '../utils/formatCurrency';
import {
  RefreshCw,
  Plus,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

export function HumanReview() {
  const navigate = useNavigate();
  const { payments, loading, error, refresh } = usePayments();

  useEffect(() => {
    const onGlobalRefresh = () => refresh();
    window.addEventListener('app:refresh-data', onGlobalRefresh);
    return () => window.removeEventListener('app:refresh-data', onGlobalRefresh);
  }, [refresh]);

  // Filter for ESCALATED payments
  const escalatedPayments = useMemo(() => {
    return payments.filter(
      (p) => p.resolutionStatus === 'ESCALATED' || p.escalated === true
    );
  }, [payments]);

  const totalEscalatedAmount = useMemo(() => {
    return escalatedPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [escalatedPayments]);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <span
            className="text-xs font-semibold text-muted"
            style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            Exception Management
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            Human Review Queue
          </h1>
          <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
            Payments requiring manual investigation due to provider status conflicts or recheck timeouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            icon={RefreshCw}
            loading={loading}
            onClick={refresh}
          >
            Refresh Queue
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/new-payment')}
          >
            New Payment
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Cases Count Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: escalatedPayments.length > 0 ? 'var(--danger-bg)' : 'var(--slate-100)',
              color: escalatedPayments.length > 0 ? 'var(--danger-solid)' : 'var(--slate-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Pending Escalations
            </span>
            <div className="font-mono text-2xl font-bold" style={{ color: 'var(--slate-900)' }}>
              {escalatedPayments.length}
            </div>
          </div>
        </div>

        {/* Total Amount at Risk */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: escalatedPayments.length > 0 ? 'var(--warning-bg)' : 'var(--slate-100)',
              color: escalatedPayments.length > 0 ? 'var(--warning-solid)' : 'var(--slate-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Total Amount Awaiting Review
            </span>
            <div className="font-mono text-2xl font-bold" style={{ color: 'var(--slate-900)' }}>
              {formatCurrency(totalEscalatedAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ErrorState
            title="Failed to load review queue"
            message={error}
            onRetry={refresh}
          />
        </div>
      )}

      {/* Table Card */}
      <Card>
        <CardHeader
          title="Escalated Cases Awaiting Decision"
          subtitle="Click any row to view ledger details, AI agent inference reasons, and provider logs"
        />
        <CardBody style={{ padding: 0 }}>
          <EscalatedPaymentsTable
            payments={escalatedPayments}
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
