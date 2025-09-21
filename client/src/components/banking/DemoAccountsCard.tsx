import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Mail } from "lucide-react";

interface DemoAccountsCardProps {
  onUserSwitch: (email: string) => void;
  currentUser: string;
  availableUsers: string[];
}

export function DemoAccountsCard({ onUserSwitch, currentUser, availableUsers }: DemoAccountsCardProps) {
  const demoUsers = [
    {
      email: "client@client.com",
      name: "Client User",
      description: "Primary demo account with substantial balances",
      role: "Customer"
    },
    {
      email: "amit@client.com", 
      name: "Amit Client",
      description: "Secondary demo account for transfer testing",
      role: "Customer"
    },
    {
      email: "admin@bank.com",
      name: "Bank Admin",
      description: "Administrative account with elevated privileges",
      role: "Admin"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <Users className="h-5 w-5" />
          Demo Accounts
          <Badge variant="secondary" className="ml-2">
            Switch Users
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-indigo-700 mb-4">
            Switch between demo accounts to test transfers and view different perspectives:
          </p>
          
          {demoUsers.map((user) => (
            <div
              key={user.email}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                currentUser === user.email
                  ? 'bg-indigo-100 border-indigo-300 shadow-md'
                  : 'bg-white/70 border-gray-200 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                  {currentUser === user.email ? (
                    <UserCheck className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Mail className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <Badge 
                      variant={user.role === 'Admin' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.description}</p>
                </div>
              </div>
              
              {currentUser === user.email ? (
                <Badge variant="default" className="bg-indigo-600">
                  Current
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUserSwitch(user.email)}
                  className="hover:bg-indigo-50 hover:border-indigo-300"
                >
                  Switch
                </Button>
              )}
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> All demo accounts use password "Client2025$" for testing purposes.
              Transfers between accounts are processed instantly with real-time balance updates.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}