import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AccountCard } from "@/components/banking/AccountCard"
import { TotalBalanceCard } from "@/components/banking/TotalBalanceCard"
import { TransferForm } from "@/components/banking/TransferForm"
import { TransactionHistory } from "@/components/banking/TransactionHistory"
import { getAccountBalances } from "@/api/banking"
import { useToast } from "@/hooks/useToast"
import { Loader2 } from "lucide-react"

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
  }, [])

  const handleTransferSuccess = () => {
    loadBalances()
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

  if (!balances) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load account information</p>
      </div>
    )
  }

  const totalBalance = balances.checking + balances.savings + balances.credit

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.email || 'User'}
        </h1>
        <p className="text-gray-600">Manage your accounts and transfers</p>
      </div>

      {/* Account Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <TotalBalanceCard totalBalance={totalBalance} />
      </div>

      {/* Transfer and Transaction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransferForm onTransferSuccess={handleTransferSuccess} />
        <TransactionHistory />
      </div>
    </div>
  )
}