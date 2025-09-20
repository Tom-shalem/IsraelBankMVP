// Utility function to format ILS currency with commas as thousand separators and 2 decimal places
export const formatILS = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Format currency with ₪ symbol
export const formatILSWithSymbol = (amount: number): string => {
  return `₪${formatILS(amount)}`;
};