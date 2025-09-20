import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Copy } from "lucide-react"
import { useToast } from "@/hooks/useToast"

export function DemoAccountsCard() {
  const { toast } = useToast()

  const demoAccounts = [
    {
      email: "client@client.com",
      password: "Client2025$",
      description: "Primary demo account with substantial balances"
    },
    {
      email: "amit@client.com", 
      password: "Client2025$",
      description: "Secondary demo account for transfer testing"
    },
    {
      email: "admin@bank.com",
      password: "Admin2025$",
      description: "Admin account with elevated privileges"
    }
  ]

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Users className="h-5 w-5 text-blue-600" />
          Demo Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoAccounts.map((account, index) => (
            <div key={index} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {account.email.includes('admin') ? 'Admin' : 'User'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      {account.email}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.email, "Email")}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Copy className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Password:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      {account.password}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.password, "Password")}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Copy className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{account.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}