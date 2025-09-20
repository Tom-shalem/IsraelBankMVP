interface TransferLog {
  id: string
  timestamp: string
  action: 'transfer_initiated' | 'transfer_success' | 'transfer_failed' | 'validation_error'
  amount?: number
  recipientEmail?: string
  errorMessage?: string
  details: string
}

export const logTransferAction = (
  action: TransferLog['action'],
  details: string,
  options?: {
    amount?: number
    recipientEmail?: string
    errorMessage?: string
  }
) => {
  const log: TransferLog = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    ...options
  }

  // Dispatch custom event to notify TransferLogs component
  const event = new CustomEvent('transferLog', { detail: log })
  window.dispatchEvent(event)
}