import { useState, useEffect } from 'react';
import { bankingStore } from '@/utils/bankingStore';

export function useBanking() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    const userProfile = bankingStore.getUserProfile();
    setProfile(userProfile);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = bankingStore.subscribe(refreshData);
    return unsubscribe;
  }, []);

  const transferMoney = async (recipientEmail: string, amount: number) => {
    return bankingStore.transferMoney(recipientEmail, amount);
  };

  const switchUser = (email: string) => {
    bankingStore.switchUser(email);
  };

  const getAllUsers = () => {
    return bankingStore.getAllUsers();
  };

  return {
    profile,
    loading,
    transferMoney,
    switchUser,
    getAllUsers,
    refreshData
  };
}