const Payment = require("../models/Payment");
const recordAuditEvent = require("./auditService");

const executeAction = async ({ paymentId, decision }) => {
  const payment = await Payment.findOne({ paymentId });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const action = decision.action?.toUpperCase();

  switch (action) {
    case "ESCALATE":
      payment.escalated = true;
      payment.resolutionStatus = "ESCALATED";

      await payment.save();

      await recordAuditEvent({
        paymentId,
        eventType: "ESCALATED_TO_HUMAN",
        message: "AI agent escalated payment for human review.",
        actor: "AI_AGENT",
        details: {
          reason: decision.reason,
          confidence: decision.confidence,
        },
      });

      return {
        payment,
        executedAction: "ESCALATE",
      };

    case "RECOVER":
      payment.recoveredAmount = payment.amount;
      payment.resolutionStatus = "RECOVERED";

      await payment.save();

      await recordAuditEvent({
        paymentId,
        eventType: "PAYMENT_RECOVERED",
        message: "Payment marked as recovered by the AI recovery workflow.",
        actor: "AI_AGENT",
        details: {
          amount: payment.amount,
          reason: decision.reason,
          confidence: decision.confidence,
        },
      });

      return {
        payment,
        executedAction: "RECOVER",
      };

    case "REFUND":
      payment.refundedAmount = payment.amount;
      payment.resolutionStatus = "REFUNDED";

      await payment.save();

      await recordAuditEvent({
        paymentId,
        eventType: "PAYMENT_REFUND_INITIATED",
        message: "Refund workflow initiated by the AI recovery workflow.",
        actor: "AI_AGENT",
        details: {
          amount: payment.amount,
          reason: decision.reason,
          confidence: decision.confidence,
        },
      });

      return {
        payment,
        executedAction: "REFUND",
      };

    case "WAIT":
      return {
        payment,
        executedAction: "WAIT",
      };

    default:
      await recordAuditEvent({
        paymentId,
        eventType: "UNKNOWN_AGENT_ACTION",
        message: `Unknown agent action received: ${action}`,
        actor: "SYSTEM",
        details: {
          originalDecision: decision,
        },
      });

      throw new Error(`Unsupported agent action: ${action}`);
  }
};

module.exports = executeAction;
