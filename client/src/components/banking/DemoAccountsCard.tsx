import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

const DEMO_ACCOUNTS = [
  {
    email: "client@client.com",
    password: "Client2025$",
    description: "Primary demo account with substantial balances"
  },
  {
    email: "amit@client.com", 
    password: "Client2025$",
    description: "Secondary demo account for transfer testing"
  }
];

export function DemoAccountsCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Users className="h-5 w-5" />
          Demo Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {DEMO_ACCOUNTS.map((account, index) => (
          <div key={index} className="p-4 bg-white/70 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                Demo Account {index + 1}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Email:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {account.email}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.email, "Email")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "Email" ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Password:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {account.password}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.password, "Password")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "Password" ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {account.description}
              </p>
            </div>
          </div>
        ))}
        <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <strong>Note:</strong> These are demo credentials for testing purposes. 
          Use them to explore the banking features and test money transfers between accounts.
        </div>
      </CardContent>
    </Card>
  );
}