import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatILS } from "@/utils/currency";
import { cn } from "@/lib/utils";
import { Wallet, PiggyBank, CreditCard } from "lucide-react";

interface AccountCardProps {
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  loading?: boolean;
}

export function AccountCard({ type, balance, loading }: AccountCardProps) {
  const getAccountConfig = (type: string) => {
    switch (type) {
      case 'checking':
        return {
          title: 'Checking Account',
          icon: Wallet,
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'savings':
        return {
          title: 'Savings Account',
          icon: PiggyBank,
          gradient: 'from-green-500 to-green-600',
          bgGradient: 'from-green-50 to-green-100',
          borderColor: 'border-green-200'
        };
      case 'credit':
        return {
          title: 'Credit Account',
          icon: CreditCard,
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          title: 'Account',
          icon: Wallet,
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getAccountConfig(type);
  const Icon = config.icon;

  if (loading) {
    return (
      <Card className={cn("bg-gradient-to-br", config.bgGradient, config.borderColor)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            {config.title}
          </CardTitle>
          <Icon className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "bg-gradient-to-br backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
      config.bgGradient,
      config.borderColor
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {config.title}
        </CardTitle>
        <div className={cn("p-2 rounded-full bg-gradient-to-r", config.gradient)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold",
          balance < 0 ? "text-red-600" : "text-gray-900"
        )}>
          {formatILS(balance)}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Account: ****{Math.abs(Math.floor(balance)).toString().slice(-4)}
        </p>
      </CardContent>
    </Card>
  );
}