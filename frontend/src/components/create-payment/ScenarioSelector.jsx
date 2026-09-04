import { CheckCircle2, XCircle, AlertTriangle, GitCompare } from 'lucide-react';

const SCENARIOS = [
  {
    key: 'PENDING_SUCCESS',
    title: 'Pending → Success',
    shortDescription: 'Payment initially remains pending and later succeeds.',
    detail: 'External provider updates status to SUCCESS within 10s. AI agent recommends RECOVER.',
    icon: CheckCircle2,
    accentColor: 'var(--success-solid)',
    bgColor: 'var(--success-bg)',
  },
  {
    key: 'PENDING_FAILED',
    title: 'Pending → Failed',
    shortDescription: 'Payment initially remains pending and later fails.',
    detail: 'External provider marks transaction as FAILED. AI agent triggers REFUND workflow.',
    icon: XCircle,
    accentColor: 'var(--info-solid)',
    bgColor: 'var(--info-bg)',
  },
  {
    key: 'PENDING_FOREVER',
    title: 'Pending Timeout (Escalation)',
    shortDescription: 'Payment remains pending and is eventually escalated for human review.',
    detail: 'No provider response received. After 3 recheck attempts (15s), system escalates to operator.',
    icon: AlertTriangle,
    accentColor: 'var(--warning-solid)',
    bgColor: 'var(--warning-bg)',
  },
  {
    key: 'STATUS_CONFLICT',
    title: 'Status Conflict',
    shortDescription: 'Payment providers return conflicting terminal statuses.',
    detail: 'Gateway returns FAILED while bank network returns SUCCESS. Agent escalates for fraud review.',
    icon: GitCompare,
    accentColor: 'var(--purple-solid)',
    bgColor: 'var(--purple-bg)',
  },
];

export function ScenarioSelector({ selectedScenario, onChange, disabled = false }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}
    >
      {SCENARIOS.map((sc) => {
        const isSelected = selectedScenario === sc.key;
        const IconComponent = sc.icon;

        return (
          <div
            key={sc.key}
            role="radio"
            aria-checked={isSelected}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && onChange(sc.key)}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                onChange(sc.key);
              }
            }}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${
                isSelected ? sc.accentColor : 'var(--border-subtle)'
              }`,
              backgroundColor: isSelected ? sc.bgColor : 'var(--bg-card)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
              opacity: disabled ? 0.7 : 1,
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--bg-card-subtle)' : 'var(--slate-100)',
                    color: sc.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={18} />
                </div>

                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${
                      isSelected ? sc.accentColor : 'var(--slate-300)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: sc.accentColor,
                      }}
                    />
                  )}
                </div>
              </div>

              <h4
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--slate-900)',
                  marginBottom: '0.25rem',
                }}
              >
                {sc.title}
              </h4>

              <p
                style={{
                  fontSize: '0.8125rem',
                  color: isSelected ? 'var(--slate-800)' : 'var(--slate-600)',
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {sc.shortDescription}
              </p>
            </div>

            <div
              style={{
                marginTop: '0.875rem',
                paddingTop: '0.625rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.6875rem',
                color: 'var(--slate-500)',
              }}
            >
              {sc.detail}
            </div>
          </div>
        );
      })}
    </div>
  );
}
