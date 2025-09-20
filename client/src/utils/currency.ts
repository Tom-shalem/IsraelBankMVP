const CURRENCY_RE = /[^\d\-\.+]/g; // Remove ₪, commas, spaces, etc.

export function toFloat(x: any, defaultValue: number = 0.0): number {
  if (x === null || x === undefined) {
    return defaultValue;
  }
  if (typeof x === 'number') {
    return x;
  }
  const s = String(x).trim();
  if (!s) {
    return defaultValue;
  }
  // Remove symbols/commas and keep +/- sign
  const cleaned = s.replace(CURRENCY_RE, "");
  try {
    return parseFloat(cleaned);
  } catch {
    return defaultValue;
  }
}

export function formatILS(amount: number | undefined | null): string {
  // Handle undefined, null, or invalid values
  if (amount === null || amount === undefined || isNaN(amount)) {
    amount = 0;
  }
  return `₪${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatILSWithSymbol(amount: number): string {
  return formatILS(amount);
}

export function normalizeAccounts(accounts: Record<string, any>): Record<string, number> {
  return {
    checking: toFloat(accounts.checking || 0),
    savings: toFloat(accounts.savings || 0),
    credit: toFloat(accounts.credit || 0),
  };
}

export function totalBalance(accountsNumeric: Record<string, number>): number {
  return accountsNumeric.checking + accountsNumeric.savings + accountsNumeric.credit;
}