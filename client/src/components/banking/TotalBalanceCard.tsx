import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TotalBalanceCardProps {
  totalBalance: number
}

export function TotalBalanceCard({ totalBalance }: TotalBalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-100 text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-white">
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-blue-200 text-sm mt-1">
          Combined balance across all accounts
        </p>
      </CardContent>
    </Card>
  )
}