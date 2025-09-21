interface Account {
  checking: number;
  savings: number;
  credit: number;
}

interface Transaction {
  id: string;
  ts: number;
  when: string;
  type: 'transfer_out' | 'transfer_in' | 'deposit' | 'withdrawal';
  to?: string;
  from?: string;
  amount: number;
  amount_fmt: string;
  balance_after: number;
  balance_after_fmt: string;
}

interface User {
  accounts: Account;
  tx: Transaction[];
}

class BankingStore {
  private users: Map<string, User> = new Map();
  private readonly STARTING_BALANCE = 100000.00;
  private listeners: (() => void)[] = [];

  constructor() {
    this.initializeDemoUsers();
  }

  private initializeDemoUsers() {
    // Initialize demo users
    this.users.set('client@client.com', {
      accounts: { checking: 15420.50, savings: 8750.25, credit: -2340.75 },
      tx: [
        {
          id: 'tx-1-in',
          ts: Date.now() - 86400000,
          when: new Date(Date.now() - 86400000).toISOString(),
          type: 'transfer_in',
          from: 'amit@client.com',
          amount: 500.00,
          amount_fmt: '+₪500.00',
          balance_after: 21830.00,
          balance_after_fmt: '₪21,830.00'
        }
      ]
    });

    this.users.set('amit@client.com', {
      accounts: { checking: 25000.00, savings: 5000.00, credit: 0.00 },
      tx: []
    });

    this.users.set('admin@bank.com', {
      accounts: { checking: 1000000.00, savings: 500000.00, credit: 0.00 },
      tx: []
    });
  }

  private formatCurrency(amount: number): string {
    return `₪${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private getCurrentUser(): string | null {
    return localStorage.getItem('currentUser') || 'client@client.com';
  }

  private getOrInitUser(email: string): User {
    if (!this.users.has(email)) {
      this.users.set(email, {
        accounts: { checking: this.STARTING_BALANCE, savings: 0.0, credit: 0.0 },
        tx: []
      });
    }
    return this.users.get(email)!;
  }

  private getTotalBalance(accounts: Account): number {
    return accounts.checking + accounts.savings + accounts.credit;
  }

  getUserProfile(): any {
    const email = this.getCurrentUser();
    if (!email) return null;

    const user = this.getOrInitUser(email);
    const total = this.getTotalBalance(user.accounts);

    return {
      me: email,
      username: email.split('@')[0],
      accounts: user.accounts,
      total_balance: total,
      total_formatted: this.formatCurrency(total),
      transactions: user.tx
    };
  }

  getAccountBalances(): any {
    const email = this.getCurrentUser();
    if (!email) return null;

    const user = this.getOrInitUser(email);
    return { accounts: user.accounts };
  }

  getTransactionHistory(): any {
    const email = this.getCurrentUser();
    if (!email) return null;

    const user = this.getOrInitUser(email);
    return { 
      transactions: user.tx.map(tx => ({
        _id: tx.id,
        type: tx.type,
        amount: Math.abs(tx.amount),
        recipientEmail: tx.to,
        senderEmail: tx.from,
        timestamp: tx.when,
        status: 'completed'
      }))
    };
  }

  transferMoney(recipientEmail: string, amount: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const senderEmail = this.getCurrentUser();
      if (!senderEmail) {
        reject(new Error('Not authenticated'));
        return;
      }

      if (!recipientEmail || recipientEmail.trim() === '') {
        reject(new Error('Recipient email is required'));
        return;
      }

      if (amount <= 0) {
        reject(new Error('Amount must be positive'));
        return;
      }

      if (recipientEmail === senderEmail) {
        reject(new Error('Cannot transfer to yourself'));
        return;
      }

      const senderUser = this.getOrInitUser(senderEmail);
      const recipientUser = this.getOrInitUser(recipientEmail);

      // Check sufficient funds
      if (senderUser.accounts.checking < amount) {
        reject(new Error('Insufficient funds'));
        return;
      }

      // Update balances
      senderUser.accounts.checking -= amount;
      recipientUser.accounts.checking += amount;

      const ts = Date.now();
      const iso = new Date().toISOString();

      // Add transaction for sender (negative)
      const senderTx: Transaction = {
        id: `tx-${ts}-out`,
        ts,
        when: iso,
        type: 'transfer_out',
        to: recipientEmail,
        amount: -amount,
        amount_fmt: `-${this.formatCurrency(amount)}`,
        balance_after: this.getTotalBalance(senderUser.accounts),
        balance_after_fmt: this.formatCurrency(this.getTotalBalance(senderUser.accounts))
      };

      // Add transaction for recipient (positive)
      const recipientTx: Transaction = {
        id: `tx-${ts}-in`,
        ts,
        when: iso,
        type: 'transfer_in',
        from: senderEmail,
        amount: amount,
        amount_fmt: `+${this.formatCurrency(amount)}`,
        balance_after: this.getTotalBalance(recipientUser.accounts),
        balance_after_fmt: this.formatCurrency(this.getTotalBalance(recipientUser.accounts))
      };

      senderUser.tx.unshift(senderTx);
      recipientUser.tx.unshift(recipientTx);

      this.notifyListeners();

      resolve({
        success: true,
        message: 'Transfer completed successfully',
        transaction: {
          _id: senderTx.id,
          type: 'transfer_out',
          amount: amount,
          recipientEmail: recipientEmail,
          timestamp: iso,
          status: 'completed'
        }
      });
    });
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

  // Method to switch users (for demo purposes)
  switchUser(email: string) {
    localStorage.setItem('currentUser', email);
    this.notifyListeners();
  }

  getAllUsers(): string[] {
    return Array.from(this.users.keys());
  }
}

export const bankingStore = new BankingStore();