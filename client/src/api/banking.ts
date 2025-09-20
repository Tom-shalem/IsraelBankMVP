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