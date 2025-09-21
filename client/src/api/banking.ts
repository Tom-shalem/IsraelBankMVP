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
  //   const response = await api.get('/api/banking/accounts');
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Transfer money between users
// Endpoint: POST /api/banking/transfer
// Request: { recipientEmail: string, amount: number }
// Response: { success: boolean, message: string, newBalance: number }
export const transferMoney = async (recipientEmail: string, amount: number) => {
  // Mocking the response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount <= 0) {
        reject(new Error('Amount must be positive'));
        return;
      }
      if (amount > 15420.50) {
        reject(new Error('Insufficient funds'));
        return;
      }
      if (!recipientEmail.includes('@')) {
        reject(new Error('Invalid recipient email'));
        return;
      }
      resolve({
        success: true,
        message: 'Transfer completed successfully',
        newBalance: 15420.50 - amount
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/banking/transfer', { recipientEmail, amount });
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
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
            date: '2025-01-08T10:30:00Z'
          },
          {
            id: '2',
            type: 'deposit',
            amount: 2000.00,
            date: '2025-01-07T14:15:00Z'
          },
          {
            id: '3',
            type: 'transfer_in',
            amount: 750.00,
            sender: 'amit@client.com',
            date: '2025-01-06T09:45:00Z'
          }
        ]
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/banking/transactions');
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};