import { Check } from 'lucide-react';
import { computeJourneySteps } from '../../utils/auditHelpers';

export function TimelineProgress({ events = [], payment = null }) {
  const steps = computeJourneySteps(events, payment);

  // Calculate percentage of progress completed
  const completedCount = steps.filter((s) => s.completed).length;
  const progressPct = ((completedCount - 1) / (steps.length - 1)) * 100;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <h4 className="text-sm font-semibold" style={{ color: 'var(--slate-800)' }}>
          Recovery Journey Progress
        </h4>
        <p className="text-xs text-muted">
          Lifecycle steps traversed by the AI recovery agent and simulated network events
        </p>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '0.25rem' }}>
      <div className="journey-bar">
        {/* Progress track line */}
        <div className="journey-connector">
          <div
            className="journey-connector-progress"
            style={{ width: `${Math.max(0, Math.min(progressPct, 100))}%` }}
          />
        </div>

        {/* Steps circles */}
        {steps.map((step, idx) => {
          const isCompleted = step.completed;
          const isActive = step.active;

          return (
            <div
              key={step.id}
              className={`journey-step ${isCompleted ? 'completed' : ''} ${
                isActive ? 'active' : ''
              }`}
            >
              <div className="journey-step-circle">
                {isCompleted ? <Check size={16} /> : idx + 1}
              </div>
              <div className="journey-step-label">{step.label}</div>
              <div className="journey-step-sublabel">{step.sublabel}</div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
