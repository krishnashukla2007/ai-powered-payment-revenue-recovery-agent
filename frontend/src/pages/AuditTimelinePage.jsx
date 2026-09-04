import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../hooks/usePayment';
import { usePaymentAudit } from '../hooks/usePaymentAudit';
import { AuditTimeline } from '../components/audit/AuditTimeline';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export function AuditTimelinePage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const { payment, loading: paymentLoading, error: paymentError, refresh: refreshPayment } =
    usePayment(paymentId);
  const { events, loading: auditLoading, error: auditError, refresh: refreshAudit } =
    usePaymentAudit(paymentId);

  const handleRefresh = () => {
    refreshPayment();
    refreshAudit();
  };

  const loading = paymentLoading || auditLoading;
  const error = paymentError || auditError;

  return (
    <div>
      {/* Top Header & Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate(`/payments/${encodeURIComponent(paymentId)}`)}
            >
              Back to Payment {paymentId}
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Audit Timeline & Reconciliation Trail
            </h1>
            <span
              className="font-mono text-sm font-semibold"
              style={{
                padding: '0.2rem 0.6rem',
                backgroundColor: 'var(--slate-100)',
                color: 'var(--slate-800)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {paymentId}
            </span>
          </div>

          <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
            Full immutable trail of AI agent inferences, provider webhooks, and state machine decisions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            icon={RefreshCw}
            loading={loading}
            onClick={handleRefresh}
          >
            Refresh Timeline
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ErrorState
            title="Failed to load audit history"
            message={error}
            onRetry={handleRefresh}
          />
        </div>
      )}

      {/* Main Audit Content */}
      <AuditTimeline events={events} payment={payment} loading={loading} />
    </div>
  );
}
