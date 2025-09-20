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

// Description: Transfer money between accounts
// Endpoint: POST /api/banking/transfer
// Request: { recipientEmail: string, amount: number }
// Response: { success: boolean, message: string, newBalances: { checking: number, savings: number, credit: number } }
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
      
      // Valid recipients for demo
      const validRecipients = ['client@client.com', 'amit@client.com'];
      if (!validRecipients.includes(recipientEmail)) {
        reject(new Error('Recipient not found'));
        return;
      }

      // Store transaction in localStorage
      const currentUser = localStorage.getItem('currentUserEmail') || 'client@client.com';
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      const newTransaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'transfer_sent',
        amount: -amount,
        recipientEmail,
        description: `Transfer to ${recipientEmail}`,
        userEmail: currentUser
      };

      // Add received transaction for recipient
      const receivedTransaction = {
        id: (Date.now() + 1).toString(),
        date: new Date().toISOString(),
        type: 'transfer_received',
        amount: amount,
        senderEmail: currentUser,
        description: `Transfer from ${currentUser}`,
        userEmail: recipientEmail
      };

      transactions.push(newTransaction, receivedTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      resolve({
        success: true,
        message: 'Transfer completed successfully',
        newBalances: {
          checking: 15420.50 - amount,
          savings: 8750.25,
          credit: -2340.75
        }
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

// Description: Get user transaction history
// Endpoint: GET /api/banking/transactions
// Request: {}
// Response: { transactions: Array<{ id: string, date: string, type: string, amount: number, description: string }> }
export const getTransactions = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUser = localStorage.getItem('currentUserEmail') || 'client@client.com';
      const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Filter transactions for current user
      const userTransactions = allTransactions.filter(t => t.userEmail === currentUser);
      
      resolve({
        transactions: userTransactions
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