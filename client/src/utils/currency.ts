export const formatILS = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}

export const formatILSWithSymbol = (amount: number): string => {
  const formatted = formatILS(amount)
  return `₪${formatted}`
}

export const parseILS = (value: string): number => {
  // Remove currency symbol and parse
  const cleaned = value.replace(/[₪,\s]/g, '')
  return parseFloat(cleaned) || 0
}