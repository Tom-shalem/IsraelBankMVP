import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatILSWithSymbol } from "@/utils/currency"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TotalBalanceCardProps {
  balance: number
}

export function TotalBalanceCard({ balance }: TotalBalanceCardProps) {
  const isPositive = balance >= 0

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-100">
          {isPositive ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatILSWithSymbol(balance)}
          </div>
          <p className="text-xs text-blue-100">
            Combined balance across all accounts
          </p>
        </div>
      </CardContent>
    </Card>
  )
}