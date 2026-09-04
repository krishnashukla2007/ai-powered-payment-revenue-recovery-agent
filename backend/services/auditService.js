const AuditEvent = require("../models/AuditEvent");

const recordAuditEvent = async ({
  paymentId,
  eventType,
  message,
  actor = "SYSTEM",
  details = {},
}) => {
  try {
    const event = await AuditEvent.create({
      paymentId,
      eventType,
      message,
      actor,
      details,
    });

    return event;
  } catch (error) {
    console.error("Failed to record audit event:", error.message);
    throw error;
  }
};

module.exports = recordAuditEvent;