// Small shared formatting helpers for the customer-facing app.
// (Split out from the old shared AdminHelpers.js so this app has
// no dependency on admin-only code.)

export function formatCurrency(val) {
  const n = Number(val || 0);
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function formatDate(dt) {
  if (!dt) return '-';
  return new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dt) {
  if (!dt) return '-';
  return new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
