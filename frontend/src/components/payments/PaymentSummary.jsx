import { Card, CardHeader, CardBody } from '../ui/Card';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { getScenarioDetails } from '../../utils/statusHelpers';

export function PaymentSummary({ payment }) {
  if (!payment) return null;

  const scenarioMeta = getScenarioDetails(payment.scenario);

  return (
    <Card className="mb-6">
      <CardHeader
        title="Reconciliation & State Summary"
        subtitle="Current status across internal ledger, payment gateways, and banking systems"
      />
      <CardBody>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Amount */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Transaction Amount
            </span>
            <span className="font-mono text-xl font-bold" style={{ color: 'var(--slate-900)' }}>
              {formatCurrency(payment.amount, payment.currency)}
            </span>
            <span className="text-xs text-muted">Currency: {payment.currency || 'INR'}</span>
          </div>

          {/* Customer Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Customer Debit Status
            </span>
            <div>
              <PaymentStatusBadge status={payment.customerStatus} />
            </div>
            <span className="text-xs text-muted">Customer bank account state</span>
          </div>

          {/* Razorpay Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Razorpay Status
            </span>
            <div>
              <PaymentStatusBadge status={payment.razorpayStatus} />
            </div>
            <span className="text-xs text-muted">Primary gateway response</span>
          </div>

          {/* External Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              External Bank / Network
            </span>
            <div>
              <PaymentStatusBadge status={payment.externalStatus} />
            </div>
            <span className="text-xs text-muted">Acquiring bank network terminal status</span>
          </div>

          {/* Resolution Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Resolution Status
            </span>
            <div>
              <PaymentStatusBadge status={payment.resolutionStatus} />
            </div>
            <span className="text-xs text-muted">Final engine outcome</span>
          </div>

          {/* Recovered Amount */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Recovered Amount
            </span>
            <span className="font-mono text-base font-bold" style={{ color: 'var(--success-solid)' }}>
              {formatCurrency(payment.recoveredAmount || 0, payment.currency)}
            </span>
            <span className="text-xs text-muted">Retained successfully</span>
          </div>

          {/* Refunded Amount */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Refunded Amount
            </span>
            <span className="font-mono text-base font-bold" style={{ color: 'var(--primary-600)' }}>
              {formatCurrency(payment.refundedAmount || 0, payment.currency)}
            </span>
            <span className="text-xs text-muted">Returned to customer</span>
          </div>

          {/* Escalation Flag */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Escalated to Operator
            </span>
            <div>
              <Badge variant={payment.escalated ? 'danger' : 'neutral'}>
                {payment.escalated ? 'Yes (Escalated)' : 'No (Automated)'}
              </Badge>
            </div>
            <span className="text-xs text-muted">Requires manual intervention</span>
          </div>

          {/* Scenario */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: 'span 2' }}>
            <span className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase' }}>
              Recovery Simulation Scenario
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--slate-800)' }}>
              {scenarioMeta.title}
            </span>
            <span className="text-xs text-muted">{scenarioMeta.description}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
