import { useEffect, useState } from "react";
import { AccountCard } from "@/components/banking/AccountCard";
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard";
import { TransferForm } from "@/components/banking/TransferForm";
import { User, getUserAccounts } from "@/api/banking";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const loadUserData = async (showRefreshIndicator = false) => {
    console.log('Loading user account data...');
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      // Store user email for API mocking
      if (authUser?.email) {
        localStorage.setItem('userEmail', authUser.email);
      }
      
      const response = await getUserAccounts() as { user: User };
      console.log('User data loaded:', response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: "Error",
        description: "Failed to load account information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [authUser]);

  const handleTransferSuccess = () => {
    console.log('Transfer successful, refreshing account data...');
    loadUserData(true);
  };

  const handleRefresh = () => {
    loadUserData(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading your account information...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Unable to load account information</p>
          <Button onClick={() => loadUserData()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your accounts and transfer money securely
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.accounts.map((account) => (
          <AccountCard key={account._id} account={account} />
        ))}
        <TotalBalanceCard accounts={user.accounts} />
      </div>

      {/* Transfer Form */}
      <div className="max-w-md">
        <TransferForm onTransferSuccess={handleTransferSuccess} />
      </div>
    </div>
  );
}