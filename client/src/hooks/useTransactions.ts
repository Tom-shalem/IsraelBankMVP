import { useState, useEffect } from 'react';
import { transactionStore } from '@/utils/transactionStore';

interface Transaction {
  _id: string;
  type: 'transfer_in' | 'transfer_out' | 'deposit' | 'withdrawal';
  amount: number;
  recipientEmail?: string;
  senderEmail?: string;
  timestamp: string;
  status: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initial load
    setTransactions(transactionStore.getTransactions());

    // Subscribe to updates
    const unsubscribe = transactionStore.subscribe(() => {
      setTransactions(transactionStore.getTransactions());
    });

    return unsubscribe;
  }, []);

  const addTransaction = (transaction: Omit<Transaction, '_id'>) => {
    return transactionStore.addTransaction(transaction);
  };

  return {
    transactions,
    addTransaction
  };
}