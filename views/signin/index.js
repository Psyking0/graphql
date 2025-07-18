import { browse } from '../../app.js';
import { Signin as SigninFunc } from '../../tools.js';

export const Signin = {
  render(app) {
    app.innerHTML = `
      <div class="signin-container">
        <div class="signin-card">
          <h1>Login</h1>
          <form id="signin-form">
            <div class="form-group">
              <label for="identifier">Username or Email</label>
              <input type="text" id="identifier" placeholder="Enter your username or email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required>
            </div>
            <button type="submit" id="signin-btn">Sign In</button>
          </form>
          <div id="error-msg" class="error-message"></div>
        </div>
      </div>
    `;
  },

  setup() {
    const form = document.getElementById("signin-form");
    const errorMsg = document.getElementById("error-msg");

    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const id = document.getElementById("identifier").value.trim();
      const pw = document.getElementById("password").value.trim();
      
      if (!id || !pw) {
        errorMsg.textContent = "Please fill in all fields";
        return;
      }

      const submitBtn = document.getElementById("signin-btn");
      
      try {
        submitBtn.textContent = "Signing in...";
        submitBtn.disabled = true;
        errorMsg.textContent = "";

        await SigninFunc(id, pw);
        browse("/profile");
      } catch (err) {
        errorMsg.textContent = err.message || "Login failed. Please try again.";
        submitBtn.textContent = "Sign In";
        submitBtn.disabled = false;
      }
    };
  }
}; 