interface RawTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  description: string;
  recipientEmail?: string;
  senderEmail?: string;
  dir?: string;
  direction?: string;
  peer?: string;
  from?: string;
  to?: string;
}

interface NormalizedTransaction {
  id: string;
  incoming: boolean;
  peer: string;
  amount: number;
  signedAmount: number;
  sign: '+' | '-';
  class: 'pos' | 'neg';
  label: 'Received from' | 'Sent to';
  date: string;
  description: string;
  raw: RawTransaction;
}

export const normalizeTransaction = (me: string, transaction: RawTransaction): NormalizedTransaction => {
  const amt = Math.abs(transaction.amount || 0);
  
  // Determine transaction direction
  let incoming = false;
  
  if (transaction.dir?.toLowerCase() === 'in' || transaction.direction?.toLowerCase() === 'in') {
    incoming = true;
  } else if (transaction.dir?.toLowerCase() === 'out' || transaction.direction?.toLowerCase() === 'out') {
    incoming = false;
  } else if (transaction.to && me) {
    incoming = (transaction.to === me);
  } else if (transaction.from && me) {
    incoming = (transaction.from !== me);
  } else if (transaction.type === 'transfer_received') {
    incoming = true;
  } else if (transaction.type === 'transfer_sent') {
    incoming = false;
  } else {
    // Default: positive amount = incoming, negative = outgoing
    incoming = (transaction.amount >= 0);
  }
  
  // Identify the peer
  let peer = transaction.peer;
  if (!peer) {
    if (incoming) {
      peer = transaction.from || transaction.senderEmail;
    } else {
      peer = transaction.to || transaction.recipientEmail;
    }
  }
  if (!peer) {
    peer = 'Unknown';
  }
  
  const sign: '+' | '-' = incoming ? '+' : '-';
  const clazz: 'pos' | 'neg' = incoming ? 'pos' : 'neg';
  const label: 'Received from' | 'Sent to' = incoming ? 'Received from' : 'Sent to';
  const signedAmount = incoming ? amt : -amt;
  
  return {
    id: transaction.id,
    incoming,
    peer,
    amount: amt,
    signedAmount,
    sign,
    class: clazz,
    label,
    date: transaction.date,
    description: transaction.description,
    raw: transaction
  };
};

export const buildRecentTransactions = (me: string, transactions: RawTransaction[]): NormalizedTransaction[] => {
  if (!Array.isArray(transactions)) {
    return [];
  }
  return transactions.map(tx => normalizeTransaction(me, tx));
};