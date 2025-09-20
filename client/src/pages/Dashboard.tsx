import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/useToast"
import { getAccountBalances } from "@/api/banking"
import { TransferForm } from "@/components/banking/TransferForm"
import { TransactionHistory } from "@/components/banking/TransactionHistory"
import { Wallet, CreditCard, PiggyBank, Loader2, Send, Clock } from "lucide-react"
import { getDisplayName } from "@/utils/userNames"
import { Button } from "@/components/ui/button"
import { formatILS } from "@/utils/currency"

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
  const [activeSection, setActiveSection] = useState<'transfer' | 'transactions'>('transfer')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
    setRefreshTrigger(prev => prev + 1)
  }

  const totalBalance = balances
    ? balances.checking + balances.savings + balances.credit
    : 0

  const getAmountColor = (amount: number) => {
    if (amount > 0) return "text-green-600 font-bold"
    if (amount < 0) return "text-red-600 font-bold"
    return "text-gray-800 font-bold"
  }

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Card Container */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome {currentUser?.email ? getDisplayName(currentUser.email) : 'User'}
            </h1>
            <p className="text-gray-500 text-sm">
              Account: ****1234
            </p>
          </div>
        </div>

        {/* Account Balances Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50/80 border border-gray-200/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500 text-sm">Checking</span>
            </div>
            <div className={`text-xl ${getAmountColor(balances?.checking || 0)}`}>
              ₪{formatILS(balances?.checking || 0)}
            </div>
          </div>
          <div className="bg-slate-50/80 border border-gray-200/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500 text-sm">Savings</span>
            </div>
            <div className={`text-xl ${getAmountColor(balances?.savings || 0)}`}>
              ₪{formatILS(balances?.savings || 0)}
            </div>
          </div>
          <div className="bg-slate-50/80 border border-gray-200/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500 text-sm">Credit</span>
            </div>
            <div className={`text-xl ${getAmountColor(balances?.credit || 0)}`}>
              ₪{formatILS(balances?.credit || 0)}
            </div>
          </div>
        </div>

        {/* Total Balance Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Total Balance</h3>
            <div className={`text-xl ${getAmountColor(totalBalance)}`}>
              ₪{formatILS(totalBalance)}
            </div>
          </div>
        </div>

        {/* Section Toggle Buttons */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex gap-3 items-center mb-6">
          <Button
            onClick={() => setActiveSection('transfer')}
            className={`px-4 py-2 rounded-lg border-0 font-medium transition-all ${
              activeSection === 'transfer'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-gray-200/60 text-gray-600 hover:bg-gray-300/60'
            }`}
          >
            <Send className="h-4 w-4 mr-2" />
            Transfer Money
          </Button>
          <Button
            onClick={() => setActiveSection('transactions')}
            className={`px-4 py-2 rounded-lg border-0 font-medium transition-all ${
              activeSection === 'transactions'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-gray-200/60 text-gray-600 hover:bg-gray-300/60'
            }`}
          >
            <Clock className="h-4 w-4 mr-2" />
            Recent Transactions
          </Button>
        </div>

        {/* Active Section Content */}
        {activeSection === 'transfer' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6">
            <TransferForm onTransferComplete={handleTransferComplete} />
          </div>
        )}

        {activeSection === 'transactions' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6">
            <TransactionHistory key={refreshTrigger} />
          </div>
        )}
      </div>
    </div>
  )
}