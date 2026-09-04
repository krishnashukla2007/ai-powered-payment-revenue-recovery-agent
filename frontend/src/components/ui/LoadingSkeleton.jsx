export function LoadingSkeleton({
  type = 'card', // 'card' | 'table' | 'text' | 'stats' | 'timeline'
  count = 1,
  className = '',
}) {
  if (type === 'stats') {
    return (
      <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="metric-card" style={{ height: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="skeleton" style={{ width: '80px', height: '14px' }} />
              <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            </div>
            <div className="skeleton" style={{ width: '120px', height: '32px', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '140px', height: '14px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="card">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="skeleton" style={{ width: '180px', height: '20px' }} />
        </div>
        <div style={{ padding: '1.25rem' }}>
          {Array.from({ length: count || 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '1rem',
                padding: '0.875rem 0',
                borderBottom: i < (count || 5) - 1 ? '1px solid var(--slate-100)' : 'none',
              }}
            >
              <div className="skeleton" style={{ height: '16px', width: '80%' }} />
              <div className="skeleton" style={{ height: '16px', width: '60%' }} />
              <div className="skeleton" style={{ height: '16px', width: '70%' }} />
              <div className="skeleton" style={{ height: '16px', width: '50%' }} />
              <div className="skeleton" style={{ height: '16px', width: '65%' }} />
              <div className="skeleton" style={{ height: '16px', width: '40%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ width: '220px', height: '18px' }} />
              <div className="skeleton" style={{ width: '85%', height: '14px' }} />
              <div className="skeleton" style={{ width: '130px', height: '14px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`skeleton ${className}`} style={{ height: '100px', width: '100%' }} />
  );
}
