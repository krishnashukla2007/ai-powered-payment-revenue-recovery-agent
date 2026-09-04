/**
 * Formats a numeric value into currency format (defaults to INR ₹)
 * @param {number} amount
 * @param {string} currency
 * @param {boolean} compact
 * @returns {string}
 */
export function formatCurrency(amount = 0, currency = 'INR', compact = false) {
  const numericAmount = Number(amount) || 0;
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: compact ? 0 : 0,
      notation: compact && numericAmount >= 100000 ? 'compact' : 'standard',
    }).format(numericAmount);
  } catch {
    return `₹${numericAmount.toLocaleString('en-IN')}`;
  }
}

/**
 * Formats a decimal into a clean percentage string
 * @param {number} rate
 * @returns {string}
 */
export function formatPercent(rate = 0) {
  const numericRate = Number(rate) || 0;
  return `${numericRate.toFixed(1)}%`;
}
