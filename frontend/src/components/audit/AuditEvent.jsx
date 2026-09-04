import { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import { parseAuditEvent } from '../../utils/auditHelpers';
import { formatDate } from '../../utils/formatDate';
import { ConfidenceMeter } from '../ui/ConfidenceMeter';
import { Badge } from '../ui/Badge';

export function AuditEvent({ event }) {
  const [showTechnical, setShowTechnical] = useState(false);
  const parsed = parseAuditEvent(event);

  // Determine icon based on category/eventType
  const getIcon = () => {
    switch (parsed.category) {
      case 'ai':
        return <BrainCircuit size={18} />;
      case 'simulator':
        return <Activity size={18} />;
      case 'success':
        return <CheckCircle2 size={18} />;
      case 'warning':
        return <RotateCcw size={18} />;
      case 'danger':
        return <AlertTriangle size={18} />;
      default:
        return <Cpu size={18} />;
    }
  };

  // Actor badge styling
  const getActorBadgeVariant = (actor) => {
    switch (actor) {
      case 'AI_AGENT':
        return 'purple';
      case 'SIMULATOR':
        return 'info';
      case 'HUMAN_REVIEW':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const hasDetails = parsed.details && Object.keys(parsed.details).length > 0;

  return (
    <div className="timeline-item">
      {/* Visual Timeline Node */}
      <div className={`timeline-node ${parsed.category}`}>
        {getIcon()}
      </div>

      {/* Timeline Card */}
      <div className="timeline-content-card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.625rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Badge variant={getActorBadgeVariant(parsed.actor)}>
              {parsed.actor.replace(/_/g, ' ')}
            </Badge>
            <span className="text-xs font-mono text-muted">
              {parsed.badgeLabel}
            </span>
          </div>

          <time
            className="text-xs text-muted"
            dateTime={parsed.createdAt}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <Clock size={12} />
            {formatDate(parsed.createdAt)}
          </time>
        </div>

        {/* Title & Description */}
        <h4
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--slate-900)',
            marginBottom: '0.375rem',
          }}
        >
          {parsed.title}
        </h4>

        <p
          className="text-sm"
          style={{ color: 'var(--slate-600)', marginBottom: '0.75rem', lineHeight: 1.5 }}
        >
          {parsed.description}
        </p>

        {/* Relevant Decision Badges / Metadata */}
        {(parsed.action || parsed.confidence !== null || parsed.recheck !== undefined || parsed.highlight) && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)',
              marginBottom: '0.75rem',
            }}
          >
            {parsed.action && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span className="text-xs font-semibold text-muted">Action:</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.125rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor:
                      parsed.action === 'RECOVER'
                        ? 'var(--success-bg)'
                        : parsed.action === 'WAIT'
                        ? 'var(--warning-bg)'
                        : parsed.action === 'REFUND'
                        ? 'var(--info-bg)'
                        : 'var(--danger-bg)',
                    color:
                      parsed.action === 'RECOVER'
                        ? 'var(--success-text)'
                        : parsed.action === 'WAIT'
                        ? 'var(--warning-text)'
                        : parsed.action === 'REFUND'
                        ? 'var(--info-text)'
                        : 'var(--danger-text)',
                  }}
                >
                  {parsed.action}
                </span>
              </div>
            )}

            {parsed.confidence !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '130px' }}>
                <span className="text-xs font-semibold text-muted">Confidence:</span>
                <ConfidenceMeter confidence={parsed.confidence} />
              </div>
            )}

            {parsed.recheck !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span className="text-xs font-semibold text-muted">Recheck:</span>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--slate-800)' }}>
                  {parsed.recheck + 1} of 3
                </span>
              </div>
            )}

            {parsed.highlight && (
              <div className="text-xs text-muted font-medium">
                {parsed.highlight}
              </div>
            )}
          </div>
        )}

        {/* Expandable Technical Details */}
        {hasDetails && (
          <div>
            <button
              type="button"
              onClick={() => setShowTechnical(!showTechnical)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--slate-500)',
                padding: '0.25rem 0',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--slate-500)')}
            >
              {showTechnical ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>{showTechnical ? 'Hide technical details' : 'View technical details'}</span>
            </button>

            {showTechnical && (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--slate-900)',
                  color: '#e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  overflowX: 'auto',
                }}
              >
                <div style={{ color: 'var(--slate-400)', marginBottom: '0.375rem' }}>
                  // Raw Audit Event Payload ({event.eventType})
                </div>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(parsed.raw, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
