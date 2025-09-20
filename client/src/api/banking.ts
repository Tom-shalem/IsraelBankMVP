import api from './api';

export interface Account {
  _id: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  accountNumber: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  accounts: Account[];
}

export interface TransferRequest {
  recipientEmail: string;
  amount: number;
}

// Description: Get user account information and balances
// Endpoint: GET /api/user/accounts
// Request: {}
// Response: { user: User }
export const getUserAccounts = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const userEmail = localStorage.getItem('userEmail') || 'client@client.com';
      const users = {
        'client@client.com': {
          _id: '1',
          email: 'client@client.com',
          name: 'David Cohen',
          accounts: [
            {
              _id: 'acc1',
              type: 'checking',
              balance: 15420.50,
              accountNumber: '****1234'
            },
            {
              _id: 'acc2', 
              type: 'savings',
              balance: 45890.75,
              accountNumber: '****5678'
            },
            {
              _id: 'acc3',
              type: 'credit',
              balance: -2340.25,
              accountNumber: '****9012'
            }
          ]
        },
        'amit@client.com': {
          _id: '2',
          email: 'amit@client.com',
          name: 'Amit Levy',
          accounts: [
            {
              _id: 'acc4',
              type: 'checking',
              balance: 8750.30,
              accountNumber: '****3456'
            },
            {
              _id: 'acc5',
              type: 'savings', 
              balance: 22100.00,
              accountNumber: '****7890'
            },
            {
              _id: 'acc6',
              type: 'credit',
              balance: -1200.50,
              accountNumber: '****2345'
            }
          ]
        },
        'admin@bank.com': {
          _id: '3',
          email: 'admin@bank.com',
          name: 'Bank Administrator',
          accounts: [
            {
              _id: 'acc7',
              type: 'checking',
              balance: 100000.00,
              accountNumber: '****0001'
            },
            {
              _id: 'acc8',
              type: 'savings',
              balance: 500000.00,
              accountNumber: '****0002'
            },
            {
              _id: 'acc9',
              type: 'credit',
              balance: 0,
              accountNumber: '****0003'
            }
          ]
        }
      };
      
      resolve({ user: users[userEmail] || users['client@client.com'] });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/user/accounts');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Transfer money to another user
// Endpoint: POST /api/transfer
// Request: { recipientEmail: string, amount: number }
// Response: { success: boolean, message: string, newBalance: number }
export const transferMoney = (data: TransferRequest) => {
  // Mocking the response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { recipientEmail, amount } = data;
      
      // Validate amount
      if (amount <= 0) {
        reject(new Error('Transfer amount must be positive'));
        return;
      }
      
      // Check if recipient exists
      const validEmails = ['client@client.com', 'amit@client.com', 'admin@bank.com'];
      if (!validEmails.includes(recipientEmail)) {
        reject(new Error('Recipient not found'));
        return;
      }
      
      // Mock insufficient funds check (assuming checking account balance)
      const currentUser = localStorage.getItem('userEmail') || 'client@client.com';
      if (currentUser === 'client@client.com' && amount > 15420.50) {
        reject(new Error('Insufficient funds'));
        return;
      }
      
      if (currentUser === 'amit@client.com' && amount > 8750.30) {
        reject(new Error('Insufficient funds'));
        return;
      }
      
      // Simulate successful transfer
      resolve({
        success: true,
        message: `Successfully transferred ₪${amount.toFixed(2)} to ${recipientEmail}`,
        newBalance: currentUser === 'client@client.com' ? 15420.50 - amount : 8750.30 - amount
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/transfer', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get demo accounts for login screen
// Endpoint: GET /api/demo-accounts
// Request: {}
// Response: { accounts: Array<{ email: string, password: string, name: string }> }
export const getDemoAccounts = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accounts: [
          {
            email: 'client@client.com',
            password: 'Client2025$',
            name: 'David Cohen'
          },
          {
            email: 'amit@client.com', 
            password: 'Client2025$',
            name: 'Amit Levy'
          },
          {
            email: 'admin@bank.com',
            password: 'Admin2025$',
            name: 'Bank Administrator'
          }
        ]
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/demo-accounts');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};