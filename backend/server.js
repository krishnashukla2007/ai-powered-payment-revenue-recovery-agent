require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const getPaymentStats = require("./services/statsService");
const analyzePayment = require("./agents/recoveryAgent");
const processPayment = require("./services/paymentProcessingService");
const Payment = require("./models/Payment");
const simulatePaymentScenario = require("./services/paymentSimulatorService");
const AuditEvent = require("./models/AuditEvent");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "AI Revenue Recovery backend is running",
    status: "healthy",
  });
});

app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Failed to fetch payments:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/payments/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findOne({
      paymentId: req.params.paymentId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Failed to fetch payment:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/payments/:paymentId/audit", async (req, res) => {
  try {
    const events = await AuditEvent.find({
      paymentId: req.params.paymentId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      paymentId: req.params.paymentId,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Failed to fetch audit history:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const stats = await getPaymentStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Failed to calculate stats:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/agent/analyze", async (req, res) => {
  try {
    const paymentContext = req.body;

    const decision = await analyzePayment(paymentContext);

    res.json({
      success: true,
      decision,
    });
  } catch (error) {
    console.error("Agent analysis failed:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/payments", async (req, res) => {
    try {
        const payment = await Payment.create(req.body);

        simulatePaymentScenario({
            paymentId: payment.paymentId,
            scenario: req.body.scenario,
        });

    // Process payment through AI recovery workflow
        const result = await processPayment(payment.paymentId);

        res.status(201).json({
        success: true,
        message: "Payment processed successfully",
        payment: result.payment,
        decision: result.decision,
        recheckCount: result.recheckCount,
        });

    } 
    catch (error) {
        console.error("Payment processing failed:", error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});