import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Key } from "lucide-react"

export function DemoAccountsCard() {
  const demoAccounts = [
    {
      email: "client@client.com",
      password: "Client2025$",
      description: "Primary demo account"
    },
    {
      email: "amit@client.com", 
      password: "Client2025$",
      description: "Secondary demo account"
    },
    {
      email: "admin@bank.com",
      password: "Admin2025$",
      description: "Admin account"
    }
  ]

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-800">
          <Users className="h-5 w-5" />
          Demo Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoAccounts.map((account, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">{account.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-600" />
                  <Badge variant="outline" className="text-xs font-mono">
                    {account.password}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{account.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-4 text-center">
          Use these credentials to test money transfers between accounts
        </p>
      </CardContent>
    </Card>
  )
}