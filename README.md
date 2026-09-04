# AI-Powered Payment Revenue Recovery Agent 🤖💳

> An AI-assisted fintech platform for safely analyzing unresolved payment transactions, automating recovery workflows, and escalating uncertain cases for human review.

## 🚀 Overview

**AI-Powered Payment Revenue Recovery Agent** is an intelligent fintech system designed to analyze unresolved payment transactions and recommend the safest recovery action.

The platform helps payment operations teams handle situations where payment systems return delayed, pending, failed, or conflicting transaction statuses.

The AI-powered recovery workflow can recommend actions such as:

* ⏳ **WAIT** — when the transaction is still processing
* 💰 **RECOVER** — when payment success is confirmed
* ↩️ **REFUND** — when the payment has failed
* 🚨 **ESCALATE** — when human review is required
* 🔍 **INVESTIGATE** — when available information is insufficient

The system also provides automated status rechecks, payment simulations, a complete audit trail, a human review queue, and a modern fintech operations dashboard.

---

## 🎯 Project Objective

The objective of this project is to build an AI-powered agent that helps automate the recovery and resolution of uncertain payment transactions while prioritizing safe financial decision-making.

The system aims to:

* Reduce manual payment reconciliation.
* Analyze unresolved transactions intelligently.
* Avoid unsafe premature refunds or recoveries.
* Automatically recheck pending transactions.
* Recover confirmed successful payments.
* Refund confirmed failed payments.
* Escalate uncertain or conflicting transactions for human review.
* Maintain a transparent audit trail of all decisions.

---

## 💡 Problem Statement

Payment reconciliation becomes difficult when multiple payment systems report delayed or conflicting transaction states.

Common examples include:

* A customer has been debited, but the payment gateway remains `PENDING`.
* An external payment provider reports `SUCCESS`, while another system reports `FAILED`.
* A transaction remains unresolved after multiple status checks.

Manually investigating these transactions requires significant operational effort.

At the same time, automatically refunding or recovering funds without sufficient confirmation can result in unsafe financial actions.

The **AI-Powered Payment Revenue Recovery Agent** addresses this problem by analyzing payment states, recommending safe actions, performing controlled rechecks, and escalating cases that require human intervention.

---

## 🧠 AI Recovery Workflow

```text
Payment Created
       ↓
AI Agent Analysis
       ↓
Decision
       ↓
WAIT / RECOVER / REFUND / ESCALATE
       ↓
Status Recheck (if required)
       ↓
Final Resolution
```

---

## ✨ Key Features

### 🤖 AI-Powered Payment Analysis

The AI agent analyzes unresolved payment transactions and recommends:

* WAIT
* RECOVER
* REFUND
* ESCALATE
* INVESTIGATE

---

### 🔄 Automated Status Rechecks

For pending transactions, the system:

1. Waits for a configured interval.
2. Rechecks payment statuses.
3. Analyzes the updated transaction.
4. Repeats the process up to the configured maximum recheck limit.
5. Escalates the payment if it remains unresolved.

---

### 🧪 Payment Simulation Scenarios

The project supports multiple payment scenarios:

| Scenario          | Description                                          | Expected Result |
| ----------------- | ---------------------------------------------------- | --------------- |
| `PENDING_SUCCESS` | Payment initially remains pending and later succeeds | RECOVER         |
| `PENDING_FAILED`  | Payment initially remains pending and later fails    | REFUND          |
| `PENDING_FOREVER` | Payment remains pending after multiple rechecks      | ESCALATE        |
| `STATUS_CONFLICT` | Payment providers return conflicting statuses        | ESCALATE        |

---

### 🧾 Audit Timeline

Every important event is recorded throughout the payment recovery workflow.

Examples include:

* Payment Processing Started
* AI Agent Analysis
* Waiting for Status Update
* Status Recheck
* Simulated Status Update
* Payment Recovered
* Payment Refunded
* Escalated to Human Review

The frontend presents these events as a readable payment journey.

---

### 👨‍💻 Human Review Queue

Payments are escalated for human review when:

* Payment systems report conflicting terminal statuses.
* A transaction remains pending after the maximum number of rechecks.
* Available information is insufficient for a safe automated decision.

---

### 📊 Recovery Operations Dashboard

The dashboard provides real-time operational insights including:

* Total Payments
* Amount at Risk
* Recovered Amount
* Refunded Amount
* Escalated Cases
* Recovery Rate
* Recent Payment Activity
* Human Review Queue

---

## 🏗️ Architecture

```text
                    ┌─────────────────────────┐
                    │      React Frontend     │
                    │  Recovery Dashboard    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Express API        │
                    │       Backend           │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
     ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
     │ AI Recovery    │ │    MongoDB    │ │ Payment Status │
     │ Agent          │ │    Database   │ │   Simulator    │
     └────────────────┘ └───────────────┘ └────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* REST API Integration

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI

* Google Gemini API

### Database

* MongoDB Atlas

---

## 📡 API Endpoints

### Dashboard Statistics

```http
GET /stats
```

### Get All Payments

```http
GET /payments
```

### Get Payment Details

```http
GET /payments/:paymentId
```

### Get Payment Audit Timeline

```http
GET /payments/:paymentId/audit
```

### Create Payment

```http
POST /payments
```

---

## 🔐 Safety Principles

The system is designed to prioritize safe financial decision-making.

The AI-powered agent:

* Avoids unsafe actions when payment information is uncertain.
* Rechecks pending transactions before making a final decision.
* Escalates conflicting payment states.
* Maintains a complete audit trail.
* Prioritizes human review when automated resolution is unsafe.

---

## 📁 Project Structure

```text
ai-revenue-recovery/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── agents/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── .gitignore
│
└── README.md
```

---

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

---

## 👨‍💻 Author

**Krishna Shukla**

Built for the **Razorpay AI Builder Internship 2026**.

---

## 📄 License

This project was created as part of the Razorpay AI Builder Internship 2026 project submission.
