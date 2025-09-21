interface Transaction {
  _id: string;
  type: 'transfer_in' | 'transfer_out' | 'deposit' | 'withdrawal';
  amount: number;
  recipientEmail?: string;
  senderEmail?: string;
  timestamp: string;
  status: string;
}

class TransactionStore {
  private transactions: Transaction[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Initialize with mock data
    this.transactions = [
      {
        _id: '1',
        type: 'transfer_in',
        amount: 500.00,
        senderEmail: 'amit@client.com',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed'
      },
      {
        _id: '2',
        type: 'transfer_out',
        amount: 250.00,
        recipientEmail: 'amit@client.com',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed'
      },
      {
        _id: '3',
        type: 'deposit',
        amount: 1000.00,
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        status: 'completed'
      },
      {
        _id: '4',
        type: 'withdrawal',
        amount: 150.00,
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        status: 'completed'
      }
    ];
  }

  addTransaction(transaction: Omit<Transaction, '_id'>) {
    const newTransaction: Transaction = {
      ...transaction,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    this.transactions.unshift(newTransaction);
    this.notifyListeners();
    return newTransaction;
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const transactionStore = new TransactionStore();