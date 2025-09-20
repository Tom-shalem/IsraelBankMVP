import { Dashboard } from "@/pages/Dashboard"
import { Header } from "./Header"
import { Footer } from "./Footer"

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <div className="pt-16 pb-16">
        <main className="container mx-auto px-6 py-8">
          <Dashboard />
        </main>
      </div>
      <Footer />
    </div>
  )
}