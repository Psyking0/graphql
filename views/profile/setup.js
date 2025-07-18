import { graphqlRequest } from '../../tools.js';
import { PROFILE_QUERIES } from '../../queries/profileQueries.js';
import { XPChart } from './charts/xpChart.js';
import { PieChart } from './charts/pieChart.js';
import { DataFormatter } from './utils/dataFormatter.js';
import { renderUserInfo, renderRecentActivity, renderProjects } from './render.js';

export async function setupProfile() {
  try {
    // Show loading state
    document.getElementById('user-info').innerHTML = '<p>Loading...</p>';
    
    // Fetch detailed profile data
    const data = await graphqlRequest(PROFILE_QUERIES.detailedProfile);
    
    if (!data || !data.user || !data.user.length) {
      throw new Error('No user data available');
    }

    const user = data.user[0];
    console.log("user", user);
    const transactions = data.xp?.aggregate?.sum?.amount || 0;
    console.log("transactions",transactions);
    
    // Use auditRatio from user data instead of calculating from aggregates
    const auditRatio = user.auditRatio || 0;
    const succeeded = Math.floor((user.totalUp - user.totalUpBonus) / 1000);
    const failed = Math.floor(user.totalDown / 1000);
    console.log("Before auditStats setup");
    console.log("typeof user.totalUp:", typeof user.totalUp);
    console.log("typeof user.totalDown:", typeof user.totalDown);
    const auditStats = {
      ratio: auditRatio,
      ratioFormatted: DataFormatter.formatAuditRatio(auditRatio),
      succeeded: succeeded,
      failed: failed
    };
    console.log("auditStats",auditStats)
    
    const level = DataFormatter.formatLevel(data.level);
    const campus = DataFormatter.formatCampus(user.campus);

    // Update user info section
    document.getElementById('user-info').innerHTML = renderUserInfo(user);

    // Update statistics
    document.getElementById('total-xp').textContent = DataFormatter.formatXP(transactions);
    document.getElementById('user-level').textContent = level;
    document.getElementById('audit-ratio').textContent = auditStats.ratioFormatted;
    document.getElementById('user-campus').textContent = campus;

    // Initialize charts
    await initializeCharts(auditStats);

    // Use the correct structure for project transactions
    const projectTransactions = data.projects && Array.isArray(data.projects) && data.projects[0]?.transactions
      ? data.projects[0].transactions
      : [];
    console.log("projectTransactions", projectTransactions);
    // console.log("projectD", data.projects[0].transactions.object.progresses.group.members.userLogin);
    
    // Update recent activity 
    document.getElementById('recent-activity').innerHTML =
      renderRecentActivity(projectTransactions);

    // Update projects
    document.getElementById('projects-list').innerHTML =
      renderProjects(projectTransactions);

  } catch (error) {
    console.error('Error setting up profile:', error);
    document.getElementById('user-info').innerHTML = 
      `<p>Error loading profile: ${error.message}</p>`;
  }
}

// Initialize charts with data
async function initializeCharts(auditStats) {
  try {
    // Initialize XP Chart
    const xpChart = new XPChart('xp-chart');
    
    // Get XP transactions for the chart
    const xpTransactions = await graphqlRequest(PROFILE_QUERIES.xpTransactions);
    
    if (xpTransactions && xpTransactions.transaction) {
      // Sort transactions by date (oldest first for line chart)
      const sortedTransactions = DataFormatter.sortTransactionsByDate(
        xpTransactions.transaction, 
        true
      );

      // Draw bar chart
      xpChart.drawBarChart(sortedTransactions);
    }

    // Initialize Pie Chart for audit results
    const pieChart = new PieChart('pie-chart');
    
    if (auditStats.succeeded === 0 && auditStats.failed === 0) {
      document.getElementById('pie-chart').innerHTML =
        '<text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">No audit data</text>';
      return;
    }
    pieChart.drawAuditPieChart(auditStats.succeeded, auditStats.failed);

  } catch (error) {
    console.error('Error initializing charts:', error);
    // Show error in chart containers
    document.getElementById('xp-chart').innerHTML = 
      '<text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Chart Error</text>';
    document.getElementById('pie-chart').innerHTML = 
      '<text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Chart Error</text>';
  }
} 