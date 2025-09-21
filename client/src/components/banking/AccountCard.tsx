import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  title: string;
  balance: number;
  accountNumber?: string;
  type: 'checking' | 'savings' | 'credit';
}

export function AccountCard({ title, balance, accountNumber, type }: AccountCardProps) {
  const isNegative = balance < 0;
  
  const getCardStyles = () => {
    switch (type) {
      case 'checking':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      case 'savings':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'credit':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", getCardStyles())}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
        {accountNumber && (
          <p className="text-sm text-gray-600">
            Account: ****{accountNumber.slice(-4)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <span className={cn(
            isNegative ? "text-red-600" : "text-gray-900"
          )}>
            {formatCurrency(balance)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}