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

export function setTotal(payload: any, accountsRaw: Record<string, any>, forceTotal?: number): any {
  /**
   * 1) Clean checking/savings/credit to real numbers
   * 2) Force total to always be 110,000 as requested
   * 3) Spread total to various common keys to catch card bindings
   */
  const ch = toFloat(accountsRaw.checking || 0);
  const sv = toFloat(accountsRaw.savings || 0);
  const cr = toFloat(accountsRaw.credit || 0);

  // Always force total to be 110,000 as requested by user
  const total = 110000.0;
  const fmt = formatILS(total);

  // Update accounts to clean numbers (so they don't throw NaN)
  payload.accounts = { checking: ch, savings: sv, credit: cr };

  // Common field names that cards use
  const totalFields = ["total", "total_balance", "combined_balance", "combinedBalance"];
  totalFields.forEach(field => {
    payload[field] = total;
  });

  // Nested structures
  if (!payload.overview) payload.overview = {};
  payload.overview.totalBalance = total;
  payload.overview.totalBalanceFormatted = fmt;

  payload.summary = { total, combined: total };
  payload.totals = { all: total };
  payload.kpis = {
    total: {
      value: total,
      formatted: fmt
    }
  };
  payload.total_formatted = fmt;

  return payload;
}