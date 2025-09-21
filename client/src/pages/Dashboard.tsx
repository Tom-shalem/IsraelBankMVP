import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/useToast'
import { getAccountBalances, transferMoney, getTransactionHistory, getUserProfile } from '@/api/banking'
import { TransactionHistory } from '@/components/banking/TransactionHistory'
import { Wallet, CreditCard, PiggyBank, Send, Loader2, User, Activity } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserDisplayName } from '@/utils/userNames'

interface AccountBalances {
  checking: number
  savings: number
  credit: number
}

interface Transaction {
  _id: string
  type: 'transfer_in' | 'transfer_out' | 'deposit' | 'withdrawal'
  amount: number
  recipientEmail?: string
  senderEmail?: string
  timestamp: string
  status: string
}

interface UserProfile {
  me: string
  username: string
  accounts: AccountBalances
  transactions: Transaction[]
}

export function Dashboard() {
  const [balances, setBalances] = useState<AccountBalances>({ checking: 0, savings: 0, credit: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user profile which includes accounts and some transactions
      const profileResponse = await getUserProfile() as UserProfile
      setUserProfile(profileResponse)
      setBalances(profileResponse.accounts)
      
      // Load full transaction history
      setTransactionLoading(true)
      const transactionResponse = await getTransactionHistory() as { transactions: Transaction[] }
      setTransactions(transactionResponse.transactions)
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setTransactionLoading(false)
    }
  }

  const loadBalances = async () => {
    try {
      const response = await getAccountBalances() as { accounts: AccountBalances }
      setBalances(response.accounts)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load account balances",
        variant: "destructive"
      })
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recipientEmail || !transferAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const amount = parseFloat(transferAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    try {
      setTransferLoading(true)
      const response = await transferMoney({ recipientEmail, amount }) as { 
        success: boolean, 
        message: string, 
        transaction: Transaction 
      }

      toast({
        title: "Success",
        description: `Successfully transferred ₪${amount.toFixed(2)} to ${recipientEmail}`,
      })

      setRecipientEmail('')
      setTransferAmount('')
      
      // Reload dashboard data after transfer
      loadDashboardData()
      
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Failed to process transfer",
        variant: "destructive"
      })
    } finally {
      setTransferLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const totalBalance = balances.checking + balances.savings + balances.credit

  // Get display name from user profile or fallback to auth context
  const displayName = userProfile?.username || getUserDisplayName(user?.email || '')
  const userEmail = userProfile?.me || user?.email || ''

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Welcome, {displayName}
        </h1>
        <p className="text-gray-600 text-lg">{userEmail}</p>
        <p className="text-gray-500">Account Number: ****1234</p>
      </div>

      {/* Account Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Checking Account */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Checking Account</CardTitle>
            <Wallet className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(balances.checking)}
            </div>
            <p className="text-xs text-blue-600 mt-1">Primary Account</p>
          </CardContent>
        </Card>

        {/* Savings Account */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Savings Account</CardTitle>
            <PiggyBank className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(balances.savings)}
            </div>
            <p className="text-xs text-green-600 mt-1">High Yield</p>
          </CardContent>
        </Card>

        {/* Credit Account */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Credit Account</CardTitle>
            <CreditCard className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(balances.credit)}
            </div>
            <p className="text-xs text-red-600 mt-1">Available Credit</p>
          </CardContent>
        </Card>

        {/* Total Balance */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Balance</CardTitle>
            <Wallet className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-purple-600 mt-1">Net Worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transfer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Transfer Money
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="space-y-6">
          {/* Transfer Money Section */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Send className="h-5 w-5 text-blue-600" />
                Transfer Money
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-gray-700">Recipient Email</Label>
                    <Input
                      id="recipient"
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={transferLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-gray-700">Amount (ILS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={transferLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={transferLoading}
                >
                  {transferLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Transfer Money
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts Info */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-amber-800">Demo Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-amber-700">
                <strong>Primary Account:</strong> client@client.com (Password: Client2025$)
              </p>
              <p className="text-amber-700">
                <strong>Secondary Account:</strong> amit@client.com (Password: Client2025$)
              </p>
              <p className="text-sm text-amber-600">
                Use these accounts to test money transfers between users.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <TransactionHistory 
            transactions={transactions} 
            loading={transactionLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}