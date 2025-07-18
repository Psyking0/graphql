export function renderProfile() {
  return `
    <div class="profile-container">
      <header class="profile-header">
        <h1>My Dashboard</h1>
        <button data-link href="/signout" class="logout-btn">Logout</button>
      </header>

      <div class="profile-content">
        <!-- User Info Section -->
        <section class="user-info-section">
          <h2>User Information</h2>
          <div id="user-info" class="user-info-grid">
            <!-- User info will be populated here -->
          </div>
        </section>

        <!-- Statistics Section -->
        <section class="stats-section">
          <h2>Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total XP</h3>
              <div id="total-xp" class="stat-value">Loading...</div>
            </div>
            <div class="stat-card">
              <h3>Level</h3>
              <div id="user-level" class="stat-value">Loading...</div>
            </div>
            <div class="stat-card">
              <h3>Audit Ratio</h3>
              <div id="audit-ratio" class="stat-value">Loading...</div>
            </div>
            <div class="stat-card">
              <h3>Campus</h3>
              <div id="user-campus" class="stat-value">Loading...</div>
            </div>
          </div>
        </section>

        <!-- Charts Section -->
        <section class="charts-section">
          <h2>Charts & Analytics</h2>
          <div class="charts-grid">
            <div class="chart-container">
              <h3>XP Progress</h3>
              <div style="overflow-x: auto;">
                <svg id="xp-chart"  height="200" class="chart-svg"></svg>
              </div>
            </div>
            <div class="chart-container">
              <h3>Audit Results</h3>
              <svg id="pie-chart" width="200" height="250" class="chart-svg"></svg>
            </div>
          </div>
        </section>

        <!-- Recent Activity Section -->
        <section class="activity-section">
          <h2>Recent Activity</h2>
          <div id="recent-activity" class="activity-list">
            <!-- Recent activity will be populated here -->
          </div>
        </section>

        <!-- Projects Section -->
        <section class="projects-section">
          <h2>Projects</h2>
          <div id="projects-list" class="projects-grid">
            <!-- Projects will be populated here -->
          </div>
        </section>
      </div>
    </div>
  `;
}

// Render user info section
export function renderUserInfo(user) {
  if (!user) return '<p>User information not available</p>';
  
  return `
    <div class="user-info-card">
      <div class="user-avatar">
        <div class="avatar-placeholder">${user.login?.charAt(0).toUpperCase() || 'U'}</div>
      </div>
      <div class="user-details">
        <h3 class="user-name">${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.login}</h3>
        <p class="user-login">@${user.login}</p>
        ${user.email ? `<p class="user-email">${user.email}</p>` : ''}
        ${user.phone ? `<p class="user-phone">${user.phone}</p>` : ''}
      </div>
    </div>
  `;
}

// Render recent activity
export function renderRecentActivity(transactions) {
  if (!transactions || transactions.length === 0) {
    return '<p>No recent activity</p>';
  }

  const recentTransactions = transactions.slice(0, 5); // Show last 5 transactions
  console.log("recentTransactions",recentTransactions);
  return `
    <div class="activity-items">
      ${recentTransactions.map(tx => `
        <div class="activity-item">
          <div class="activity-icon">🎯</div>
            <div class="activity-title">${tx.object.name}</div>
          <div class="activity-title">+${tx.amount/1000}kb XP</div>
            <div class="activity-date">${new Date(tx.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Render projects list
export function renderProjects(projects) {
  if (!projects || projects.length === 0) {
    return '<p>No projects available</p>';
  }
  console.log("projects", projects);
  return `
    <div class="projects-items">
      ${projects.map(project => `
        <div class="project-card">
          <div class="project-header">
            <h4 class="project-name">${project.object?.name || 'Unknown Project'}</h4>
            <span class="project-type">${project.object?.type || 'project'}</span>
            
          </div>
          <div class="project-stats">
            <span class="project-xp">+${project.amount/1000}kb XP</span>
            <span class="project-date">${new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
} 