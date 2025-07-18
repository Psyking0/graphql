import { renderProfile } from './render.js';
import { setupProfile } from './setup.js';

export const Profile = {
  render(app) {
    app.innerHTML = renderProfile();
  },

  async setup() {
    await setupProfile();
  }
}; 