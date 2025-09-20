import { toFloat, normalizeAccounts } from './currency';

interface User {
  accounts: Record<string, any>;
  tx?: Transaction[];
}

interface Transaction {
  id?: string;
  dir: 'in' | 'out';
  peer: string;
  amount: number;
  ts: string;
  type?: string;
  description?: string;
  date?: string;
  recipientEmail?: string;
  senderEmail?: string;
}

interface State {
  users: Record<string, User>;
}

function ensureTx(user: User): User {
  if (!user.tx) {
    user.tx = [];
  }
  return user;
}

export function transferMoney(
  state: State, 
  sender: string, 
  receiver: string, 
  amountInput: any
): void {
  const users = state.users;
  const s = ensureTx(users[sender]);
  const r = ensureTx(users[receiver]);

  // Clean amount
  const amount = toFloat(amountInput, 0.0);
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  // Ensure checking as number
  const sAccounts = normalizeAccounts(s.accounts);
  const rAccounts = normalizeAccounts(r.accounts);

  if (sAccounts.checking < amount) {
    throw new Error("Insufficient funds");
  }

  // Update balances in original memory
  s.accounts.checking = sAccounts.checking - amount;
  r.accounts.checking = rAccounts.checking + amount;

  // Record to recent
  const ts = new Date().toISOString();
  const transactionId = Date.now().toString();

  s.tx!.unshift({
    id: `${transactionId}-sender`,
    dir: "out",
    peer: receiver,
    amount: amount,
    ts: ts,
    type: 'transfer_sent',
    description: `Transfer to ${receiver}`,
    date: ts,
    recipientEmail: receiver,
    senderEmail: sender
  });

  r.tx!.unshift({
    id: `${transactionId}-recipient`,
    dir: "in",
    peer: sender,
    amount: amount,
    ts: ts,
    type: 'transfer_received',
    description: `Transfer from ${sender}`,
    date: ts,
    recipientEmail: receiver,
    senderEmail: sender
  });
}

export function recentForUser(state: State, me: string, limit: number = 10): Transaction[] {
  const user = ensureTx(state.users[me]);
  return user.tx!.slice(0, limit);
}

export function buildDashboardPayload(state: State, me: string): {
  accounts: Record<string, number>;
  total: number;
  transactions: Transaction[];
  me: string;
} {
  const user = ensureTx(state.users[me]);
  const accounts = normalizeAccounts(user.accounts);
  const total = accounts.checking + accounts.savings + accounts.credit;
  const transactions = recentForUser(state, me);

  return {
    accounts,
    total,
    transactions,
    me,
  };
}