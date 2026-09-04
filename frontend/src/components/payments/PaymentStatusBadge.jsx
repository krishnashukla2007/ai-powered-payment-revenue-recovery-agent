import { Badge } from '../ui/Badge';
import { getStatusDetails } from '../../utils/statusHelpers';

export function PaymentStatusBadge({ status, className = '' }) {
  const details = getStatusDetails(status);

  return (
    <Badge variant={details.variant} className={className}>
      {details.label}
    </Badge>
  );
}
