import api from './api';

// Description: Get user account balances
// Endpoint: GET /api/banking/accounts
// Request: {}
// Response: { accounts: { checking: number, savings: number, credit: number } }
export const getAccountBalances = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accounts: {
          checking: 15420.50,
          savings: 8750.25,
          credit: -2340.75
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/banking/accounts');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Transfer money between accounts
// Endpoint: POST /api/banking/transfer
// Request: { recipientEmail: string, amount: number }
// Response: { success: boolean, message: string, newBalance: number }
export const transferMoney = async (data: { recipientEmail: string; amount: number }) => {
  // Mocking the response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.amount <= 0) {
        reject(new Error('Amount must be positive'));
        return;
      }
      if (data.amount > 15420.50) {
        reject(new Error('Insufficient funds'));
        return;
      }
      if (!data.recipientEmail.includes('@')) {
        reject(new Error('Invalid email address'));
        return;
      }
      resolve({
        success: true,
        message: 'Transfer completed successfully',
        newBalance: 15420.50 - data.amount
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/banking/transfer', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get transaction history
// Endpoint: GET /api/banking/transactions
// Request: {}
// Response: { transactions: Array<{ id: string, type: string, amount: number, recipient?: string, date: string }> }
export const getTransactionHistory = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactions: [
          {
            id: '1',
            type: 'transfer_out',
            amount: -500.00,
            recipient: 'amit@client.com',
            date: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            type: 'transfer_in',
            amount: 1200.00,
            recipient: 'john@example.com',
            date: '2024-01-14T14:20:00Z'
          },
          {
            id: '3',
            type: 'deposit',
            amount: 2500.00,
            date: '2024-01-13T09:15:00Z'
          }
        ]
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/banking/transactions');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};