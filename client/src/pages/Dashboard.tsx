import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/useToast"
import { getAccountBalances } from "@/api/banking"
import { AccountCard } from "@/components/banking/AccountCard"
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard"
import { TransferForm } from "@/components/banking/TransferForm"
import { TransferLogs } from "@/components/banking/TransferLogs"
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard"
import { Loader2, CreditCard, ArrowLeftRight, History, Users } from "lucide-react"

interface AccountBalances {
  checking: number
  savings: number
  credit: number
}

export function Dashboard() {
  const { user } = useAuth()
  const [balances, setBalances] = useState<AccountBalances | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadBalances = async () => {
    try {
      setIsLoading(true)
      const response = await getAccountBalances()
      setBalances(response.accounts as AccountBalances)
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
  }, [])

  const handleTransferSuccess = () => {
    loadBalances()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium text-gray-700">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your account information</p>
        </div>
      </div>
    )
  }

  if (!balances) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Unable to load account information</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-lg text-gray-600">Manage your accounts and transfers</p>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="transfer"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Transfer
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
          >
            <History className="h-4 w-4 mr-2" />
            Transfer History
          </TabsTrigger>
          <TabsTrigger
            value="demo"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
          >
            <Users className="h-4 w-4 mr-2" />
            Demo Accounts
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Total Balance Card */}
          <TotalBalanceCard balances={balances} />

          {/* Account Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AccountCard
              title="Checking Account"
              balance={balances.checking}
              accountNumber="****1234"
              type="checking"
            />
            <AccountCard
              title="Savings Account"
              balance={balances.savings}
              accountNumber="****5678"
              type="savings"
            />
            <AccountCard
              title="Credit Account"
              balance={balances.credit}
              accountNumber="****9012"
              type="credit"
            />
          </div>
        </TabsContent>

        {/* Transfer Tab */}
        <TabsContent value="transfer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <TransferForm onTransferSuccess={handleTransferSuccess} />
            </div>
            <div>
              <TotalBalanceCard balances={balances} />
            </div>
          </div>
        </TabsContent>

        {/* Transfer History Tab */}
        <TabsContent value="history" className="space-y-6">
          <TransferLogs />
        </TabsContent>

        {/* Demo Accounts Tab */}
        <TabsContent value="demo" className="space-y-6">
          <DemoAccountsCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}