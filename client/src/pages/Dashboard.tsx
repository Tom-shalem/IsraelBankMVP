import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/contexts/AuthContext"
import { getAccountBalances } from "@/api/banking"
import { AccountCard } from "@/components/banking/AccountCard"
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard"
import { TransferForm } from "@/components/banking/TransferForm"
import { TransactionHistory } from "@/components/banking/TransactionHistory"
import { TransferLogs } from "@/components/banking/TransferLogs"
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, ArrowLeftRight, History, Activity, RefreshCw } from "lucide-react"
import { formatILSWithSymbol } from "@/utils/currency"

interface AccountBalances {
  checking: number
  savings: number
  credit: number
}

export function Dashboard() {
  const [balances, setBalances] = useState<AccountBalances>({
    checking: 0,
    savings: 0,
    credit: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  const loadBalances = async () => {
    try {
      setIsLoading(true)
      const response = await getAccountBalances()
      setBalances(response.accounts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load account balances",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBalances()
  }, [refreshKey])

  const handleTransferSuccess = () => {
    // Refresh balances and transaction history
    setRefreshKey(prev => prev + 1)
    toast({
      title: "Transfer Successful",
      description: "Your transfer has been completed successfully",
    })
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    toast({
      title: "Refreshed",
      description: "Account data has been updated",
    })
  }

  const totalBalance = balances.checking + balances.savings + balances.credit

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">Manage your accounts and transfers</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Demo Accounts Card */}
      <DemoAccountsCard />

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AccountCard
          title="Checking Account"
          balance={balances.checking}
          accountNumber="****1234"
          isLoading={isLoading}
          icon={<Wallet className="h-5 w-5" />}
          gradient="from-blue-500 to-blue-600"
        />
        <AccountCard
          title="Savings Account"
          balance={balances.savings}
          accountNumber="****5678"
          isLoading={isLoading}
          icon={<Wallet className="h-5 w-5" />}
          gradient="from-green-500 to-green-600"
        />
        <AccountCard
          title="Credit Account"
          balance={balances.credit}
          accountNumber="****9012"
          isLoading={isLoading}
          icon={<Wallet className="h-5 w-5" />}
          gradient="from-purple-500 to-purple-600"
        />
        <TotalBalanceCard
          total={totalBalance}
          isLoading={isLoading}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm shadow-sm border-0 p-1 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
          >
            <History className="h-4 w-4 mr-2" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger 
            value="transfer"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Transfer Money
          </TabsTrigger>
          <TabsTrigger 
            value="activity"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
          >
            <Activity className="h-4 w-4 mr-2" />
            Transfer History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <TransactionHistory key={refreshKey} />
        </TabsContent>
        
        <TabsContent value="transfer" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TransferForm onTransferSuccess={handleTransferSuccess} />
            <TransactionHistory key={refreshKey} />
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <TransferLogs key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  )
}