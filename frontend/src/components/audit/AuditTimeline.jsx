import { TimelineProgress } from './TimelineProgress';
import { ResolutionSummary } from './ResolutionSummary';
import { AuditEvent } from './AuditEvent';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { Clock } from 'lucide-react';

export function AuditTimeline({ events = [], payment = null, loading = false }) {
  if (loading) {
    return <LoadingSkeleton type="timeline" count={4} />;
  }

  // Find latest agent decision event if present
  const latestDecisionEvent = events
    .slice()
    .reverse()
    .find((e) => e.eventType === 'AGENT_ANALYSIS' || e.details?.action);

  const latestDecision = latestDecisionEvent?.details || null;

  return (
    <div>
      {/* Step Progress visualization */}
      <TimelineProgress events={events} payment={payment} />

      {/* Resolution Summary Banner */}
      <ResolutionSummary payment={payment} latestDecision={latestDecision} />

      {/* Timeline Section */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
        }}
      >
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.0625rem' }}>
            Audit Trail & Event Log
          </h3>
          <p className="card-subtitle">
            Chronological log of agent inferences, simulator state transitions, and recheck cycles
          </p>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="No audit events recorded yet"
            description="Audit events will appear as this transaction moves through the recovery lifecycle."
            icon={Clock}
          />
        ) : (
          <div className="audit-timeline-flow">
            {events.map((event, idx) => (
              <AuditEvent key={event._id || idx} event={event} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
