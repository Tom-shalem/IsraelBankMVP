import api from './api';

// Description: Get account balances for the current user
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

// Description: Transfer money to another user
// Endpoint: POST /api/banking/transfer
// Request: { recipientEmail: string, amount: number }
// Response: { success: boolean, message: string, transaction: object }
export const transferMoney = async (data: { recipientEmail: string; amount: number }) => {
  // Mocking the response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.amount > 20000) {
        reject(new Error('Insufficient funds'));
        return;
      }
      if (data.recipientEmail === 'invalid@test.com') {
        reject(new Error('Recipient not found'));
        return;
      }
      resolve({
        success: true,
        message: 'Transfer completed successfully',
        transaction: {
          _id: Date.now().toString(),
          type: 'transfer_out',
          amount: data.amount,
          recipientEmail: data.recipientEmail,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/banking/transfer', data);
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get transaction history for the current user
// Endpoint: GET /api/banking/transactions
// Request: {}
// Response: { transactions: Array<{ _id: string, type: string, amount: number, recipientEmail?: string, senderEmail?: string, timestamp: string, status: string }> }
export const getTransactionHistory = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactions: [
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

// Description: Get user profile information
// Endpoint: GET /api/banking/profile
// Request: {}
// Response: { me: string, username: string, accounts: object, transactions: array }
export const getUserProfile = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        me: 'client@client.com',
        username: 'client',
        accounts: {
          checking: 15420.50,
          savings: 8750.25,
          credit: -2340.75
        },
        transactions: [
          {
            _id: '1',
            type: 'transfer_in',
            amount: 500.00,
            senderEmail: 'amit@client.com',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed'
          }
        ]
      });
    }, 400);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/banking/profile');
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};