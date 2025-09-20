import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Activity, ArrowUpRight, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { formatILSWithSymbol } from "@/utils/currency"

interface TransferLog {
  id: string
  timestamp: string
  action: 'transfer_initiated' | 'transfer_success' | 'transfer_failed' | 'validation_error'
  amount?: number
  recipientEmail?: string
  errorMessage?: string
  details: string
}

export function TransferLogs() {
  const [logs, setLogs] = useState<TransferLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load logs from localStorage
    const savedLogs = localStorage.getItem('transferLogs')
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs))
      } catch (error) {
        console.error('Error parsing transfer logs:', error)
      }
    }
    setIsLoading(false)

    // Listen for new transfer logs
    const handleNewLog = (event: CustomEvent<TransferLog>) => {
      const newLog = event.detail
      setLogs(prevLogs => {
        const updatedLogs = [newLog, ...prevLogs].slice(0, 50) // Keep only last 50 logs
        localStorage.setItem('transferLogs', JSON.stringify(updatedLogs))
        return updatedLogs
      })
    }

    window.addEventListener('transferLog', handleNewLog as EventListener)
    return () => {
      window.removeEventListener('transferLog', handleNewLog as EventListener)
    }
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'transfer_success':
        return <CheckCircle className="h-4 w-4" />
      case 'transfer_failed':
      case 'validation_error':
        return <XCircle className="h-4 w-4" />
      case 'transfer_initiated':
        return <Clock className="h-4 w-4" />
      default:
        return <ArrowUpRight className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'transfer_success':
        return 'bg-green-100 text-green-600'
      case 'transfer_failed':
      case 'validation_error':
        return 'bg-red-100 text-red-600'
      case 'transfer_initiated':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getBadgeVariant = (action: string) => {
    switch (action) {
      case 'transfer_success':
        return 'default'
      case 'transfer_failed':
      case 'validation_error':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">Loading transfer logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Transfer Activity</h3>
      </div>
      
      {logs.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No transfer activity yet</p>
          <p className="text-sm text-gray-400">Transfer actions will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">
                    {log.details}
                  </p>
                  {log.amount && (
                    <p className="text-sm text-gray-600 mt-1">
                      Amount: {formatILSWithSymbol(log.amount)}
                    </p>
                  )}
                  {log.recipientEmail && (
                    <p className="text-sm text-gray-600 mt-1">
                      To: {log.recipientEmail}
                    </p>
                  )}
                  {log.errorMessage && (
                    <p className="text-sm text-red-600 mt-1">
                      Error: {log.errorMessage}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {formatTimestamp(log.timestamp)}
                  </p>
                </div>
              </div>
              <div className="ml-3">
                <Badge
                  variant={getBadgeVariant(log.action)}
                  className="text-xs"
                >
                  {log.action.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}