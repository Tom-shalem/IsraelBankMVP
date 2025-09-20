// Utility function to format ILS currency with commas as thousand separators
export const formatILS = (amount: number): string => {
  return Math.round(amount).toLocaleString('en-US');
};