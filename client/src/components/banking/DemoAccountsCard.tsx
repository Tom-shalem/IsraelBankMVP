import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail } from "lucide-react"

export function DemoAccountsCard() {
  const demoAccounts = [
    { email: 'client@client.com', password: 'Client2025$', role: 'Primary Demo Account' },
    { email: 'amit@client.com', password: 'Client2025$', role: 'Secondary Demo Account' }
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Users className="h-5 w-5 text-blue-600" />
          Demo Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoAccounts.map((account, index) => (
          <div key={index} className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-800">{account.email}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Password: <code className="bg-gray-100 px-1 rounded">{account.password}</code>
            </div>
            <Badge variant="secondary" className="text-xs">
              {account.role}
            </Badge>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
          💡 You can transfer money between these demo accounts to test the functionality
        </div>
      </CardContent>
    </Card>
  )
}