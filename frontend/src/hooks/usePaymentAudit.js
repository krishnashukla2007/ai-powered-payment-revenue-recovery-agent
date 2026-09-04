import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export function usePaymentAudit(paymentId) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId) return;

    let ignore = false;
    paymentService
      .getPaymentAudit(paymentId)
      .then((data) => {
        if (!ignore) {
          setEvents(data.events || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || `Failed to load audit history for ${paymentId}`);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [paymentId]);

  const refresh = useCallback(async () => {
    if (!paymentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPaymentAudit(paymentId);
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || `Failed to load audit history for ${paymentId}`);
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  return { events, loading, error, refresh };
}
