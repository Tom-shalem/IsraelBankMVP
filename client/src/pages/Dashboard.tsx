import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/useToast'
import { getAccountBalances, transferMoney } from '@/api/banking'
import { Wallet, CreditCard, PiggyBank, Send, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AccountBalances {
  checking: number
  savings: number
  credit: number
}

export function Dashboard() {
  const [balances, setBalances] = useState<AccountBalances>({ checking: 0, savings: 0, credit: 0 })
  const [loading, setLoading] = useState(true)
  const [transferLoading, setTransferLoading] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadBalances()
  }, [])

  const loadBalances = async () => {
    try {
      setLoading(true)
      const response = await getAccountBalances() as { accounts: AccountBalances }
      setBalances(response.accounts)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load account balances",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
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
      await transferMoney({ recipientEmail, amount })
      
      toast({
        title: "Success",
        description: `Successfully transferred ₪${amount.toFixed(2)} to ${recipientEmail}`,
      })
      
      setRecipientEmail('')
      setTransferAmount('')
      loadBalances() // Reload balances after transfer
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-gray-600">Account Number: ****1234</p>
      </div>

      {/* Account Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Checking Account */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Checking Account</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(balances.checking)}
            </div>
          </CardContent>
        </Card>

        {/* Savings Account */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Savings Account</CardTitle>
            <PiggyBank className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(balances.savings)}
            </div>
          </CardContent>
        </Card>

        {/* Credit Account */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Credit Account</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(balances.credit)}
            </div>
          </CardContent>
        </Card>

        {/* Total Balance */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(totalBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

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
                  className="bg-white/80 border-gray-300 focus:border-blue-500"
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
                  className="bg-white/80 border-gray-300 focus:border-blue-500"
                  disabled={transferLoading}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
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
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
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
    </div>
  )
}