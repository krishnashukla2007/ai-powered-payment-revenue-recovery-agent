export function StatsCard({
  label,
  value,
  supportingText,
  icon: Icon,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  badge = null,
}) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className={`metric-icon-wrap ${variant}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div className="metric-value">{value}</div>
        {supportingText && (
          <div className="metric-footer">
            <span>{supportingText}</span>
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}
