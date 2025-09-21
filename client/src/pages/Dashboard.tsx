import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountCard } from "@/components/banking/AccountCard";
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard";
import { TransferForm } from "@/components/banking/TransferForm";
import { TransactionHistory } from "@/components/banking/TransactionHistory";
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard";
import { formatCurrency } from "@/utils/currency";
import { useBanking } from "@/hooks/useBanking";
import { useToast } from "@/hooks/useToast";
import { Wallet, RefreshCw, Users, TrendingUp } from "lucide-react";

export function Dashboard() {
  const { profile, loading, refreshData, switchUser, getAllUsers } = useBanking();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate refresh delay
    refreshData();
    setRefreshing(false);
    toast({
      title: "Dashboard Refreshed",
      description: "Account balances and transactions updated",
    });
  };

  const handleTransferComplete = () => {
    refreshData();
  };

  const handleUserSwitch = (email: string) => {
    switchUser(email);
    toast({
      title: "User Switched",
      description: `Now viewing ${email.split('@')[0]}'s account`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Wallet className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold">No Profile Found</h3>
              <p className="text-gray-600">Unable to load user profile. Please try refreshing.</p>
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBalance = profile.accounts.checking + profile.accounts.savings + profile.accounts.credit;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {profile.username}
            </h1>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Users className="mr-1 h-3 w-3" />
              {profile.me}
            </Badge>
          </div>
          <p className="text-gray-600">
            Account Number: ****{profile.me.split('@')[0].slice(-4)}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Account Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AccountCard
          title="Checking Account"
          balance={profile.accounts.checking}
          icon="💳"
          gradient="from-blue-500 to-blue-600"
        />
        <AccountCard
          title="Savings Account"
          balance={profile.accounts.savings}
          icon="💰"
          gradient="from-green-500 to-green-600"
        />
        <AccountCard
          title="Credit Account"
          balance={profile.accounts.credit}
          icon="💎"
          gradient="from-purple-500 to-purple-600"
        />
        <TotalBalanceCard
          totalBalance={totalBalance}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Demo Accounts Card */}
      <DemoAccountsCard 
        onUserSwitch={handleUserSwitch}
        currentUser={profile.me}
        availableUsers={getAllUsers()}
      />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Transfer Form */}
        <div className="space-y-6">
          <TransferForm onTransferComplete={handleTransferComplete} />
        </div>

        {/* Transaction History */}
        <div className="space-y-6">
          <TransactionHistory loading={false} />
        </div>
      </div>
    </div>
  );
}