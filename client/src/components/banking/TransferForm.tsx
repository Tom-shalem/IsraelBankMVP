import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/useToast"
import { transferMoney } from "@/api/banking"
import { Send, Loader2 } from "lucide-react"

const transferSchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email address"),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be a positive number"
  ),
})

type TransferFormData = z.infer<typeof transferSchema>

interface TransferFormProps {
  onTransferComplete: () => void
}

export function TransferForm({ onTransferComplete }: TransferFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  })

  const onSubmit = async (data: TransferFormData) => {
    setIsLoading(true)

    try {
      const result = await transferMoney(data.recipientEmail, Number(data.amount))
      toast({
        title: "Transfer Successful",
        description: `₪${data.amount} transferred to ${data.recipientEmail}`,
      })
      reset()
      onTransferComplete()
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Transfer failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Send className="h-5 w-5 text-blue-600" />
          Transfer Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail" className="text-gray-700">
              Recipient Email
            </Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="Enter recipient's email"
              className="bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register("recipientEmail")}
            />
            {errors.recipientEmail && (
              <p className="text-sm text-red-600">{errors.recipientEmail.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700">
              Amount (₪)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              className="bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
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
                Transfer
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}