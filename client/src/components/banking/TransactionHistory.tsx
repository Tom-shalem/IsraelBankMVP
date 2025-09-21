import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  _id: string;
  type: 'transfer_in' | 'transfer_out' | 'deposit' | 'withdrawal';
  amount: number;
  recipientEmail?: string;
  senderEmail?: string;
  timestamp: string;
  status: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'transfer_in':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'transfer_out':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'deposit':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'withdrawal':
        return <Minus className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'transfer_in':
      case 'deposit':
        return 'text-green-600';
      case 'transfer_out':
      case 'withdrawal':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionDescription = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'transfer_in':
        return `From ${transaction.senderEmail || 'Unknown'}`;
      case 'transfer_out':
        return `To ${transaction.recipientEmail || 'Unknown'}`;
      case 'deposit':
        return 'Account Deposit';
      case 'withdrawal':
        return 'Account Withdrawal';
      default:
        return 'Transaction';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="h-5 w-5 text-blue-600" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                    <div className="w-24 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Clock className="h-5 w-5 text-blue-600" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-100 hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 capitalize">
                      {transaction.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getTransactionDescription(transaction)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={cn("font-semibold", getTransactionColor(transaction.type))}>
                    {transaction.type.includes('in') || transaction.type === 'deposit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge 
                    variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}