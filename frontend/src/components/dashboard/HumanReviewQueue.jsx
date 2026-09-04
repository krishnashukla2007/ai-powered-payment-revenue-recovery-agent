import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { PaymentStatusBadge } from '../payments/PaymentStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

export function HumanReviewQueue({ escalatedPayments = [], totalEscalatedAmount = 0 }) {
  const navigate = useNavigate();
  const count = escalatedPayments.length;

  return (
    <Card className="mb-6">
      <CardHeader
        title="Human Review Queue"
        subtitle="Exceptions and conflicting states routed for manual operator evaluation"
        action={
          <Button
            variant="primary"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/human-review')}
          >
            Review Queue
          </Button>
        }
      />

      <CardBody>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem 1.25rem',
            backgroundColor: count > 0 ? 'var(--warning-bg)' : 'var(--slate-50)',
            border: `1px solid ${count > 0 ? 'var(--warning-border)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: count > 0 ? 'rgba(217, 119, 6, 0.15)' : 'var(--slate-200)',
                color: count > 0 ? 'var(--warning-solid)' : 'var(--slate-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {count > 0 ? <AlertCircle size={22} /> : <CheckCircle size={22} />}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.9375rem' }}>
                {count === 0
                  ? 'All recovery cases currently resolved'
                  : `${count} payment${count === 1 ? '' : 's'} require operator investigation`}
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '0.125rem' }}>
                {count === 0
                  ? 'Automated agent rules are handling all incoming transactions.'
                  : `${formatCurrency(totalEscalatedAmount)} at risk awaiting human intervention decision`}
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/human-review')}
          >
            Review Queue →
          </Button>
        </div>

        {/* Preview of first 3 escalated items */}
        {count > 0 && (
          <div className="table-responsive">
            <table className="fintech-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Customer Status</th>
                  <th>External Status</th>
                  <th>Escalation Reason</th>
                  <th>Created</th>
                  <th style={{ width: '40px' }} />
                </tr>
              </thead>
              <tbody>
                {escalatedPayments.slice(0, 3).map((p) => {
                  const paymentId = p.paymentId || p._id;
                  return (
                    <tr
                      key={p._id || paymentId}
                      className="clickable"
                      onClick={() => navigate(`/payments/${encodeURIComponent(paymentId)}`)}
                    >
                      <td className="primary-cell font-mono">{p.paymentId}</td>
                      <td className="font-mono font-semibold">
                        {formatCurrency(p.amount, p.currency)}
                      </td>
                      <td>
                        <PaymentStatusBadge status={p.customerStatus} />
                      </td>
                      <td>
                        <PaymentStatusBadge status={p.externalStatus} />
                      </td>
                      <td className="text-xs text-muted">
                        Max recheck limit reached or terminal status conflict.
                      </td>
                      <td className="text-xs text-muted">{formatDate(p.createdAt, false)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--slate-400)' }}>
                        <ArrowRight size={14} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
