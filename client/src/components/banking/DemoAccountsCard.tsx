import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, User } from "lucide-react";

export function DemoAccountsCard() {
  const demoAccounts = [
    { email: "client@client.com", password: "Client2025$", description: "Primary demo account" },
    { email: "amit@client.com", password: "Client2025$", description: "Secondary demo account" }
  ];

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Info className="h-5 w-5" />
          Demo Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoAccounts.map((account, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <User className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{account.email}</p>
                <p className="text-sm text-gray-600">Password: {account.password}</p>
                <p className="text-xs text-gray-500">{account.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}