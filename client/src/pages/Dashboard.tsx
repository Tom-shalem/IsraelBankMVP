import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AccountCard } from "@/components/banking/AccountCard";
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard";
import { TransferForm } from "@/components/banking/TransferForm";
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard";
import { getAccountBalances } from "@/api/banking";
import { useToast } from "@/hooks/useToast";
import { Loader2, Wallet } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      const data = await getAccountBalances();
      setAccounts(data.accounts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load account data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccountData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your account information...</p>
        </div>
      </div>
    );
  }

  if (!accounts) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load account data</p>
      </div>
    );
  }

  const totalBalance = accounts.checking + accounts.savings + accounts.credit;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wallet className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.email || 'User'}
          </h1>
        </div>
        <p className="text-gray-600">Manage your accounts and transfer money securely</p>
      </div>

      {/* Total Balance */}
      <div className="max-w-md mx-auto">
        <TotalBalanceCard totalBalance={totalBalance} />
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AccountCard
          title="Checking Account"
          balance={accounts.checking}
          accountNumber="1234"
          type="checking"
        />
        <AccountCard
          title="Savings Account"
          balance={accounts.savings}
          accountNumber="5678"
          type="savings"
        />
        <AccountCard
          title="Credit Account"
          balance={accounts.credit}
          accountNumber="9012"
          type="credit"
        />
      </div>

      {/* Transfer Form and Demo Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransferForm onTransferComplete={loadAccountData} />
        <DemoAccountsCard />
      </div>
    </div>
  );
}