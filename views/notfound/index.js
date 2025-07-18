export const NotFound = {
  render(app) {
    app.innerHTML = `
      <div class="notfound-container">
        <div class="notfound-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <a data-link href="/profile" class="back-btn">Go Back Home</a>
        </div>
      </div>
    `;
  }
}; 