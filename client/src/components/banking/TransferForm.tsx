import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
    defaultValues: {
      recipientEmail: "",
      amount: "500"
    }
  })

  const onSubmit = async (data: TransferFormData) => {
    setIsLoading(true)

    try {
      const result = await transferMoney(data.recipientEmail, Number(data.amount))
      toast({
        title: "Transfer Successful",
        description: `₪${data.amount} transferred to ${data.recipientEmail}`,
      })
      reset({ recipientEmail: "", amount: "500" })
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
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Send className="h-5 w-5 text-blue-600" />
        Transfer Money
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipientEmail" className="text-gray-600 text-sm">
            Send To (email)
          </Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="amit@client.com"
            className="w-full bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            {...register("recipientEmail")}
          />
          {errors.recipientEmail && (
            <p className="text-sm text-red-600">{errors.recipientEmail.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-600 text-sm">
              Amount (ILS)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              className="bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg border-0 md:self-end"
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
        </div>

        <p className="text-gray-500 text-xs mt-3">
          * No CSRF protection (for later demo).
        </p>
      </form>
    </div>
  )
}