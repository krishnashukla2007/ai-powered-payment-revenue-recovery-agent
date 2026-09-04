import { request } from './api';

/**
 * Service methods for Payment Recovery operations
 */
export const paymentService = {
  /**
   * Health check / system status
   */
  async checkHealth() {
    return request('/');
  },

  /**
   * Fetch aggregate recovery performance statistics
   * GET /stats
   */
  async getStats() {
    const data = await request('/stats');
    return data.stats || {
      totalPayments: 0,
      totalAmountAtRisk: 0,
      totalRecovered: 0,
      totalRefunded: 0,
      totalEscalated: 0,
      recoveredPayments: 0,
      refundedPayments: 0,
      escalatedPayments: 0,
      unresolvedPayments: 0,
      recoveryRate: 0,
    };
  },

  /**
   * Fetch all payment cases
   * GET /payments
   */
  async getPayments() {
    const data = await request('/payments');
    return data.payments || [];
  },

  /**
   * Fetch a single payment by ID
   * GET /payments/:paymentId
   */
  async getPayment(paymentId) {
    if (!paymentId) throw new Error('Payment ID is required');
    const data = await request(`/payments/${encodeURIComponent(paymentId)}`);
    return data.payment;
  },

  /**
   * Fetch the audit history for a payment
   * GET /payments/:paymentId/audit
   */
  async getPaymentAudit(paymentId) {
    if (!paymentId) throw new Error('Payment ID is required');
    const data = await request(`/payments/${encodeURIComponent(paymentId)}/audit`);
    return {
      paymentId: data.paymentId,
      count: data.count || 0,
      events: data.events || [],
    };
  },

  /**
   * Create and process a new payment through the AI recovery workflow
   * POST /payments
   */
  async createPayment(paymentData) {
    const payload = {
      paymentId: paymentData.paymentId.trim(),
      amount: Number(paymentData.amount),
      currency: paymentData.currency || 'INR',
      customerStatus: paymentData.customerStatus || 'DEBITED',
      razorpayStatus: paymentData.razorpayStatus || 'PENDING',
      externalStatus: paymentData.externalStatus || 'PENDING',
      scenario: paymentData.scenario || 'PENDING_SUCCESS',
    };

    return request('/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
