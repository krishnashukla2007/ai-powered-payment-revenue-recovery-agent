import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export function usePayment(paymentId) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId) return;

    let ignore = false;
    paymentService
      .getPayment(paymentId)
      .then((data) => {
        if (!ignore) {
          setPayment(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || `Failed to load payment ${paymentId}`);
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
      const data = await paymentService.getPayment(paymentId);
      setPayment(data);
    } catch (err) {
      setError(err.message || `Failed to load payment ${paymentId}`);
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  return { payment, loading, error, refresh };
}
