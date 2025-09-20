import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TotalBalanceCardProps {
  totalBalance: number
}

export function TotalBalanceCard({ totalBalance }: TotalBalanceCardProps) {
  const formatBalance = (amount: number) => {
    const isNegative = amount < 0
    const formattedAmount = `₪${Math.abs(amount).toFixed(2)}`
    return isNegative ? `-${formattedAmount}` : formattedAmount
  }

  const getBalanceColor = (amount: number) => {
    if (amount < 0) return "text-red-600"
    return "text-green-600"
  }

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-100">
          Total Balance
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-blue-200" />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${totalBalance < 0 ? 'text-red-200' : 'text-white'}`}>
          {formatBalance(totalBalance)}
        </div>
        <p className="text-xs text-blue-200 mt-1">
          Combined balance across all accounts
        </p>
      </CardContent>
    </Card>
  )
}