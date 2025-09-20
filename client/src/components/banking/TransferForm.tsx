import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/useToast"
import { transferMoney } from "@/api/banking"
import { Send, Loader2, ArrowRight, DollarSign } from "lucide-react"

interface TransferFormProps {
  onTransferSuccess?: () => void
}

export function TransferForm({ onTransferSuccess }: TransferFormProps) {
  const [recipientEmail, setRecipientEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recipientEmail || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await transferMoney({
        recipientEmail,
        amount: numAmount,
      })

      toast({
        title: "Transfer Successful",
        description: response.message,
      })

      // Clear form
      setRecipientEmail("")
      setAmount("")
      
      // Trigger refresh of balances and transaction history
      if (onTransferSuccess) {
        onTransferSuccess()
      }

      // Trigger a custom event to refresh transfer logs
      window.dispatchEvent(new CustomEvent('transferCompleted'))
      
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Send className="h-5 w-5 text-green-600" />
          Send Money
        </CardTitle>
        <p className="text-sm text-gray-600">Transfer funds to another account</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
              Recipient Email
            </Label>
            <Input
              id="recipient"
              type="email"
              placeholder="Enter recipient's email address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              disabled={isLoading}
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount (₪)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="pl-10 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transfer...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Send Transfer
              </>
            )}
          </Button>
        </form>

        {/* Quick Transfer Suggestions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Transfer To:</p>
          <div className="flex flex-wrap gap-2">
            {['amit@client.com', 'admin@bank.com'].map((email) => (
              <Button
                key={email}
                variant="outline"
                size="sm"
                onClick={() => setRecipientEmail(email)}
                disabled={isLoading}
                className="text-xs bg-white/60 hover:bg-blue-50 border-gray-200 hover:border-blue-300 transition-all duration-200"
              >
                {email}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}