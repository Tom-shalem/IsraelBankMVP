import api from './api';
import { bankingStore } from '@/utils/bankingStore';

// Description: Get account balances for the current user
// Endpoint: GET /api/banking/accounts
// Request: {}
// Response: { accounts: { checking: number, savings: number, credit: number } }
export const getAccountBalances = async () => {
  // Using local banking store
  return new Promise((resolve) => {
    setTimeout(() => {
      const balances = bankingStore.getAccountBalances();
      resolve(balances);
    }, 300);
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
  // Using local banking store
  return bankingStore.transferMoney(data.recipientEmail, data.amount);
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
  // Using local banking store
  return new Promise((resolve) => {
    setTimeout(() => {
      const history = bankingStore.getTransactionHistory();
      resolve(history);
    }, 200);
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
  // Using local banking store
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = bankingStore.getUserProfile();
      resolve(profile);
    }, 200);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/banking/profile');
  //   return response.data;
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};