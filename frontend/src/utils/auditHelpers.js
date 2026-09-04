/**
 * Transforms raw backend AuditEvent records into rich, user-friendly timeline cards
 */

export function parseAuditEvent(event) {
  const details = event.details || {};
  const eventType = event.eventType;
  const actor = event.actor || 'SYSTEM';

  let title;
  let description;
  let category;
  let badgeLabel;
  const action = details.action;
  const confidence = typeof details.confidence === 'number' ? details.confidence : null;
  const recheck = details.recheckCount ?? details.recheckNumber;
  let highlight = null;

  switch (eventType) {
    case 'PAYMENT_PROCESSING_STARTED':
      title = 'Payment Entered Recovery Engine';
      description = event.message || 'Payment transaction successfully registered in the AI recovery workflow.';
      category = 'system';
      badgeLabel = 'Initialized';
      break;

    case 'AGENT_ANALYSIS':
      category = 'ai';
      badgeLabel = 'AI Decision';
      if (action === 'WAIT') {
        title = 'AI Decision: Waiting for Payment Confirmation';
        description = event.message || 'Payment is still being processed by the payment systems. No immediate action required.';
      } else if (action === 'RECOVER') {
        title = 'AI Decision: Recovery Confirmed';
        description = event.message || 'External payment provider confirmed success. Recommended action is immediate recovery.';
        category = 'success';
      } else if (action === 'REFUND') {
        title = 'AI Decision: Refund Recommended';
        description = event.message || 'External payment provider confirmed failure. Customer refund initiated.';
        category = 'warning';
      } else if (action === 'ESCALATE') {
        title = 'AI Decision: Human Escalation Required';
        description = event.message || 'Ambiguous or conflicting terminal statuses detected. Case routed to human review.';
        category = 'danger';
      } else {
        title = `AI Decision: ${action || 'Analysis Completed'}`;
        description = event.message || 'AI agent completed transaction state analysis.';
      }
      break;

    case 'WAITING_FOR_STATUS_UPDATE':
      title = 'Waiting for Payment Update';
      description = event.message || 'The system is waiting before querying payment provider APIs again.';
      category = 'system';
      badgeLabel = 'Scheduled Wait';
      highlight = details.waitTimeMs ? `Wait interval: ${details.waitTimeMs / 1000}s` : 'Next recheck: 5s';
      break;

    case 'STATUS_RECHECK':
      title = 'Status Recheck';
      description = event.message || 'Checking the latest payment settlement status from connected payment systems.';
      category = 'system';
      badgeLabel = 'Status Query';
      break;

    case 'SIMULATED_STATUS_UPDATE':
      title = 'Payment Status Updated';
      category = 'simulator';
      badgeLabel = 'Provider Update';
      if (details.updates) {
        const updateKeys = Object.entries(details.updates)
          .map(([k, v]) => `${k} → ${v}`)
          .join(', ');
        description = `External payment system state updated: ${updateKeys}`;
      } else {
        description = event.message || 'Simulation provider updated transaction status.';
      }
      break;

    case 'PAYMENT_RECOVERED':
      title = 'Payment Recovered Successfully';
      description = event.message || 'The payment value has been successfully reconciled and marked recovered.';
      category = 'success';
      badgeLabel = 'Recovered';
      break;

    case 'PAYMENT_REFUND_INITIATED':
      title = 'Customer Refund Initiated';
      description = event.message || 'The customer refund transaction was safely triggered.';
      category = 'warning';
      badgeLabel = 'Refunded';
      break;

    case 'ESCALATED_TO_HUMAN':
      title = 'Escalated to Human Review';
      description = event.message || 'Maximum automated recheck attempts reached without terminal confirmation.';
      category = 'danger';
      badgeLabel = 'Escalated';
      break;

    default:
      title = eventType.replace(/_/g, ' ');
      description = event.message || 'Operational event logged.';
      category = 'system';
      badgeLabel = actor;
  }

  return {
    raw: event,
    title,
    description,
    category,
    badgeLabel,
    actor,
    action,
    confidence,
    recheck,
    highlight,
    createdAt: event.createdAt,
    details,
  };
}

/**
 * Computes step-by-step progress along the standard recovery journey
 * @param {Array} events
 * @param {object} payment
 * @returns {Array} steps with status
 */
export function computeJourneySteps(events = [], payment = null) {
  const eventTypes = events.map(e => e.eventType);
  const resolutionStatus = payment?.resolutionStatus || 'UNRESOLVED';

  const isStep1Complete = events.length > 0 || !!payment;
  const isStep2Complete = eventTypes.includes('AGENT_ANALYSIS');
  const isStep3Complete = eventTypes.some(t => t === 'WAITING_FOR_STATUS_UPDATE' || t === 'STATUS_RECHECK') || isStep2Complete;
  const isStep4Complete = eventTypes.some(t => ['PAYMENT_RECOVERED', 'PAYMENT_REFUND_INITIATED', 'ESCALATED_TO_HUMAN'].includes(t)) || ['RECOVERED', 'REFUNDED', 'ESCALATED'].includes(resolutionStatus);
  const isStep5Complete = ['RECOVERED', 'REFUNDED', 'ESCALATED'].includes(resolutionStatus);

  return [
    {
      id: 'created',
      label: 'Payment Created',
      sublabel: 'Ingested into engine',
      completed: isStep1Complete,
      active: isStep1Complete && !isStep2Complete,
    },
    {
      id: 'ai-analysis',
      label: 'AI Analysis',
      sublabel: 'Gemini reasoning',
      completed: isStep2Complete,
      active: isStep2Complete && !isStep3Complete && !isStep4Complete,
    },
    {
      id: 'monitoring',
      label: 'Status Monitoring',
      sublabel: 'Automated rechecks',
      completed: isStep3Complete,
      active: isStep3Complete && !isStep4Complete,
    },
    {
      id: 'decision',
      label: 'Final Decision',
      sublabel: 'Safest action selected',
      completed: isStep4Complete,
      active: isStep4Complete && !isStep5Complete,
    },
    {
      id: 'resolution',
      label: 'Resolution',
      sublabel: resolutionStatus === 'UNRESOLVED' ? 'In progress' : resolutionStatus,
      completed: isStep5Complete,
      active: false,
      status: resolutionStatus,
    },
  ];
}
