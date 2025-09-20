import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Wallet } from "lucide-react"

export function DemoAccountsCard() {
  const demoAccounts = [
    {
      name: "David Cohen",
      email: "client@client.com",
      password: "Client2025$",
      balances: {
        checking: "₪15,420.50",
        savings: "₪8,750.25",
        credit: "-₪2,340.75"
      }
    },
    {
      name: "Amit Levy", 
      email: "amit@client.com",
      password: "Client2025$",
      balances: {
        checking: "₪7,890.00",
        savings: "₪12,500.00",
        credit: "-₪890.50"
      }
    }
  ]

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Users className="h-5 w-5 text-blue-600" />
          Demo Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoAccounts.map((account, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-800">{account.name}</h3>
              <p className="text-sm text-gray-600">{account.email}</p>
              <p className="text-xs text-gray-500">Password: {account.password}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <Wallet className="h-3 w-3" />
                  Checking
                </span>
                <span className="font-medium text-green-600">{account.balances.checking}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <Wallet className="h-3 w-3" />
                  Savings
                </span>
                <span className="font-medium text-green-600">{account.balances.savings}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <CreditCard className="h-3 w-3" />
                  Credit
                </span>
                <span className="font-medium text-red-600">{account.balances.credit}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}