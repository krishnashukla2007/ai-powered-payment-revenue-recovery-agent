const mongoose = require("mongoose");

const auditEventSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    actor: {
      type: String,
      default: "SYSTEM",
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditEvent", auditEventSchema);