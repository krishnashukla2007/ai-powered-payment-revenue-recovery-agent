import { useNavigate } from 'react-router-dom';
import { PaymentStatusBadge } from '../payments/PaymentStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

export function EscalatedPaymentsTable({ payments = [], loading = false }) {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSkeleton type="table" count={4} />;
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        title="No payments require human review"
        description="All payment recovery cases are currently being handled automatically by the AI recovery workflow."
        icon={CheckCircle2}
      />
    );
  }

  return (
    <div className="table-responsive">
      <table className="fintech-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount</th>
            <th>Customer Status</th>
            <th>Razorpay Status</th>
            <th>External Status</th>
            <th>Escalation Reason</th>
            <th>Created Time</th>
            <th style={{ width: '40px' }} aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const paymentId = payment.paymentId || payment._id;
            const isConflict =
              payment.scenario === 'STATUS_CONFLICT' ||
              (payment.razorpayStatus !== 'UNKNOWN' &&
                payment.externalStatus !== 'UNKNOWN' &&
                payment.razorpayStatus !== payment.externalStatus);

            const escalationReason = isConflict
              ? 'Conflicting terminal status between gateway and bank'
              : 'Exceeded maximum automated rechecks (3 attempts)';

            return (
              <tr
                key={payment._id || paymentId}
                className="clickable"
                onClick={() => navigate(`/payments/${encodeURIComponent(paymentId)}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/payments/${encodeURIComponent(paymentId)}`);
                  }
                }}
              >
                <td className="primary-cell font-mono">{payment.paymentId}</td>

                <td>
                  <span className="font-mono font-bold" style={{ color: 'var(--slate-900)' }}>
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </td>

                <td>
                  <PaymentStatusBadge status={payment.customerStatus} />
                </td>

                <td>
                  <PaymentStatusBadge status={payment.razorpayStatus} />
                </td>

                <td>
                  <PaymentStatusBadge status={payment.externalStatus} />
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <AlertTriangle size={14} color="var(--warning-solid)" />
                    <span className="text-xs" style={{ color: 'var(--slate-700)', fontWeight: 500 }}>
                      {escalationReason}
                    </span>
                  </div>
                </td>

                <td>
                  <span className="text-xs text-muted font-medium">
                    {formatDate(payment.createdAt)}
                  </span>
                </td>

                <td style={{ textAlign: 'right', color: 'var(--slate-400)' }}>
                  <ChevronRight size={16} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
