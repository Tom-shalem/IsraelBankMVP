import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import { transferMoney } from "@/api/banking";
import { useToast } from "@/hooks/useToast";

const transferSchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email address"),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number")
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onTransferSuccess: () => void;
}

export function TransferForm({ onTransferSuccess }: TransferFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema)
  });

  const onSubmit = async (data: TransferFormData) => {
    console.log('Transfer form submitted:', data);
    setIsLoading(true);
    
    try {
      const result = await transferMoney({
        recipientEmail: data.recipientEmail,
        amount: parseFloat(data.amount)
      });
      
      console.log('Transfer successful:', result);
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ₪${parseFloat(data.amount).toFixed(2)} to ${data.recipientEmail}`,
      });
      
      reset();
      onTransferSuccess();
    } catch (error) {
      console.error('Transfer failed:', error);
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "An error occurred during transfer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              className="bg-white/50 border-gray-300 focus:border-blue-500"
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
              min="0.01"
              placeholder="0.00"
              className="bg-white/50 border-gray-300 focus:border-blue-500"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
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
  );
}