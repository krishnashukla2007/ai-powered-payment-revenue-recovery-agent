# AI-Powered Payment Revenue Recovery Agent 🤖💳

> An AI-assisted fintech platform for safely analyzing unresolved payment transactions, automating recovery workflows, and escalating uncertain cases for human review.

## 🌐 Live Demo

* **Frontend:** [View Live Application]([https://YOUR-VERCEL-PROJECT.vercel.app](https://ai-powered-payment-revenue-recovery.vercel.app/))

> **Note:** Replace the example URLs above with your actual Vercel and Render deployment URLs.

---

## 🚀 Overview

**AI-Powered Payment Revenue Recovery Agent** is an intelligent fintech system designed to analyze unresolved payment transactions and recommend the safest recovery action.

The platform helps payment operations teams handle situations where payment systems return delayed, pending, failed, or conflicting transaction statuses.

The AI-powered recovery workflow can recommend actions such as:

* ⏳ **WAIT** — When the transaction is still processing.
* 💰 **RECOVER** — When payment success is confirmed.
* ↩️ **REFUND** — When the payment has failed.
* 🚨 **ESCALATE** — When human review is required.
* 🔍 **INVESTIGATE** — When available information is insufficient.

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

* `WAIT`
* `RECOVER`
* `REFUND`
* `ESCALATE`
* `INVESTIGATE`

### 🔄 Automated Status Rechecks

For pending transactions, the system:

1. Waits for a configured interval.
2. Rechecks payment statuses.
3. Analyzes the updated transaction.
4. Repeats the process up to the configured maximum recheck limit.
5. Escalates the payment if it remains unresolved.

### 🧪 Payment Simulation Scenarios

The project supports multiple payment scenarios:

| Scenario          | Description                                           | Expected Result |
| ----------------- | ----------------------------------------------------- | --------------- |
| `PENDING_SUCCESS` | Payment initially remains pending and later succeeds. | `RECOVER`       |
| `PENDING_FAILED`  | Payment initially remains pending and later fails.    | `REFUND`        |
| `PENDING_FOREVER` | Payment remains pending after multiple rechecks.      | `ESCALATE`      |
| `STATUS_CONFLICT` | Payment providers return conflicting statuses.        | `ESCALATE`      |

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

### 👨‍💻 Human Review Queue

Payments are escalated for human review when:

* Payment systems report conflicting terminal statuses.
* A transaction remains pending after the maximum number of rechecks.
* Available information is insufficient for a safe automated decision.

### 📊 Recovery Operations Dashboard

The dashboard provides operational insights, including:

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
                    │   Recovery Dashboard    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       Express API       │
                    │         Backend         │
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

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Cloud Database

---

## 📡 API Endpoints

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| `GET`  | `/`                          | Backend health check                 |
| `GET`  | `/stats`                     | Retrieve dashboard statistics        |
| `GET`  | `/payments`                  | Retrieve all payments                |
| `GET`  | `/payments/:paymentId`       | Retrieve payment details             |
| `GET`  | `/payments/:paymentId/audit` | Retrieve a payment's audit timeline  |
| `POST` | `/payments`                  | Create and process a payment         |
| `POST` | `/agent/analyze`             | Analyze a payment using the AI agent |

---

## 🔐 Safety Principles

The system is designed to prioritize safe financial decision-making.

The AI-powered agent:

* Avoids unsafe actions when payment information is uncertain.
* Rechecks pending transactions before making a final decision.
* Escalates conflicting payment states.
* Maintains an audit trail of decisions and processing events.
* Prioritizes human review when automated resolution is unsafe.

> **Note:** This project uses simulated payment scenarios for demonstrating recovery workflows. It is not a production payment-processing or refund system.

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
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

* Node.js and npm
* MongoDB Atlas account or a local MongoDB instance
* Google Gemini API key

### 1. Clone the Repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd ai-revenue-recovery
```

Replace `<YOUR-GITHUB-REPOSITORY-URL>` with your repository's Git URL.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

The backend will typically run at:

```text
http://localhost:5000
```

Ensure that your backend `package.json` defines the `dev` script. If it does not, use the appropriate start command configured for your project.

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

### 4. Configure Environment Variables for Deployment

For the deployed frontend, configure the following environment variable in Vercel:

```env
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Replace the example value with your actual Render backend URL.

Configure `MONGODB_URI` and `GEMINI_API_KEY` in the Render backend service's environment variables. Never commit actual credentials or API keys to GitHub.

---

## 👨‍💻 Author

**Krishna Shukla**

Built for the **Razorpay AI Builder Internship 2026**.

---

## 📄 License

This project was created as part of the Razorpay AI Builder Internship 2026 project submission.
