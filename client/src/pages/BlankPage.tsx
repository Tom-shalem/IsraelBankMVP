import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Home } from "lucide-react"

export function BlankPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-10 w-10 text-blue-600" />
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-blue-600">Israel</span>
              <span className="text-2xl font-bold text-gray-800">Bank</span>
            </div>
            <div className="w-8 h-6 bg-gradient-to-b from-blue-500 via-white to-blue-500 rounded-sm border border-gray-300 shadow-sm"></div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}