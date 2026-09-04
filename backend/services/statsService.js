const Payment = require("../models/Payment");

const getPaymentStats = async () => {
  const payments = await Payment.find();

  const stats = payments.reduce(
    (result, payment) => {
      result.totalPayments += 1;

      // Money involved in payments handled by the system
      result.totalAmountAtRisk += payment.amount || 0;

      // Money successfully recovered
      result.totalRecovered += payment.recoveredAmount || 0;

      // Money successfully returned to customers
      result.totalRefunded += payment.refundedAmount || 0;

      // Money still unresolved/escalated
      if (payment.escalated) {
        result.totalEscalated += payment.amount || 0;
        result.escalatedPayments += 1;
      }

      if (payment.resolutionStatus === "RECOVERED") {
        result.recoveredPayments += 1;
      }

      if (payment.resolutionStatus === "REFUNDED") {
        result.refundedPayments += 1;
      }

      if (payment.resolutionStatus === "UNRESOLVED") {
        result.unresolvedPayments += 1;
      }

      return result;
    },
    {
      totalPayments: 0,
      totalAmountAtRisk: 0,

      totalRecovered: 0,
      totalRefunded: 0,
      totalEscalated: 0,

      recoveredPayments: 0,
      refundedPayments: 0,
      escalatedPayments: 0,
      unresolvedPayments: 0,
    }
  );

  stats.recoveryRate =
    stats.totalAmountAtRisk > 0
      ? Number(
          ((stats.totalRecovered / stats.totalAmountAtRisk) * 100).toFixed(2)
        )
      : 0;

  return stats;
};

module.exports = getPaymentStats;