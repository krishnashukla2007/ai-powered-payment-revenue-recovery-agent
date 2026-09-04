/**
 * Status color and label configurations for payment and recovery statuses
 */

export const STATUS_CONFIG = {
  // Resolution statuses
  RECOVERED: {
    label: 'Recovered',
    variant: 'success',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    description: 'Payment was verified and recovered successfully.',
  },
  REFUNDED: {
    label: 'Refunded',
    variant: 'info',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    description: 'Transaction failed and refund has been initiated.',
  },
  ESCALATED: {
    label: 'Escalated',
    variant: 'danger',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    description: 'Requires manual human operator review.',
  },
  UNRESOLVED: {
    label: 'Unresolved',
    variant: 'neutral',
    color: '#64748b',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
    description: 'Recovery workflow is actively monitoring.',
  },

  // Gateway and External statuses
  SUCCESS: {
    label: 'Success',
    variant: 'success',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  PENDING: {
    label: 'Pending',
    variant: 'warning',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  FAILED: {
    label: 'Failed',
    variant: 'danger',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  DEBITED: {
    label: 'Debited',
    variant: 'info',
    color: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  NOT_DEBITED: {
    label: 'Not Debited',
    variant: 'neutral',
    color: '#64748b',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  UNKNOWN: {
    label: 'Unknown',
    variant: 'neutral',
    color: '#94a3b8',
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },

  // Agent Actions
  RECOVER: {
    label: 'Recover',
    variant: 'success',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  REFUND: {
    label: 'Refund',
    variant: 'info',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  WAIT: {
    label: 'Wait & Recheck',
    variant: 'warning',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  ESCALATE: {
    label: 'Escalate to Human',
    variant: 'danger',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  INVESTIGATE: {
    label: 'Investigate',
    variant: 'purple',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
  },
};

/**
 * Get status details or fallback safely
 * @param {string} statusKey
 * @returns {object}
 */
export function getStatusDetails(statusKey) {
  if (!statusKey) {
    return STATUS_CONFIG.UNKNOWN;
  }
  const normalized = String(statusKey).toUpperCase().trim();
  return STATUS_CONFIG[normalized] || {
    label: normalized.replace(/_/g, ' '),
    variant: 'neutral',
    color: '#64748b',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
  };
}

/**
 * Get friendly scenario label and description
 * @param {string} scenarioKey
 * @returns {{ title: string, description: string }}
 */
export function getScenarioDetails(scenarioKey) {
  const map = {
    PENDING_SUCCESS: {
      title: 'Pending → Success',
      shortTitle: 'Pending to Success',
      description: 'Payment initially remains pending and later succeeds with the external provider.',
    },
    PENDING_FAILED: {
      title: 'Pending → Failed',
      shortTitle: 'Pending to Failed',
      description: 'Payment initially remains pending and later fails, triggering customer refund workflow.',
    },
    PENDING_FOREVER: {
      title: 'Pending Forever (Escalation)',
      shortTitle: 'Pending Timeout',
      description: 'Payment remains pending and is escalated for manual human review after 3 recheck attempts.',
    },
    STATUS_CONFLICT: {
      title: 'Status Conflict',
      shortTitle: 'Gateway Conflict',
      description: 'Payment providers return conflicting terminal statuses requiring human operator resolution.',
    },
    NOT_DEBITED_FAILED: {
      title: 'Not Debited & Failed',
      shortTitle: 'Not Debited',
      description: 'Account was not charged and transaction failed at gateway.',
    },
  };

  return map[scenarioKey] || {
    title: scenarioKey ? scenarioKey.replace(/_/g, ' ') : 'Standard Simulation',
    shortTitle: scenarioKey ? scenarioKey.replace(/_/g, ' ') : 'Standard',
    description: 'Custom simulated recovery condition.',
  };
}
