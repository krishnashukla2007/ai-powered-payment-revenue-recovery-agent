import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1rem',
        textAlign: 'center',
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: '5rem',
          fontWeight: 800,
          color: 'var(--slate-300)',
          lineHeight: 1,
          marginBottom: '1rem',
        }}
      >
        404
      </span>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
        Page Not Found
      </h2>

      <p className="text-sm text-muted" style={{ maxWidth: '420px', marginBottom: '2rem' }}>
        The payment recovery case or page you requested could not be located in the operational ledger.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
          Recovery Command Center
        </Button>
      </div>
    </div>
  );
}
