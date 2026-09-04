import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { PaymentTable } from '../payments/PaymentTable';
import { ArrowRight } from 'lucide-react';

export function RecentPayments({ payments = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-6">
      <CardHeader
        title="Recent Payment Activity"
        subtitle="Latest ingested transactions entering the recovery workflow"
        action={
          <Button
            variant="ghost"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/payments')}
          >
            View All Payments
          </Button>
        }
      />
      <div style={{ padding: 0 }}>
        <PaymentTable payments={payments} loading={loading} limit={6} />
      </div>
    </Card>
  );
}
