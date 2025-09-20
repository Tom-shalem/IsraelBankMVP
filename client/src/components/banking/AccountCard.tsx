import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AccountCardProps {
  title: string
  balance: number
  accountNumber?: string
  className?: string
  icon?: React.ReactNode
}

export function AccountCard({ title, balance, accountNumber, className, icon }: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const isNegative = balance < 0

  return (
    <Card className={cn("bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-700 text-sm font-medium">
          {icon}
          {title}
        </CardTitle>
        {accountNumber && (
          <p className="text-xs text-gray-500">Account: {accountNumber}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-2xl font-bold",
          isNegative ? "text-red-600" : "text-green-600"
        )}>
          {formatCurrency(balance)}
        </p>
      </CardContent>
    </Card>
  )
}