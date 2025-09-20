import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatILSWithSymbol } from "@/utils/currency"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TotalBalanceCardProps {
  total?: number
  data?: any
  isLoading?: boolean
}

export function TotalBalanceCard({ total, data, isLoading }: TotalBalanceCardProps) {
  // Extract total from various possible field names
  const extractedTotal = total || 
    data?.total || 
    data?.total_balance || 
    data?.combined_balance || 
    data?.combinedBalance ||
    data?.overview?.totalBalance ||
    data?.summary?.total ||
    data?.totals?.all ||
    data?.kpis?.total?.value ||
    0;

  const isPositive = extractedTotal >= 0;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">
            Total Balance
          </CardTitle>
          <div className="h-6 w-6 bg-blue-500 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="h-8 bg-blue-500 rounded animate-pulse" />
            <p className="text-xs text-blue-200">
              Combined all accounts
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
            {formatILSWithSymbol(extractedTotal)}
          </div>
          <p className="text-xs text-blue-200">
            Combined all accounts
          </p>
        </div>
      </CardContent>
    </Card>
  )
}