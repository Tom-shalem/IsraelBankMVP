import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/useToast"
import { transferMoney } from "@/api/banking"
import { Send, Loader2 } from "lucide-react"

interface TransferFormProps {
  onTransferComplete: () => void
}

export function TransferForm({ onTransferComplete }: TransferFormProps) {
  const [recipientEmail, setRecipientEmail] = useState("")
  const [amount, setAmount] = useState("500")
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

    const transferAmount = parseFloat(amount)
    if (transferAmount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await transferMoney(recipientEmail, transferAmount)
      
      toast({
        title: "Success",
        description: `Successfully transferred ₪${transferAmount.toFixed(2)} to ${recipientEmail}`,
      })
      
      setRecipientEmail("")
      setAmount("500")
      onTransferComplete()
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Transfer Money</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="recipient" className="text-gray-600 text-sm">
            Send To (email)
          </Label>
          <Input
            id="recipient"
            type="email"
            placeholder="amit@client.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount" className="text-gray-600 text-sm">
              Amount (ILS)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="500.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Transfer
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          * No CSRF protection (for demo purposes).
        </p>
      </form>
    </div>
  )
}