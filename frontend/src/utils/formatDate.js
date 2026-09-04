/**
 * Formats an ISO date string into readable date and time
 * @param {string|Date} dateValue
 * @param {boolean} includeTime
 * @returns {string}
 */
export function formatDate(dateValue, includeTime = true) {
  if (!dateValue) return '—';
  
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return 'Invalid date';

  try {
    if (!includeTime) {
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    }

    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/**
 * Returns a relative time string (e.g. "5 mins ago", "Just now")
 * @param {string|Date} dateValue
 * @returns {string}
 */
export function formatRelativeTime(dateValue) {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '—';

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 15) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateValue, false);
}

/**
 * Returns time of day greeting based on local client hour
 * @returns {string}
 */
export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
