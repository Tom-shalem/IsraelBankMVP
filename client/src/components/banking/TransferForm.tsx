import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { useBanking } from "@/hooks/useBanking";
import { useToast } from "@/hooks/useToast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransferFormProps {
  onTransferComplete: () => void;
}

export function TransferForm({ onTransferComplete }: TransferFormProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { transferMoney, profile } = useBanking();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (profile && transferAmount > profile.accounts.checking) {
      toast({
        title: "Insufficient Funds",
        description: `You only have ₪${profile.accounts.checking.toFixed(2)} available in your checking account`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await transferMoney(recipientEmail, transferAmount);

      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ₪${transferAmount.toFixed(2)} to ${recipientEmail}`,
      });
      
      setRecipientEmail("");
      setAmount("");
      onTransferComplete();
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "An error occurred during the transfer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedRecipients = [
    "amit@client.com",
    "admin@bank.com",
    "client@client.com"
  ].filter(email => email !== profile?.me);

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Send className="h-5 w-5" />
          Transfer Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {profile && profile.accounts.checking <= 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Insufficient funds in checking account. Current balance: ₪{profile.accounts.checking.toFixed(2)}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-orange-800 font-medium">
              Recipient Email
            </Label>
            <Input
              id="recipient"
              type="email"
              placeholder="Enter recipient's email address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              disabled={isLoading}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
            
            {/* Quick select buttons for demo accounts */}
            <div className="flex flex-wrap gap-2 mt-2">
              <p className="text-xs text-orange-700 w-full mb-1">Quick select:</p>
              {suggestedRecipients.map((email) => (
                <Button
                  key={email}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRecipientEmail(email)}
                  disabled={isLoading}
                  className="text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  {email.split('@')[0]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-orange-800 font-medium">
              Amount (ILS)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-medium">
                ₪
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={profile?.accounts.checking || 999999}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="pl-8 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
            
            {profile && (
              <p className="text-xs text-orange-700">
                Available balance: ₪{profile.accounts.checking.toFixed(2)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5"
            disabled={isLoading || (profile && profile.accounts.checking <= 0)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transfer...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Transfer Money
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}