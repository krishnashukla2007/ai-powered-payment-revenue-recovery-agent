import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Unable to load payment data',
  message = "We couldn't connect to the recovery service. Please check backend connectivity.",
  onRetry = null,
  technical = null,
  className = '',
}) {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className={`state-container ${className}`}>
      <div className="state-icon-box danger">
        <AlertTriangle size={24} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-description">{message}</p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {onRetry && (
          <Button variant="secondary" icon={RefreshCw} onClick={onRetry}>
            Try Again
          </Button>
        )}
        {technical && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTechnical(!showTechnical)}
          >
            {showTechnical ? 'Hide Details' : 'Details'}
          </Button>
        )}
      </div>

      {showTechnical && technical && (
        <pre
          style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--slate-100)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            maxWidth: '540px',
            textAlign: 'left',
            overflowX: 'auto',
            color: 'var(--slate-700)',
          }}
        >
          {typeof technical === 'object' ? JSON.stringify(technical, null, 2) : String(technical)}
        </pre>
      )}
    </div>
  );
}
