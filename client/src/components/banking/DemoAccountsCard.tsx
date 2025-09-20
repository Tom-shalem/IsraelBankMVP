import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Copy, Check } from "lucide-react";
import { getDemoAccounts } from "@/api/banking";
import { useToast } from "@/hooks/useToast";

interface DemoAccount {
  email: string;
  password: string;
  name: string;
}

export function DemoAccountsCard() {
  const [accounts, setAccounts] = useState<DemoAccount[]>([]);
  const [copiedField, setCopiedField] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const loadDemoAccounts = async () => {
      try {
        const response = await getDemoAccounts() as { accounts: DemoAccount[] };
        setAccounts(response.accounts);
      } catch (error) {
        console.error('Failed to load demo accounts:', error);
      }
    };

    loadDemoAccounts();
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Users className="h-5 w-5 text-blue-600" />
          Demo Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="font-medium text-gray-800">{account.name}</div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-white px-2 py-1 rounded">
                    {account.email}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.email, `Email-${index}`)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedField === `Email-${index}` ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Password:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-white px-2 py-1 rounded">
                    {account.password}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.password, `Password-${index}`)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedField === `Password-${index}` ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}