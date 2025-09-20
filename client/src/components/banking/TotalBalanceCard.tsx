import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TotalBalanceCardProps {
  totalBalance: number
}

export function TotalBalanceCard({ totalBalance }: TotalBalanceCardProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const isNegative = totalBalance < 0

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-100">
          Total Balance
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-blue-200" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isNegative ? 'text-red-200' : 'text-white'}`}>
          {formatBalance(totalBalance)}
        </div>
      </CardContent>
    </Card>
  )
}