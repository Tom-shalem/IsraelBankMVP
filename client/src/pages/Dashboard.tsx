import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/useToast"
import { getAccountBalances } from "@/api/banking"
import { AccountCard } from "@/components/banking/AccountCard"
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard"
import { TransferForm } from "@/components/banking/TransferForm"
import { TransactionHistory } from "@/components/banking/TransactionHistory"
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, CreditCard, PiggyBank, Loader2 } from "lucide-react"

interface AccountBalances {
  checking: number
  savings: number
  credit: number
}

export function Dashboard() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const [balances, setBalances] = useState<AccountBalances | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    // Store current user email for transaction tracking
    if (currentUser?.email) {
      localStorage.setItem('currentUserEmail', currentUser.email)
    }
  }, [currentUser])

  const handleTransferComplete = () => {
    loadBalances()
  }

  const totalBalance = balances
    ? balances.checking + balances.savings + balances.credit
    : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your account information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {currentUser?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-gray-600">
          Account Number: ****1234
        </p>
      </div>

      {/* Total Balance - Prominently displayed */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <TotalBalanceCard totalBalance={totalBalance} />
        </div>
      </div>

      {/* Account Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AccountCard
          title="Checking Account"
          balance={balances?.checking || 0}
          icon={<Wallet className="h-4 w-4" />}
        />
        <AccountCard
          title="Savings Account"
          balance={balances?.savings || 0}
          icon={<PiggyBank className="h-4 w-4" />}
        />
        <AccountCard
          title="Credit Account"
          balance={balances?.credit || 0}
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <TabsTrigger value="transfer" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Transfer Money
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger value="demo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Demo Accounts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transfer" className="mt-6">
          <div className="max-w-md mx-auto">
            <TransferForm onTransferComplete={handleTransferComplete} />
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <TransactionHistory key={Date.now()} />
          </div>
        </TabsContent>
        
        <TabsContent value="demo" className="mt-6">
          <div className="max-w-md mx-auto">
            <DemoAccountsCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}