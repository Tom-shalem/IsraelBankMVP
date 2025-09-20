import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface AccountCardProps {
  title: string
  balance: number
  icon: ReactNode
}

export function AccountCard({ title, balance, icon }: AccountCardProps) {
  const formatBalance = (amount: number) => {
    const isNegative = amount < 0
    const formattedAmount = `₪${Math.abs(amount).toFixed(2)}`
    return isNegative ? `-${formattedAmount}` : formattedAmount
  }

  const getBalanceColor = (amount: number) => {
    if (amount < 0) return "text-red-600"
    if (amount > 10000) return "text-green-600"
    return "text-gray-800"
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="text-blue-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getBalanceColor(balance)}`}>
          {formatBalance(balance)}
        </div>
      </CardContent>
    </Card>
  )
}