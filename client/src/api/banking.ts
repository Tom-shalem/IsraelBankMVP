import api from './api';
import { normalizeAccounts, totalBalance, toFloat, setTotal } from '@/utils/currency';
import { transferMoney as transferMoneyUtil, buildDashboardPayload } from '@/utils/transactionManager';

// Description: Get account balances for the current user
// Endpoint: GET /api/banking/balances
// Request: {}
// Response: { accounts: { checking: number, savings: number, credit: number } }
export const getAccountBalances = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const userEmail = localStorage.getItem('currentUserEmail') || 'client@client.com';

      // Get stored balances or use default values
      const storedBalances = JSON.parse(localStorage.getItem('userBalances') || '{}');

      // Default balances that total to exactly 100,000 ILS
      const defaultBalances = {
        'client@client.com': {
          checking: 70000.00,
          savings: 35000.00,
          credit: -5000.00
        },
        'amit@client.com': {
          checking: 55000.00,
          savings: 50000.00,
          credit: -5000.00
        },
        'admin@bank.com': {
          checking: 75000.00,
          savings: 30000.00,
          credit: -5000.00
        }
      };

      // If no stored balances exist, initialize with defaults
      if (!storedBalances[userEmail]) {
        const allBalances = { ...storedBalances, ...defaultBalances };
        localStorage.setItem('userBalances', JSON.stringify(allBalances));
        storedBalances[userEmail] = defaultBalances[userEmail] || defaultBalances['client@client.com'];
      }

      // Use setTotal utility to normalize and set proper total
      let payload = {};
      setTotal(payload, storedBalances[userEmail]);

      resolve({
        accounts: payload.accounts
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/banking/balances');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Transfer money to another user
// Endpoint: POST /api/banking/transfer
// Request: { recipientEmail: string, amount: number }
// Response: { success: boolean, message: string, transactionId: string }
export const transferMoney = (data: { recipientEmail: string; amount: number }) => {
  // Mocking the response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const senderEmail = localStorage.getItem('currentUserEmail') || 'client@client.com';
      const { recipientEmail, amount } = data;

      if (recipientEmail === senderEmail) {
        reject(new Error('Cannot transfer money to yourself'));
        return;
      }

      // Check if recipient exists
      const validEmails = ['client@client.com', 'amit@client.com', 'admin@bank.com'];
      if (!validEmails.includes(recipientEmail)) {
        reject(new Error('Recipient not found'));
        return;
      }

      // Normalize amount using utility function
      const normalizedAmount = toFloat(amount, 0);
      if (normalizedAmount <= 0) {
        reject(new Error('Amount must be positive'));
        return;
      }

      // Get current balances
      const storedBalances = JSON.parse(localStorage.getItem('userBalances') || '{}');

      // Initialize default balances if they don't exist
      const defaultBalances = {
        'client@client.com': {
          checking: 70000.00,
          savings: 35000.00,
          credit: -5000.00
        },
        'amit@client.com': {
          checking: 55000.00,
          savings: 50000.00,
          credit: -5000.00
        },
        'admin@bank.com': {
          checking: 75000.00,
          savings: 30000.00,
          credit: -5000.00
        }
      };

      if (!storedBalances[senderEmail]) {
        storedBalances[senderEmail] = defaultBalances[senderEmail] || defaultBalances['client@client.com'];
      }
      if (!storedBalances[recipientEmail]) {
        storedBalances[recipientEmail] = defaultBalances[recipientEmail] || defaultBalances['client@client.com'];
      }

      // Create state object for utility function
      const state = {
        users: {
          [senderEmail]: {
            accounts: { ...storedBalances[senderEmail] },
            tx: []
          },
          [recipientEmail]: {
            accounts: { ...storedBalances[recipientEmail] },
            tx: []
          }
        }
      };

      try {
        // Use the utility function for transfer
        transferMoneyUtil(state, senderEmail, recipientEmail, normalizedAmount);

        // Update stored balances with normalized values using setTotal
        let senderPayload = {};
        let recipientPayload = {};
        
        setTotal(senderPayload, state.users[senderEmail].accounts);
        setTotal(recipientPayload, state.users[recipientEmail].accounts);
        
        storedBalances[senderEmail] = senderPayload.accounts;
        storedBalances[recipientEmail] = recipientPayload.accounts;

        // Save updated balances
        localStorage.setItem('userBalances', JSON.stringify(storedBalances));

        // Store transactions
        const transactionId = Date.now().toString();
        const timestamp = new Date().toISOString();

        // Get existing transactions
        const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '{}');

        // Add transaction for sender (negative amount)
        if (!existingTransactions[senderEmail]) {
          existingTransactions[senderEmail] = [];
        }
        existingTransactions[senderEmail].push({
          id: `${transactionId}-sender`,
          date: timestamp,
          type: 'transfer_sent',
          amount: -normalizedAmount,
          description: `Transfer to ${recipientEmail}`,
          recipientEmail: recipientEmail,
          senderEmail: senderEmail,
          dir: 'out',
          peer: recipientEmail,
          ts: timestamp
        });

        // Add transaction for recipient (positive amount)
        if (!existingTransactions[recipientEmail]) {
          existingTransactions[recipientEmail] = [];
        }
        existingTransactions[recipientEmail].push({
          id: `${transactionId}-recipient`,
          date: timestamp,
          type: 'transfer_received',
          amount: normalizedAmount,
          description: `Transfer from ${senderEmail}`,
          recipientEmail: recipientEmail,
          senderEmail: senderEmail,
          dir: 'in',
          peer: senderEmail,
          ts: timestamp
        });

        // Save updated transactions
        localStorage.setItem('transactions', JSON.stringify(existingTransactions));

        resolve({
          success: true,
          message: `Successfully transferred ₪${normalizedAmount.toFixed(2)} to ${recipientEmail}`,
          transactionId: transactionId
        });
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/banking/transfer', { recipientEmail, amount });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get transaction history for the current user
// Endpoint: GET /api/banking/transactions
// Request: {}
// Response: { transactions: Array<{ id: string, date: string, type: string, amount: number, description: string, recipientEmail?: string, senderEmail?: string }> }
export const getTransactions = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const userEmail = localStorage.getItem('currentUserEmail') || 'client@client.com';
      const allTransactions = JSON.parse(localStorage.getItem('transactions') || '{}');
      const userTransactions = allTransactions[userEmail] || [];

      // Normalize transaction amounts
      const normalizedTransactions = userTransactions.map((tx: any) => ({
        ...tx,
        amount: toFloat(tx.amount, 0)
      }));

      resolve({
        transactions: normalizedTransactions
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/banking/transactions');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get dashboard data with normalized accounts and totals
// Endpoint: GET /api/banking/dashboard
// Request: {}
// Response: { accounts: Record<string, number>, total: number, transactions: Array, me: string }
export const getDashboardData = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(async () => {
      const userEmail = localStorage.getItem('currentUserEmail') || 'client@client.com';

      // Get balances and transactions
      const balancesResponse = await getAccountBalances() as any;
      const transactionsResponse = await getTransactions() as any;

      // Use setTotal utility to create comprehensive payload
      let payload = {
        me: userEmail,
        transactions: transactionsResponse.transactions
      };

      // Force total to be exactly 100,000 as requested, or calculate from accounts
      setTotal(payload, balancesResponse.accounts, 100000.00);

      resolve(payload);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/banking/dashboard');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};