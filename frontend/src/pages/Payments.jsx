import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayments } from '../hooks/usePayments';
import { PaymentTable } from '../components/payments/PaymentTable';
import { PaymentFilters } from '../components/payments/PaymentFilters';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { Plus, RefreshCw } from 'lucide-react';

export function Payments() {
  const navigate = useNavigate();
  const { payments, loading, error, refresh } = usePayments();

  const [searchQuery, setSearchQuery] = useState('');
  const [resolutionFilter, setResolutionFilter] = useState('ALL');
  const [scenarioFilter, setScenarioFilter] = useState('ALL');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const onGlobalRefresh = () => refresh();
    window.addEventListener('app:refresh-data', onGlobalRefresh);
    return () => window.removeEventListener('app:refresh-data', onGlobalRefresh);
  }, [refresh]);

  // Extract unique scenarios
  const scenarios = useMemo(() => {
    const set = new Set();
    payments.forEach((p) => {
      if (p.scenario) set.add(p.scenario);
    });
    return Array.from(set);
  }, [payments]);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search by Payment ID
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.paymentId && p.paymentId.toLowerCase().includes(q)) ||
          (p._id && p._id.toLowerCase().includes(q))
      );
    }

    // Filter by Resolution Status
    if (resolutionFilter !== 'ALL') {
      result = result.filter((p) => p.resolutionStatus === resolutionFilter);
    }

    // Filter by Scenario
    if (scenarioFilter !== 'ALL') {
      result = result.filter((p) => p.scenario === scenarioFilter);
    }

    // Filter by Customer Status
    if (customerStatusFilter !== 'ALL') {
      result = result.filter((p) => p.customerStatus === customerStatusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === 'amount-desc') {
        return (b.amount || 0) - (a.amount || 0);
      }
      if (sortBy === 'amount-asc') {
        return (a.amount || 0) - (b.amount || 0);
      }
      if (sortBy === 'id-asc') {
        return String(a.paymentId || '').localeCompare(String(b.paymentId || ''));
      }
      return 0;
    });

    return result;
  }, [payments, searchQuery, resolutionFilter, scenarioFilter, customerStatusFilter, sortBy]);

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
            Ledger Management
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            Payments
          </h1>
          <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
            Monitor and audit all payment recovery cases across the platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            icon={RefreshCw}
            loading={loading}
            onClick={refresh}
          >
            Refresh
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

      {/* Error state */}
      {error && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ErrorState
            title="Failed to load payment records"
            message={error}
            onRetry={refresh}
          />
        </div>
      )}

      <Card>
        <CardBody style={{ padding: '1.25rem 1.5rem' }}>
          {/* Controls Bar */}
          <PaymentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resolutionFilter={resolutionFilter}
            onResolutionChange={setResolutionFilter}
            scenarioFilter={scenarioFilter}
            onScenarioChange={setScenarioFilter}
            scenarios={scenarios}
            sortBy={sortBy}
            onSortChange={setSortBy}
            customerStatusFilter={customerStatusFilter}
            onCustomerStatusChange={setCustomerStatusFilter}
          />

          {/* Results Summary Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              color: 'var(--slate-500)',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '0.5rem',
            }}
          >
            <span>
              Showing <strong>{filteredPayments.length}</strong> of{' '}
              <strong>{payments.length}</strong> payments
            </span>
            <span className="text-xs">Click any row to view full case details</span>
          </div>

          {/* Table */}
          <PaymentTable
            payments={filteredPayments}
            loading={loading}
            emptyTitle={
              payments.length === 0
                ? 'No payments found'
                : 'No payments match your current filters'
            }
            emptyDescription={
              payments.length === 0
                ? 'Submit a payment transaction to begin automated recovery.'
                : 'Try adjusting or clearing your search filters to find records.'
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
