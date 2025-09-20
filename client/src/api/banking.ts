import api from './api';

// Description: Get account balances for the current user
// Endpoint: GET /api/banking/balances
// Request: {}
// Response: { accounts: { checking: number, savings: number, credit: number } }
export const getAccountBalances = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const userEmail = localStorage.getItem('currentUserEmail') || 'client@client.com';
      
      // Different balances for different users
      const balances = {
        'client@client.com': {
          checking: 5000.00,
          savings: 15000.00,
          credit: -2500.00
        },
        'amit@client.com': {
          checking: 3000.00,
          savings: 8000.00,
          credit: -1000.00
        },
        'admin@bank.com': {
          checking: 10000.00,
          savings: 25000.00,
          credit: -5000.00
        }
      };
      
      resolve({
        accounts: balances[userEmail] || balances['client@client.com']
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
export const transferMoney = (recipientEmail: string, amount: number) => {
  // Mocking the response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const senderEmail = localStorage.getItem('currentUserEmail') || 'client@client.com';
      
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
      
      // Store transaction for both sender and recipient
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
        amount: -amount,
        description: `Transfer to ${recipientEmail}`,
        recipientEmail: recipientEmail,
        senderEmail: senderEmail
      });
      
      // Add transaction for recipient (positive amount)
      if (!existingTransactions[recipientEmail]) {
        existingTransactions[recipientEmail] = [];
      }
      existingTransactions[recipientEmail].push({
        id: `${transactionId}-recipient`,
        date: timestamp,
        type: 'transfer_received',
        amount: amount,
        description: `Transfer from ${senderEmail}`,
        recipientEmail: recipientEmail,
        senderEmail: senderEmail
      });
      
      // Save updated transactions
      localStorage.setItem('transactions', JSON.stringify(existingTransactions));
      
      resolve({
        success: true,
        message: `Successfully transferred ₪${amount} to ${recipientEmail}`,
        transactionId: transactionId
      });
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
      
      resolve({
        transactions: userTransactions
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