import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/useToast"
import { getTransactions } from "@/api/banking"
import { ArrowUpRight, ArrowDownLeft, Loader2, Activity, Filter } from "lucide-react"
import { formatILSWithSymbol } from "@/utils/currency"
import { buildRecentTransactions } from "@/utils/transactionNormalizer"

interface Transaction {
  id: string
  date: string
  type: string
  amount: number
  description: string
  recipientEmail?: string
  senderEmail?: string
  dir?: string
  peer?: string
}

export function TransferLogs() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await getTransactions()
      setTransactions(response.transactions || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transfer activity",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const formatAmount = (amount: number, sign: string) => {
    return `${sign}${formatILSWithSymbol(Math.abs(amount))}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Activity className="h-5 w-5 text-blue-600" />
            Transfer Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
              <p className="text-sm text-gray-600">Loading transfer activity...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get current user email and normalize transactions
  const currentUserEmail = localStorage.getItem('currentUserEmail') || 'client@client.com'
  const normalizedTransactions = buildRecentTransactions(currentUserEmail, transactions)

  // Filter transactions by type
  const sentTransactions = normalizedTransactions.filter(tx => !tx.incoming)
  const receivedTransactions = normalizedTransactions.filter(tx => tx.incoming)
  const allTransactions = normalizedTransactions

  const renderTransactionList = (transactionList: any[], emptyMessage: string) => {
    if (transactionList.length === 0) {
      return (
        <div className="text-center py-12">
          <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">{emptyMessage}</p>
          <p className="text-sm text-gray-400 mt-1">Transfers will appear here when available</p>
        </div>
      )
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactionList
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full shadow-sm ${
                  transaction.incoming
                    ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 border border-green-200'
                    : 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  {transaction.incoming ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {transaction.label} <span className="text-blue-600">{transaction.peer}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFullDate(transaction.date)}
                  </p>
                  {transaction.raw.description && (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {transaction.raw.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={transaction.incoming ? "default" : "secondary"}
                  className={`font-mono text-sm px-3 py-1 shadow-sm ${
                    transaction.incoming
                      ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 hover:from-green-200 hover:to-green-100 border border-green-200'
                      : 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 hover:from-red-200 hover:to-red-100 border border-red-200'
                  }`}
                >
                  {formatAmount(transaction.amount, transaction.sign)}
                </Badge>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Activity className="h-5 w-5 text-blue-600" />
          Transfer Activity
        </CardTitle>
        <p className="text-sm text-gray-600">View all your transfer history</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100/80 p-1 rounded-lg">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              All ({allTransactions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="received"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 transition-all duration-200"
            >
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Received ({receivedTransactions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="sent"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 transition-all duration-200"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Sent ({sentTransactions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {renderTransactionList(allTransactions, "No transfer activity yet")}
          </TabsContent>
          
          <TabsContent value="received" className="mt-0">
            {renderTransactionList(receivedTransactions, "No transfers received yet")}
          </TabsContent>
          
          <TabsContent value="sent" className="mt-0">
            {renderTransactionList(sentTransactions, "No transfers sent yet")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}