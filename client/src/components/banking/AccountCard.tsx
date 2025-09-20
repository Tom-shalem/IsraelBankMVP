import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, PiggyBank, Wallet } from "lucide-react";
import { Account } from "@/api/banking";

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <Wallet className="h-6 w-6 text-blue-600" />;
      case 'savings':
        return <PiggyBank className="h-6 w-6 text-green-600" />;
      case 'credit':
        return <CreditCard className="h-6 w-6 text-purple-600" />;
      default:
        return <Wallet className="h-6 w-6 text-gray-600" />;
    }
  };

  const getAccountTitle = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Checking Account';
      case 'savings':
        return 'Savings Account';
      case 'credit':
        return 'Credit Account';
      default:
        return 'Account';
    }
  };

  const formatBalance = (balance: number) => {
    const isNegative = balance < 0;
    const formattedAmount = `₪${Math.abs(balance).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  };

  const getBalanceColor = (balance: number, type: string) => {
    if (type === 'credit') {
      return balance < 0 ? 'text-red-600' : 'text-green-600';
    }
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {getAccountTitle(account.type)}
        </CardTitle>
        {getAccountIcon(account.type)}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            Account: {account.accountNumber}
          </div>
          <div className={`text-2xl font-bold ${getBalanceColor(account.balance, account.type)}`}>
            {formatBalance(account.balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}