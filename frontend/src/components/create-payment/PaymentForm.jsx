import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { ScenarioSelector } from './ScenarioSelector';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { PaymentStatusBadge } from '../payments/PaymentStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export function PaymentForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => ({
    paymentId: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: '12500',
    currency: 'INR',
    customerStatus: 'DEBITED',
    razorpayStatus: 'PENDING',
    externalStatus: 'PENDING',
    scenario: 'PENDING_SUCCESS',
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateRandomId = () => {
    const randomId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData((prev) => ({ ...prev, paymentId: randomId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paymentId.trim()) {
      setError('Payment ID is required.');
      return;
    }
    const numAmount = Number(formData.amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await paymentService.createPayment({
        ...formData,
        amount: numAmount,
      });

      setResult(response);
    } catch (err) {
      setError(
        err.message ||
          'Failed to submit payment recovery case. Please check backend server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (result && result.payment) {
    const createdPayment = result.payment;
    const decision = result.decision;

    return (
      <Card className="animate-fade-in">
        <CardBody style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-solid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)' }}>
            Recovery Workflow Completed
          </h2>
          <p className="text-sm text-muted" style={{ maxWidth: '520px', margin: '0.5rem auto 1.75rem auto' }}>
            Payment <strong>{createdPayment.paymentId}</strong> was processed through the AI recovery
            engine and recorded to the immutable audit trail.
          </p>

          {/* Outcome Summary Box */}
          <div
            style={{
              maxWidth: '560px',
              margin: '0 auto 2rem auto',
              padding: '1.25rem',
              backgroundColor: 'var(--slate-50)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <span className="text-xs text-muted font-semibold" style={{ textTransform: 'uppercase' }}>
                Payment ID
              </span>
              <div className="font-mono font-bold" style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                {createdPayment.paymentId}
              </div>
            </div>

            <div>
              <span className="text-xs text-muted font-semibold" style={{ textTransform: 'uppercase' }}>
                Amount
              </span>
              <div className="font-mono font-bold" style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                {formatCurrency(createdPayment.amount, createdPayment.currency)}
              </div>
            </div>

            <div>
              <span className="text-xs text-muted font-semibold" style={{ textTransform: 'uppercase' }}>
                Final Resolution
              </span>
              <div style={{ marginTop: '0.25rem' }}>
                <PaymentStatusBadge status={createdPayment.resolutionStatus} />
              </div>
            </div>

            {decision?.action && (
              <div>
                <span className="text-xs text-muted font-semibold" style={{ textTransform: 'uppercase' }}>
                  AI Decision Action
                </span>
                <div style={{ marginTop: '0.25rem' }}>
                  <PaymentStatusBadge status={decision.action} />
                </div>
              </div>
            )}
          </div>

          {decision?.reason && (
            <div
              style={{
                maxWidth: '560px',
                margin: '0 auto 2rem auto',
                padding: '0.875rem 1rem',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--slate-700)',
                textAlign: 'left',
              }}
            >
              <strong>AI Decision Reason: </strong>
              {decision.reason}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => navigate(`/payments/${encodeURIComponent(createdPayment.paymentId)}`)}
            >
              View Payment Details
            </Button>
            <Button
              variant="secondary"
              icon={ExternalLink}
              onClick={() =>
                navigate(`/payments/${encodeURIComponent(createdPayment.paymentId)}/audit`)
              }
            >
              View Audit Timeline
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                generateRandomId();
              }}
            >
              Submit Another Case
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Payment Information & Initial State"
        subtitle="Specify payment ledger attributes and select a simulation lifecycle scenario"
      />

      <CardBody>
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger-text)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* SECTION 1: PAYMENT INFORMATION */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--slate-500)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--slate-200)',
              }}
            >
              1. Payment Ledger Information
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Payment ID */}
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="paymentId" className="input-label">
                    Payment ID *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomId}
                    disabled={loading}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary-600)',
                      fontWeight: 600,
                    }}
                  >
                    Random ID
                  </button>
                </div>
                <input
                  id="paymentId"
                  type="text"
                  required
                  disabled={loading}
                  className="input-field font-mono"
                  placeholder="e.g. PAY-1008"
                  value={formData.paymentId}
                  onChange={(e) => handleChange('paymentId', e.target.value)}
                />
              </div>

              {/* Amount */}
              <div className="input-group">
                <label htmlFor="amount" className="input-label">
                  Amount *
                </label>
                <input
                  id="amount"
                  type="number"
                  required
                  min="1"
                  step="any"
                  disabled={loading}
                  className="input-field font-mono"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                />
              </div>

              {/* Currency */}
              <div className="input-group">
                <label htmlFor="currency" className="input-label">
                  Currency
                </label>
                <select
                  id="currency"
                  disabled={loading}
                  className="select-field"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              {/* Customer Status */}
              <div className="input-group">
                <label htmlFor="customerStatus" className="input-label">
                  Customer Status
                </label>
                <select
                  id="customerStatus"
                  disabled={loading}
                  className="select-field"
                  value={formData.customerStatus}
                  onChange={(e) => handleChange('customerStatus', e.target.value)}
                >
                  <option value="DEBITED">DEBITED (Account Debited)</option>
                  <option value="NOT_DEBITED">NOT DEBITED (No Charge)</option>
                  <option value="UNKNOWN">UNKNOWN</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PAYMENT STATUS */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--slate-500)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--slate-200)',
              }}
            >
              2. Gateway & Network Statuses
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Razorpay Status */}
              <div className="input-group">
                <label htmlFor="razorpayStatus" className="input-label">
                  Razorpay Gateway Status
                </label>
                <select
                  id="razorpayStatus"
                  disabled={loading}
                  className="select-field"
                  value={formData.razorpayStatus}
                  onChange={(e) => handleChange('razorpayStatus', e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              {/* External Status */}
              <div className="input-group">
                <label htmlFor="externalStatus" className="input-label">
                  External Provider Status
                </label>
                <select
                  id="externalStatus"
                  disabled={loading}
                  className="select-field"
                  value={formData.externalStatus}
                  onChange={(e) => handleChange('externalStatus', e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: RECOVERY SCENARIO */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--slate-500)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--slate-200)',
              }}
            >
              3. Recovery Simulation Scenario
            </div>

            <ScenarioSelector
              selectedScenario={formData.scenario}
              onChange={(sc) => handleChange('scenario', sc)}
              disabled={loading}
            />
          </div>

          {/* Loading status callout */}
          {loading && (
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div className="btn-spinner" style={{ width: '22px', height: '22px', color: 'var(--primary-600)' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '0.875rem' }}>
                  AI Recovery Workflow in Progress...
                </div>
                <div className="text-xs text-muted" style={{ marginTop: '0.125rem' }}>
                  Executing Gemini 3.5 analysis, simulating bank status rechecks, and reconciling ledger state.
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              icon={Sparkles}
            >
              Analyze Payment
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
