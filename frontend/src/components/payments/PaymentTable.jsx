import { useNavigate } from 'react-router-dom';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { ChevronRight, CreditCard } from 'lucide-react';

export function PaymentTable({
  payments = [],
  loading = false,
  emptyTitle = 'No payments found',
  emptyDescription = 'Try adjusting your search criteria or create a new recovery case.',
  limit = null,
}) {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSkeleton type="table" count={limit || 5} />;
  }

  const displayedPayments = limit ? payments.slice(0, limit) : payments;

  if (!displayedPayments || displayedPayments.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={CreditCard}
        actionLabel="Create Payment"
        onAction={() => navigate('/new-payment')}
      />
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="table-responsive">
        <table className="fintech-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Customer Status</th>
              <th>Razorpay Status</th>
              <th>External Status</th>
              <th>Resolution</th>
              <th>Created At</th>
              <th style={{ width: '40px' }} aria-label="Action" />
            </tr>
          </thead>
          <tbody>
            {displayedPayments.map((payment) => {
              const paymentId = payment.paymentId || payment._id;
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
                  <td className="primary-cell">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="font-mono" style={{ color: 'var(--slate-900)' }}>
                        {payment.paymentId}
                      </span>
                      {payment.scenario && (
                        <span className="text-xs text-muted">
                          {payment.scenario.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <span className="font-mono font-semibold" style={{ color: 'var(--slate-900)' }}>
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
                    <PaymentStatusBadge status={payment.resolutionStatus} />
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="text-xs font-medium" style={{ color: 'var(--slate-700)' }}>
                        {formatDate(payment.createdAt)}
                      </span>
                      <span className="text-xs text-muted">
                        {formatRelativeTime(payment.createdAt)}
                      </span>
                    </div>
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
    </div>
  );
}
