/**
 * Reusable fintech badge component with semantic variants
 */
export function Badge({
  children,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral'
  dot = true,
  className = '',
}) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
