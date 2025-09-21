import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, PiggyBank, TrendingUp, User, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountBalances } from "@/api/banking";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/currency";
import { TransferForm } from "@/components/banking/TransferForm";
import { TransactionHistory } from "@/components/banking/TransactionHistory";
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard";
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard";
import { AccountCard } from "@/components/banking/AccountCard";

interface AccountBalances {
  checking: number;
  savings: number;
  credit: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balances, setBalances] = useState<AccountBalances>({
    checking: 0,
    savings: 0,
    credit: 0
  });
  const [loading, setLoading] = useState(true);

  const loadBalances = async () => {
    try {
      setLoading(true);
      const response = await getAccountBalances() as { accounts: AccountBalances };
      setBalances(response.accounts);
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

  useEffect(() => {
    loadBalances();
  }, []);

  const handleTransferComplete = () => {
    // Simulate balance update after transfer
    // In a real app, this would refetch from the server
    loadBalances();
  };

  const handleRefresh = () => {
    loadBalances();
  };

  const totalBalance = balances.checking + balances.savings + balances.credit;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="h-8 w-8 text-blue-600" />
            Welcome, {user?.email || 'User'}
          </h1>
          <p className="text-gray-600">Manage your accounts and transfers</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Demo Accounts Info */}
      <DemoAccountsCard />

      {/* Account Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AccountCard
          title="Checking Account"
          balance={balances.checking}
          icon={<Wallet className="h-6 w-6 text-blue-600" />}
          gradient="from-blue-50 to-blue-100"
          borderColor="border-blue-200"
          textColor="text-blue-800"
          loading={loading}
        />
        
        <AccountCard
          title="Savings Account"
          balance={balances.savings}
          icon={<PiggyBank className="h-6 w-6 text-green-600" />}
          gradient="from-green-50 to-green-100"
          borderColor="border-green-200"
          textColor="text-green-800"
          loading={loading}
        />
        
        <AccountCard
          title="Credit Account"
          balance={balances.credit}
          icon={<CreditCard className="h-6 w-6 text-red-600" />}
          gradient="from-red-50 to-red-100"
          borderColor="border-red-200"
          textColor="text-red-800"
          loading={loading}
        />

        <TotalBalanceCard
          total={totalBalance}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          loading={loading}
        />
      </div>

      {/* Transfer and History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransferForm onTransferComplete={handleTransferComplete} />
        <TransactionHistory loading={loading} />
      </div>
    </div>
  );
}