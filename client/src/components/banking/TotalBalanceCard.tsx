import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Account } from "@/api/banking";

interface TotalBalanceCardProps {
  accounts: Account[];
}

export function TotalBalanceCard({ accounts }: TotalBalanceCardProps) {
  const calculateTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const formatBalance = (balance: number) => {
    const isNegative = balance < 0;
    const formattedAmount = `₪${Math.abs(balance).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  };

  const totalBalance = calculateTotalBalance();

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-100">
          Total Balance
        </CardTitle>
        <TrendingUp className="h-6 w-6 text-blue-200" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {formatBalance(totalBalance)}
          </div>
          <div className="text-xs text-blue-200">
            Combined balance across all accounts
          </div>
        </div>
      </CardContent>
    </Card>
  );
}