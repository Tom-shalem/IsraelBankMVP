import { LogOut, Building2 } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    console.log('User logging out...');
    logout()
    navigate("/login")
  }

  const handleHomeClick = () => {
    navigate("/")
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHomeClick}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-blue-600">Israel</span>
              <span className="text-xl font-bold text-gray-800">Bank</span>
            </div>
          </div>
          <div className="w-6 h-4 bg-gradient-to-b from-blue-500 via-white to-blue-500 rounded-sm border border-gray-300 shadow-sm"></div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}