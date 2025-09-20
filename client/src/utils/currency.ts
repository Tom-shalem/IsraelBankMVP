// Utility function to format ILS currency with apostrophes as thousand separators
export const formatILS = (amount: number): string => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};