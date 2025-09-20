// Utility function to get display name from email
export const getDisplayName = (email: string): string => {
  const emailToNameMap: Record<string, string> = {
    'client@client.com': 'client',
    'amit@client.com': 'Amit',
  };
  
  // Return mapped name if exists, otherwise fall back to email prefix
  return emailToNameMap[email] || email.split('@')[0];
};