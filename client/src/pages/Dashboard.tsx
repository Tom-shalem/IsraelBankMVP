import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AccountCard } from "@/components/banking/AccountCard";
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard";
import { TransferForm } from "@/components/banking/TransferForm";
import { TransactionHistory } from "@/components/banking/TransactionHistory";
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard";
import { getAccountBalances, getTransactionHistory } from "@/api/banking";
import { useToast } from "@/hooks/useToast";
import { normalizeAccounts, totalBalance } from "@/utils/currency";
import { getUserDisplayName } from "@/utils/userNames";

interface Accounts {
  checking: number;
  savings: number;
  credit: number;
}

interface Transaction {
  _id: string;
  type: 'transfer_in' | 'transfer_out' | 'deposit' | 'withdrawal';
  amount: number;
  recipientEmail?: string;
  senderEmail?: string;
  timestamp: string;
  status: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Accounts>({ checking: 0, savings: 0, credit: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const loadAccountBalances = async () => {
    try {
      setLoading(true);
      const response = await getAccountBalances() as { accounts: Accounts };
      const normalizedAccounts = normalizeAccounts(response.accounts);
      setAccounts(normalizedAccounts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load account balances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTransactionHistory = async () => {
    try {
      setTransactionsLoading(true);
      const response = await getTransactionHistory() as { transactions: Transaction[] };
      setTransactions(response.transactions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transaction history",
        variant: "destructive",
      });
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleTransferComplete = async () => {
    // Reload both account balances and transaction history after transfer
    await Promise.all([loadAccountBalances(), loadTransactionHistory()]);
  };

  useEffect(() => {
    loadAccountBalances();
    loadTransactionHistory();
  }, []);

  const total = totalBalance(accounts);
  const username = getUserDisplayName(user?.email || '');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {username}
        </h1>
        <p className="text-gray-600">Manage your accounts and transfers</p>
      </div>

      {/* Demo Accounts Card - Only show if not logged in or for demo purposes */}
      {!user && <DemoAccountsCard />}

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AccountCard
          title="Checking Account"
          balance={accounts.checking}
          accountNumber="****1234"
          loading={loading}
          variant="checking"
        />
        <AccountCard
          title="Savings Account"
          balance={accounts.savings}
          accountNumber="****5678"
          loading={loading}
          variant="savings"
        />
        <AccountCard
          title="Credit Account"
          balance={accounts.credit}
          accountNumber="****9012"
          loading={loading}
          variant="credit"
        />
        <TotalBalanceCard total={total} loading={loading} />
      </div>

      {/* Transfer and Transaction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransferForm onTransferComplete={handleTransferComplete} />
        <TransactionHistory transactions={transactions} loading={transactionsLoading} />
      </div>
    </div>
  );
}