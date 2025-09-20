import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatILSWithSymbol } from "@/utils/currency"
import { Wallet, PiggyBank, CreditCard } from "lucide-react"

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
        return <Wallet className="h-5 w-5 text-blue-600" />
      case 'savings':
        return <PiggyBank className="h-5 w-5 text-green-600" />
      case 'credit':
        return <CreditCard className="h-5 w-5 text-purple-600" />
      default:
        return <Wallet className="h-5 w-5 text-blue-600" />
    }
  }

  const getBalanceColor = () => {
    if (type === 'credit') {
      return balance < 0 ? 'text-red-600' : 'text-green-600'
    }
    return balance >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getBadgeVariant = () => {
    if (type === 'credit') {
      return balance < 0 ? 'destructive' : 'default'
    }
    return balance >= 0 ? 'default' : 'destructive'
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2">
            {getIcon()}
            {title}
          </div>
          <Badge variant="outline" className="text-xs">
            {accountNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${getBalanceColor()}`}>
            {formatILSWithSymbol(balance)}
          </div>
          <Badge variant={getBadgeVariant()} className="text-xs">
            {type === 'credit' && balance < 0 ? 'Outstanding' : 'Available'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}