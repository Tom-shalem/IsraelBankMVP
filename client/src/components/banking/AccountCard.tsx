import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface AccountCardProps {
  title: string
  balance: number
  icon: ReactNode
}

export function AccountCard({ title, balance, icon }: AccountCardProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const isNegative = balance < 0

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
        <div className={`text-2xl font-bold ${isNegative ? 'text-red-600' : 'text-gray-800'}`}>
          {formatBalance(balance)}
        </div>
      </CardContent>
    </Card>
  )
}