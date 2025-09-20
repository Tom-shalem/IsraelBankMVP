import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AccountCard } from "@/components/banking/AccountCard"
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard"
import { TransferForm } from "@/components/banking/TransferForm"
import { TransactionHistory } from "@/components/banking/TransactionHistory"
import { DemoAccountsCard } from "@/components/banking/DemoAccountsCard"
import { getAccountBalances } from "@/api/banking"
import { useToast } from "@/hooks/useToast"
import { Loader2, Wallet } from "lucide-react"

interface AccountBalances {
  checking: number
  savings: number
  credit: number
}

export function Dashboard() {
  const { user } = useAuth()
  const [balances, setBalances] = useState<AccountBalances | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
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
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  const totalBalance = balances 
    ? balances.checking + balances.savings + balances.credit
    : 0

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wallet className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.email?.split('@')[0] || 'User'}
          </h1>
        </div>
        <p className="text-gray-600">Manage your accounts and transfers</p>
      </div>

      {/* Demo Accounts Card */}
      <DemoAccountsCard />

      {/* Account Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AccountCard
          title="Checking Account"
          balance={balances?.checking || 0}
          accountNumber="****1234"
          type="checking"
        />
        <AccountCard
          title="Savings Account"
          balance={balances?.savings || 0}
          accountNumber="****5678"
          type="savings"
        />
        <AccountCard
          title="Credit Account"
          balance={balances?.credit || 0}
          accountNumber="****9012"
          type="credit"
        />
        <TotalBalanceCard balance={totalBalance} />
      </div>

      {/* Transfer and Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransferForm onTransferSuccess={handleTransferSuccess} />
        <TransactionHistory key={refreshKey} />
      </div>
    </div>
  )
}