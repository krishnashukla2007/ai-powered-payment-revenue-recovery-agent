import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export function usePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    paymentService
      .getPayments()
      .then((data) => {
        if (!ignore) {
          setPayments(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Failed to load payments list');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPayments();
      setPayments(data);
    } catch (err) {
      setError(err.message || 'Failed to load payments list');
    } finally {
      setLoading(false);
    }
  }, []);

  return { payments, loading, error, refresh };
}
