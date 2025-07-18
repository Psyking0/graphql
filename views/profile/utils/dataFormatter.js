export class DataFormatter {
  // Format XP amount with commas
  static formatXP(amount) {
    if (!amount || typeof amount !== 'number') return '0 kB';
    return `${Math.floor(amount / 1000)} kB`;
  }
  
  // Format date in a readable format
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format audit ratio as percentage
  static formatAuditRatio(ratio) {
    if (ratio === null || ratio === undefined) return 'N/A';
    return `${ratio.toFixed(1)}%`;
  }

  // Calculate total XP from transactions
  static calculateTotalXP(transactions) {
    if (!transactions || !Array.isArray(transactions)) return 0;
    return transactions.reduce((total, tx) => total + (tx.amount || 0), 0);
  }

  // Sort transactions by date (newest first)
  static sortTransactionsByDate(transactions, ascending = false) {
    if (!transactions || !Array.isArray(transactions)) return [];
    
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  // Get user display name
  static getUserDisplayName(user) {
    if (!user) return 'Unknown User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.firstName) {
      return user.firstName;
    }
    
    return user.login || 'Unknown User';
  }

  // Format campus name
  static formatCampus(campus) {
    if (!campus) return 'N/A';
    
    // Convert campus code to readable name
    const campusMap = {
      'oujda': 'Oujda',
      'casablanca': 'Casablanca',
      'rabat': 'Rabat',
      'marrakech': 'Marrakech'
    };
    
    return campusMap[campus.toLowerCase()] || campus;
  }

  // Calculate audit statistics
  static calculateAuditStats(auditsSucceeded, auditsFailed) {
    const succeeded = auditsSucceeded?.aggregate?.count || 0;
    const failed = auditsFailed?.aggregate?.count || 0;
    const total = succeeded + failed;
    const ratio = total > 0 ? succeeded / total : 0;
    
    return {
      succeeded,
      failed,
      total,
      ratio,
      ratioFormatted: this.formatAuditRatio(ratio)
    };
  }

  // Format level information
  static formatLevel(levelData) {
    if (!levelData || !levelData.length) return 'N/A';
    return `Level ${levelData[0].amount}`;
  }

  // Get XP progress percentage
  static getXPProgress(currentXP, targetXP = 1000) {
    const percentage = Math.min((currentXP / targetXP) * 100, 100);
    return {
      percentage,
      formatted: `${percentage.toFixed(1)}%`,
      remaining: Math.max(targetXP - currentXP, 0)
    };
  }

  // Format phone number
  static formatPhone(phone) {
    if (!phone) return 'N/A';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  // Validate email format
  static isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Truncate text with ellipsis
  static truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Capitalize first letter
  static capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
} 