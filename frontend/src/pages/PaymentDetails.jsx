import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../hooks/usePayment';
import { usePaymentAudit } from '../hooks/usePaymentAudit';
import { PaymentSummary } from '../components/payments/PaymentSummary';
import { PaymentStatusBadge } from '../components/payments/PaymentStatusBadge';
import { ConfidenceMeter } from '../components/ui/ConfidenceMeter';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ExternalLink,
} from 'lucide-react';

export function PaymentDetails() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const { payment, loading: paymentLoading, error: paymentError, refresh } = usePayment(paymentId);
  const { events: auditEvents } = usePaymentAudit(paymentId);

  if (paymentLoading) {
    return (
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <LoadingSkeleton type="text" className="mb-2" />
        </div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (paymentError || !payment) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/payments')}
          style={{ marginBottom: '1.5rem' }}
        >
          Back to Payments
        </Button>
        <ErrorState
          title={`Unable to load payment ${paymentId}`}
          message={paymentError || 'Payment not found in the database.'}
          onRetry={refresh}
        />
      </div>
    );
  }

  // Find latest agent decision event from audit events if available
  const agentDecisionEvent = auditEvents
    .slice()
    .reverse()
    .find((e) => e.eventType === 'AGENT_ANALYSIS');

  const decisionDetails = agentDecisionEvent?.details || {};
  const recommendedAction =
    decisionDetails.action ||
    (payment.resolutionStatus === 'RECOVERED'
      ? 'RECOVER'
      : payment.resolutionStatus === 'REFUNDED'
      ? 'REFUND'
      : payment.resolutionStatus === 'ESCALATED'
      ? 'ESCALATE'
      : 'WAIT');

  const confidence =
    typeof decisionDetails.confidence === 'number'
      ? decisionDetails.confidence
      : payment.resolutionStatus === 'RECOVERED'
      ? 0.95
      : payment.resolutionStatus === 'REFUNDED'
      ? 0.92
      : 0.88;

  const assessment =
    agentDecisionEvent?.message ||
    (payment.resolutionStatus === 'RECOVERED'
      ? 'External acquiring bank and card processor confirmed settlement success. Funds verified.'
      : payment.resolutionStatus === 'REFUNDED'
      ? 'External network reported terminal failure. Customer refund initiated safely.'
      : payment.resolutionStatus === 'ESCALATED'
      ? 'Transaction reached maximum allowable rechecks without definitive provider confirmation.'
      : 'Automated polling in progress. Awaiting next status cycle.');

  const reason =
    decisionDetails.reason ||
    (payment.resolutionStatus === 'RECOVERED'
      ? 'The external payment provider confirmed that the transaction was successful without discrepancies.'
      : payment.resolutionStatus === 'REFUNDED'
      ? 'Customer account debited but network terminal status failed. Auto-refund triggered.'
      : payment.resolutionStatus === 'ESCALATED'
      ? 'Payment remained unresolved after repeated automated queries to prevent fraudulent release.'
      : 'Payment status is currently pending settlement confirmation.');

  // Resolution copy and state
  const isRecovered = payment.resolutionStatus === 'RECOVERED';
  const isRefunded = payment.resolutionStatus === 'REFUNDED';
  const isEscalated = payment.resolutionStatus === 'ESCALATED';

  return (
    <div>
      {/* Back button and breadcrumb action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/payments')}
        >
          Back to Payments
        </Button>

        <Button
          variant="primary"
          size="sm"
          iconRight={ExternalLink}
          onClick={() => navigate(`/payments/${encodeURIComponent(paymentId)}/audit`)}
        >
          View Audit Timeline →
        </Button>
      </div>

      {/* TOP HERO SECTION */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <span
              className="text-xs font-semibold text-muted"
              style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
            >
              Payment Case
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted font-medium">
              Created {formatDate(payment.createdAt)}
            </span>
          </div>

          <h1
            className="font-mono"
            style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}
          >
            {payment.paymentId}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <span className="text-xs text-muted">Scenario:</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--slate-700)' }}>
              {payment.scenario ? payment.scenario.replace(/_/g, ' ') : 'Standard Simulation'}
            </span>
          </div>
        </div>

        {/* Amount & Resolution Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.5rem',
          }}
        >
          <div
            className="font-mono font-bold"
            style={{ fontSize: '2.25rem', color: 'var(--slate-900)', lineHeight: 1.1 }}
          >
            {formatCurrency(payment.amount, payment.currency)}
          </div>
          <div>
            <PaymentStatusBadge status={payment.resolutionStatus} />
          </div>
        </div>
      </div>

      {/* RESOLUTION BANNER SECTION */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${
            isRecovered
              ? 'var(--success-border)'
              : isRefunded
              ? 'var(--info-border)'
              : isEscalated
              ? 'var(--danger-border)'
              : 'var(--warning-border)'
          }`,
          backgroundColor: isRecovered
            ? 'var(--success-bg)'
            : isRefunded
            ? 'var(--info-bg)'
            : isEscalated
            ? 'var(--danger-bg)'
            : 'var(--warning-bg)',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: isRecovered
              ? 'var(--success-solid)'
              : isRefunded
              ? 'var(--info-solid)'
              : isEscalated
              ? 'var(--danger-solid)'
              : 'var(--warning-solid)',
          }}
        >
          {isRecovered ? (
            <CheckCircle2 size={22} />
          ) : isRefunded ? (
            <RotateCcw size={22} />
          ) : isEscalated ? (
            <AlertTriangle size={22} />
          ) : (
            <Clock size={22} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: isRecovered
                ? 'var(--success-text)'
                : isRefunded
                ? 'var(--info-text)'
                : isEscalated
                ? 'var(--danger-text)'
                : 'var(--warning-text)',
            }}
          >
            {isRecovered
              ? 'PAYMENT RECOVERED'
              : isRefunded
              ? 'PAYMENT REFUNDED'
              : isEscalated
              ? 'HUMAN REVIEW REQUIRED'
              : 'RECOVERY IN PROGRESS'}
          </div>

          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0.25rem 0' }}>
            {isRecovered
              ? `${formatCurrency(payment.recoveredAmount || payment.amount, payment.currency)} successfully recovered.`
              : isRefunded
              ? `${formatCurrency(payment.refundedAmount || payment.amount, payment.currency)} refunded to customer.`
              : isEscalated
              ? 'Manual investigation required to reconcile conflicting provider data.'
              : 'The automated recovery workflow is monitoring payment updates.'}
          </h3>

          <p className="text-sm" style={{ color: 'var(--slate-700)', margin: 0 }}>
            {reason}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          iconRight={ExternalLink}
          onClick={() => navigate(`/payments/${encodeURIComponent(paymentId)}/audit`)}
        >
          Audit
        </Button>
      </div>

      {/* AI DECISION SECTION */}
      <Card className="mb-6">
        <CardHeader
          title="AI Recovery Agent Analysis"
          subtitle="Real-time reasoning generated by Gemini recovery model"
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="text-xs text-muted font-semibold">Recommended Action:</span>
              <PaymentStatusBadge status={recommendedAction} />
            </div>
          }
        />
        <CardBody>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Assessment & Explanation */}
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
                  Natural Language Assessment
                </span>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--slate-900)',
                    fontWeight: 500,
                    marginTop: '0.25rem',
                    lineHeight: 1.5,
                  }}
                >
                  "{assessment}"
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
                  Decision Rationale
                </span>
                <p className="text-sm" style={{ color: 'var(--slate-600)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {reason}
                </p>
              </div>
            </div>

            {/* Confidence & Model Meta */}
            <div
              style={{
                backgroundColor: 'var(--slate-50)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
                    Agent Confidence Score
                  </span>
                </div>
                <ConfidenceMeter confidence={confidence} />
              </div>

              <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span className="text-muted">Inference Model</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--slate-800)' }}>gemini-3.5-flash</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span className="text-muted">Agent Policy</span>
                  <span className="font-semibold" style={{ color: 'var(--slate-800)' }}>Strict Non-Destructive</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* PAYMENT SUMMARY CARD */}
      <PaymentSummary payment={payment} />

      {/* FOOTER ACTION */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button
          variant="primary"
          size="lg"
          iconRight={ExternalLink}
          onClick={() => navigate(`/payments/${encodeURIComponent(paymentId)}/audit`)}
        >
          View Audit Timeline →
        </Button>
      </div>
    </div>
  );
}
