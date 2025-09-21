import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatILS } from "@/utils/currency";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface TotalBalanceCardProps {
  totalBalance: number;
  loading?: boolean;
}

export function TotalBalanceCard({ totalBalance, loading }: TotalBalanceCardProps) {
  const isPositive = totalBalance >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-700">
            Total Balance
          </CardTitle>
          <DollarSign className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-indigo-300 rounded w-40 mb-2"></div>
            <div className="h-4 bg-indigo-300 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-indigo-700">
          Total Balance
        </CardTitle>
        <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600">
          <DollarSign className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-3xl font-bold flex items-center gap-2",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {formatILS(totalBalance)}
          <TrendIcon className={cn(
            "h-6 w-6",
            isPositive ? "text-green-500" : "text-red-500"
          )} />
        </div>
        <p className="text-xs text-indigo-600 mt-2 font-medium">
          Combined balance across all accounts
        </p>
      </CardContent>
    </Card>
  );
}