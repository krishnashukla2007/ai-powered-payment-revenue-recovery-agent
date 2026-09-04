const Payment = require("../models/Payment");
const recordAuditEvent = require("./auditService");
const analyzePayment = require("../agents/recoveryAgent");
const executeAction = require("./actionExecutionService");

const RECHECK_INTERVAL = 5000;
const MAX_RECHECKS = 3;

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const processPayment = async (paymentId) => {
  const payment = await Payment.findOne({ paymentId });

  if (!payment) {
    throw new Error("Payment not found");
  }

  await recordAuditEvent({
    paymentId: payment.paymentId,
    eventType: "PAYMENT_PROCESSING_STARTED",
    message: "Payment entered the AI recovery workflow",
    actor: "SYSTEM",
  });

  let recheckCount = 0;

  while (true) {
    // Get the latest version of the payment from MongoDB
    const latestPayment = await Payment.findOne({ paymentId });

    const paymentContext = {
      paymentId: latestPayment.paymentId,
      amount: latestPayment.amount,
      currency: latestPayment.currency,
      customerStatus: latestPayment.customerStatus,
      razorpayStatus: latestPayment.razorpayStatus,
      externalStatus: latestPayment.externalStatus,
      resolutionStatus: latestPayment.resolutionStatus,
    };

    // Ask the AI agent for a fresh decision
    const decision = await analyzePayment(paymentContext);

    await recordAuditEvent({
      paymentId: latestPayment.paymentId,
      eventType: "AGENT_ANALYSIS",
      message: decision.assessment,
      actor: "AI_AGENT",
      details: {
        action: decision.action,
        reason: decision.reason,
        confidence: decision.confidence,
        recheckCount,
      },
    });

    if (decision.action !== "WAIT") {
      const executionResult = await executeAction({
        paymentId: latestPayment.paymentId,
        decision,
      });

      return {
        payment: executionResult.payment,
        decision,
        executedAction: executionResult.executedAction,
        recheckCount,
      };
    }

    if (recheckCount >= MAX_RECHECKS) {
      latestPayment.escalated = true;
      latestPayment.resolutionStatus = "ESCALATED";

      await latestPayment.save();

      await recordAuditEvent({
        paymentId: latestPayment.paymentId,
        eventType: "ESCALATED_TO_HUMAN",
        message:
          "Maximum payment status recheck limit reached. Payment escalated to human review.",
        actor: "SYSTEM",
        details: {
          maxRechecks: MAX_RECHECKS,
        },
      });

      return {
        payment: latestPayment,
        decision: {
          action: "ESCALATE",
          reason: "Maximum recheck limit reached while payment remained unresolved.",
        },
        recheckCount,
      };
    }

    recheckCount++;

    await recordAuditEvent({
      paymentId: latestPayment.paymentId,
      eventType: "WAITING_FOR_STATUS_UPDATE",
      message: `Agent recommended WAIT. Recheck ${recheckCount} scheduled.`,
      actor: "SYSTEM",
      details: {
        recheckNumber: recheckCount,
        waitTimeMs: RECHECK_INTERVAL,
      },
    });

    // Wait for 5 seconds
    await delay(RECHECK_INTERVAL);

    await recordAuditEvent({
      paymentId: latestPayment.paymentId,
      eventType: "STATUS_RECHECK",
      message: `Performing payment status recheck ${recheckCount}.`,
      actor: "SYSTEM",
      details: {
        recheckNumber: recheckCount,
      },
    });
  }
};

module.exports = processPayment;