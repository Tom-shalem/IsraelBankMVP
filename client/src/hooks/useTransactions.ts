import { useState, useEffect } from 'react';
import { getTransactionHistory } from '@/api/banking';
import { bankingStore } from '@/utils/bankingStore';

export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactionHistory();
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    
    // Subscribe to banking store updates
    const unsubscribe = bankingStore.subscribe(() => {
      fetchTransactions();
    });

    return unsubscribe;
  }, []);

  const addTransaction = (transaction: any) => {
    // This is handled by the banking store now
    // Just trigger a refresh
    fetchTransactions();
  };

  return {
    transactions,
    loading,
    addTransaction,
    refetch: fetchTransactions
  };
}