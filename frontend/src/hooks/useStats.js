import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    paymentService
      .getStats()
      .then((data) => {
        if (!ignore) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Failed to load recovery statistics');
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
      const data = await paymentService.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load recovery statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, refresh };
}
