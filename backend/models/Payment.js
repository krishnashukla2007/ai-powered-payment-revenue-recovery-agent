const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    customerStatus: {
      type: String,
      default: "UNKNOWN",
    },

    razorpayStatus: {
      type: String,
      default: "UNKNOWN",
    },

    externalStatus: {
      type: String,
      default: "UNKNOWN",
    },

    resolutionStatus: {
      type: String,
      default: "UNRESOLVED",
    },

    recoveredAmount: {
      type: Number,
      default: 0,
    },

    refundedAmount: {
      type: Number,
      default: 0,
    },

    escalated: {
      type: Boolean,
      default: false,
    },

    scenario: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);