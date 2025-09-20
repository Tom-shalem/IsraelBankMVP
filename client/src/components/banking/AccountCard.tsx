import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatILS } from "@/utils/currency"
import { CreditCard, PiggyBank, Wallet } from "lucide-react"

interface AccountCardProps {
  title: string
  balance: number
  accountNumber: string
  type: 'checking' | 'savings' | 'credit'
}

export function AccountCard({ title, balance, accountNumber, type }: AccountCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'checking':
        return <Wallet className="h-6 w-6 text-blue-600" />
      case 'savings':
        return <PiggyBank className="h-6 w-6 text-green-600" />
      case 'credit':
        return <CreditCard className="h-6 w-6 text-red-600" />
      default:
        return <Wallet className="h-6 w-6 text-blue-600" />
    }
  }

  const getBalanceColor = () => {
    if (type === 'credit') {
      return balance < 0 ? 'text-red-600' : 'text-green-600'
    }
    return balance >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${getBalanceColor()}`}>
            {formatILS(balance)}
          </div>
          <p className="text-xs text-gray-500">
            Account: {accountNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}