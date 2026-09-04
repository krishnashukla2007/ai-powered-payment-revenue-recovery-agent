export function ConfidenceMeter({
  confidence = 0,
  showLabel = true,
  className = '',
}) {
  // Normalize confidence (can be 0-1 decimal or 0-100 percentage)
  const numeric = Number(confidence) || 0;
  const percent = numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric);

  let fillColor = 'var(--danger-solid)';
  if (percent >= 85) {
    fillColor = 'var(--success-solid)';
  } else if (percent >= 60) {
    fillColor = 'var(--warning-solid)';
  }

  return (
    <div className={`confidence-meter ${className}`}>
      <div className="confidence-bar-track">
        <div
          className="confidence-bar-fill"
          style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: fillColor }}
        />
      </div>
      {showLabel && (
        <span
          className="font-mono text-xs font-semibold"
          style={{ color: fillColor, minWidth: '38px', textAlign: 'right' }}
        >
          {percent}%
        </span>
      )}
    </div>
  );
}
