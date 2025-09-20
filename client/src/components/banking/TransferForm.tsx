import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { transferMoney } from "@/api/banking"
import { Send, Loader2 } from "lucide-react"
import { logTransferAction } from "@/utils/transferLogger"

interface TransferFormProps {
  onTransferSuccess: () => void
}

export function TransferForm({ onTransferSuccess }: TransferFormProps) {
  const [recipientEmail, setRecipientEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recipientEmail || !amount) {
      const errorMsg = "Please fill in all fields"
      logTransferAction('validation_error', errorMsg, {
        recipientEmail: recipientEmail || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        errorMessage: errorMsg
      })
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    const transferAmount = parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      const errorMsg = "Please enter a valid amount"
      logTransferAction('validation_error', errorMsg, {
        recipientEmail,
        amount: transferAmount,
        errorMessage: errorMsg
      })
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      logTransferAction('transfer_initiated', `Transfer initiated to ${recipientEmail}`, {
        amount: transferAmount,
        recipientEmail
      })

      await transferMoney({
        recipientEmail,
        amount: transferAmount,
      })

      logTransferAction('transfer_success', `Successfully transferred to ${recipientEmail}`, {
        amount: transferAmount,
        recipientEmail
      })

      toast({
        title: "Success",
        description: `Successfully transferred ₪${transferAmount.toFixed(2)} to ${recipientEmail}`,
      })

      setRecipientEmail("")
      setAmount("")
      onTransferSuccess()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transfer failed"
      
      logTransferAction('transfer_failed', `Transfer failed to ${recipientEmail}`, {
        amount: transferAmount,
        recipientEmail,
        errorMessage
      })

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-600" />
          Transfer Money
        </CardTitle>
        <CardDescription>
          Send money to another account instantly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="Enter recipient's email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              disabled={isLoading}
              className="bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ILS)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              className="bg-white/50"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
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
  )
}