import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, getTransactionHistory } from "@/api/banking";
import { AccountCard } from "@/components/banking/AccountCard";
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard";
import { TransferForm } from "@/components/banking/TransferForm";
import { TransactionHistory } from "@/components/banking/TransactionHistory";
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard";
import { normalizeAccounts, totalBalance } from "@/utils/currency";
import { getUserDisplayName } from "@/utils/userNames";
import { useToast } from "@/hooks/useToast";
import { Card, CardContent } from "@/components/ui/card";
import { User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserData {
  me: string;
  username: string;
  accounts: {
    checking: number;
    savings: number;
    credit: number;
  };
  transactions: any[];
}

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      
      const [profileResponse, transactionsResponse] = await Promise.all([
        getUserProfile(),
        getTransactionHistory()
      ]);

      const profileData = profileResponse as any;
      const transactionsData = transactionsResponse as any;

      // Normalize the accounts data to ensure proper number formatting
      const normalizedAccounts = normalizeAccounts(profileData.accounts || {});
      
      setUserData({
        me: profileData.me || user?.email || '',
        username: profileData.username || getUserDisplayName(user?.email || ''),
        accounts: normalizedAccounts,
        transactions: profileData.transactions || []
      });

      setTransactions(transactionsData.transactions || []);

      if (showRefreshToast) {
        toast({
          title: "Data Refreshed",
          description: "Account information has been updated",
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load account data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleTransferComplete = () => {
    fetchUserData(true);
  };

  const handleRefresh = () => {
    fetchUserData(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Welcome Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Account Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <AccountCard key={i} type="checking" balance={0} loading={true} />
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <CardContent>
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Account Data
            </h3>
            <p className="text-gray-600 mb-4">
              There was an issue loading your account information.
            </p>
            <Button onClick={() => fetchUserData()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const total = totalBalance(userData.accounts);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {userData.username}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your accounts and transfers
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Account Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AccountCard
          type="checking"
          balance={userData.accounts.checking}
          loading={loading}
        />
        <AccountCard
          type="savings"
          balance={userData.accounts.savings}
          loading={loading}
        />
        <AccountCard
          type="credit"
          balance={userData.accounts.credit}
          loading={loading}
        />
        <TotalBalanceCard
          totalBalance={total}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <TransferForm onTransferComplete={handleTransferComplete} />
          <DemoAccountsCard />
        </div>

        {/* Right Column */}
        <div>
          <TransactionHistory 
            transactions={transactions} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}