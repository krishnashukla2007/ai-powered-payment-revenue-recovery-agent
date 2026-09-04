import { Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'There are no records matching your current criteria.',
  icon: Icon = Inbox,
  actionLabel = null,
  onAction = null,
  actionButton = null,
  className = '',
}) {
  return (
    <div className={`state-container ${className}`}>
      <div className="state-icon-box neutral">
        <Icon size={24} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-description">{description}</p>
      {actionButton ? (
        actionButton
      ) : actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
