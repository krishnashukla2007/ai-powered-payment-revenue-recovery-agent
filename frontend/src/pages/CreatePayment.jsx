import { useNavigate } from 'react-router-dom';
import { PaymentForm } from '../components/create-payment/PaymentForm';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function CreatePayment() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
          style={{ marginBottom: '0.75rem' }}
        >
          Back
        </Button>

        <span
          className="text-xs font-semibold text-muted"
          style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
        >
          Recovery Ingestion
        </span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
          Create Recovery Case
        </h1>
        <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
          Submit a payment transaction for AI recovery analysis and simulated lifecycle resolution.
        </p>
      </div>

      {/* Main Payment Form */}
      <PaymentForm />
    </div>
  );
}
