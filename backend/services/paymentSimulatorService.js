const Payment = require("../models/Payment");
const recordAuditEvent = require("./auditService");

const updatePaymentStatus = async (paymentId, updates, scenario) => {
  const payment = await Payment.findOne({ paymentId });

  if (!payment) {
    console.error(`Simulator: Payment ${paymentId} not found`);
    return;
  }

  Object.keys(updates).forEach((key) => {
    payment[key] = updates[key];
  });

  await payment.save();

  await recordAuditEvent({
    paymentId,
    eventType: "SIMULATED_STATUS_UPDATE",
    message: `Simulated payment status updated for scenario: ${scenario}`,
    actor: "SIMULATOR",
    details: {
      scenario,
      updates,
    },
  });

  console.log(
    `Simulator updated ${paymentId} for scenario ${scenario}`
  );
};

const simulatePaymentScenario = ({ paymentId, scenario }) => {
  switch (scenario) {

    case "PENDING_SUCCESS":
      setTimeout(() => {
        updatePaymentStatus(
          paymentId,
          {
            externalStatus: "SUCCESS",
          },
          scenario
        );
      }, 10000);
      break;

    case "PENDING_FAILED":
      setTimeout(() => {
        updatePaymentStatus(
          paymentId,
          {
            externalStatus: "FAILED",
          },
          scenario
        );
      }, 10000);
      break;

    case "PENDING_FOREVER":
      // Intentionally do nothing.
      // Agent will recheck 3 times and escalate.
      break;

    case "STATUS_CONFLICT":
      setTimeout(() => {
        updatePaymentStatus(
          paymentId,
          {
            externalStatus: "SUCCESS",
            razorpayStatus: "FAILED",
          },
          scenario
        );
      }, 10000);
      break;

    case "NOT_DEBITED_FAILED":
      setTimeout(() => {
        updatePaymentStatus(
          paymentId,
          {
            customerStatus: "NOT_DEBITED",
            externalStatus: "FAILED",
            razorpayStatus: "FAILED",
          },
          scenario
        );
      }, 10000);
      break;

    default:
      console.log(
        `No simulator configured for scenario: ${scenario}`
      );
  }
};

module.exports = simulatePaymentScenario;