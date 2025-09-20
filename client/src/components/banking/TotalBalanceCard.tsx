import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatILS } from "@/utils/currency"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TotalBalanceCardProps {
  totalBalance: number
}

export function TotalBalanceCard({ totalBalance }: TotalBalanceCardProps) {
  const isPositive = totalBalance >= 0

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-100">
          Total Balance
        </CardTitle>
        {isPositive ? (
          <TrendingUp className="h-6 w-6 text-green-300" />
        ) : (
          <TrendingDown className="h-6 w-6 text-red-300" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${isPositive ? 'text-white' : 'text-red-200'}`}>
            {formatILS(totalBalance)}
          </div>
          <p className="text-xs text-blue-200">
            Combined all accounts
          </p>
        </div>
      </CardContent>
    </Card>
  )
}