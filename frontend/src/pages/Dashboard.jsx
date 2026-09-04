import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';
import { usePayments } from '../hooks/usePayments';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecoveryPerformance } from '../components/dashboard/RecoveryPerformance';
import { RecentPayments } from '../components/dashboard/RecentPayments';
import { HumanReviewQueue } from '../components/dashboard/HumanReviewQueue';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import { getTimeGreeting } from '../utils/formatDate';
import {
  CreditCard,
  AlertOctagon,
  CheckCircle2,
  RotateCcw,
  TrendingUp,
  Plus,
  RefreshCw,
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useStats();
  const { payments, loading: paymentsLoading, error: paymentsError, refresh: refreshPayments } = usePayments();

  const handleRefresh = () => {
    refreshStats();
    refreshPayments();
  };

  useEffect(() => {
    const onGlobalRefresh = () => handleRefresh();
    window.addEventListener('app:refresh-data', onGlobalRefresh);
    return () => window.removeEventListener('app:refresh-data', onGlobalRefresh);
  });

  const greeting = getTimeGreeting();
  const loading = statsLoading || paymentsLoading;
  const error = statsError || paymentsError;

  // Filter escalated payments
  const escalatedPayments = payments.filter((p) => p.resolutionStatus === 'ESCALATED');
  const totalEscalatedAmount =
    stats?.totalEscalated ??
    escalatedPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div>
      {/* Page Header */}
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
            {greeting}, Krishna
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            Recovery Command Center
          </h1>
          <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
            Monitor and resolve payment recovery cases across your payment systems.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            icon={RefreshCw}
            loading={loading}
            onClick={handleRefresh}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/new-payment')}
          >
            + New Payment
          </Button>
        </div>
      </div>

      {/* Global Error Banner if API fails */}
      {error && !stats && (
        <div style={{ marginBottom: '2rem' }}>
          <ErrorState
            title="Unable to load recovery dashboard"
            message={error}
            onRetry={handleRefresh}
            technical={error}
          />
        </div>
      )}

      {/* SECTION 1: KEY METRICS */}
      {loading && !stats ? (
        <LoadingSkeleton type="stats" />
      ) : (
        <div className="stats-grid">
          {/* Total Payments */}
          <StatsCard
            label="Total Payments"
            value={stats?.totalPayments ?? payments.length}
            supportingText="All-time processed"
            icon={CreditCard}
            variant="primary"
          />

          {/* Amount at Risk */}
          <StatsCard
            label="Amount at Risk"
            value={formatCurrency(stats?.totalAmountAtRisk || 0)}
            supportingText="Total transaction exposure"
            icon={AlertOctagon}
            variant="warning"
          />

          {/* Recovered */}
          <StatsCard
            label="Recovered"
            value={formatCurrency(stats?.totalRecovered || 0)}
            supportingText={`${stats?.recoveredPayments ?? 0} successful recoveries`}
            icon={CheckCircle2}
            variant="success"
          />

          {/* Refunded */}
          <StatsCard
            label="Refunded"
            value={formatCurrency(stats?.totalRefunded || 0)}
            supportingText={`${stats?.refundedPayments ?? 0} customer refunds`}
            icon={RotateCcw}
            variant="neutral"
          />

          {/* Recovery Rate */}
          <StatsCard
            label="Recovery Rate"
            value={formatPercent(stats?.recoveryRate || 0)}
            supportingText="Resolution rate of at-risk funds"
            icon={TrendingUp}
            variant="success"
          />
        </div>
      )}

      {/* SECTION 2: RECOVERY PERFORMANCE */}
      <RecoveryPerformance stats={stats} />

      {/* SECTION 3: RECENT PAYMENT ACTIVITY */}
      <RecentPayments payments={payments} loading={loading} />

      {/* SECTION 4: HUMAN REVIEW QUEUE */}
      <HumanReviewQueue
        escalatedPayments={escalatedPayments}
        totalEscalatedAmount={totalEscalatedAmount}
      />
    </div>
  );
}
