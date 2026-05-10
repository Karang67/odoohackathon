// Formats a number as a currency string (e.g., $1,000.00)
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

// Formats a date string into a readable format (e.g., Oct 12, 2024)
export function formatDate(dateString, options = {}) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
}

// Calculates the number of days between two dates
export function calculateDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
