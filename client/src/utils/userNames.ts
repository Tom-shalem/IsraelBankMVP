export const getUserDisplayName = (email: string): string => {
  if (!email) return 'Unknown User'
  
  // Extract username from email
  const username = email.split('@')[0]
  
  // Capitalize first letter
  return username.charAt(0).toUpperCase() + username.slice(1)
}

export const formatUserForDisplay = (email: string): string => {
  const displayName = getUserDisplayName(email)
  return `${displayName} (${email})`
}