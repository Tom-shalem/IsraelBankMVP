import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatILS } from "@/utils/currency";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TotalBalanceCardProps {
  total: number;
  loading?: boolean;
}

export function TotalBalanceCard({ total, loading }: TotalBalanceCardProps) {
  const isPositive = total >= 0;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 border-indigo-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-indigo-800">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-9 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 border-indigo-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-indigo-800">
          {isPositive ? (
            <TrendingUp className="h-6 w-6 text-green-600" />
          ) : (
            <TrendingDown className="h-6 w-6 text-red-600" />
          )}
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          <span className={isPositive ? "text-green-700" : "text-red-600"}>
            {formatILS(total)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Combined balance across all accounts
        </p>
      </CardContent>
    </Card>
  );
}