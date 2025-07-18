import { Signin } from './views/signin/index.js';
import { Profile } from './views/profile/index.js';
import { NotFound } from './views/notfound/index.js';
import { Signout } from './tools.js';

const Views = {
  '/': { setup: () => browse('/profile') },
  '/signin': Signin,
  '/profile': Profile,
  '/signout': { setup: Signout }
};

export function browse(path) {
  history.pushState({}, "", path);
  route(path);
}

function route(path) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const View = Views[path] || NotFound;
  View.render?.(app);
  View.setup?.();
}

// Check authentication and redirect accordingly
function checkAuthAndRoute() {
  const jwt = localStorage.getItem("jwt");
  const currentPath = location.pathname;

  // If user is authenticated and trying to access signin, redirect to profile
  if (jwt && currentPath === '/signin') {
    console.log("User is authenticated, redirecting to profile...");
    browse('/profile');
    return;
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to signin
  if (!jwt && currentPath !== '/signin') {
    browse('/signin');
    return;
  }
  
  // If user is authenticated and accessing profile or signout, allow
  if (jwt && (currentPath === '/profile' || currentPath === '/signout')) {
    route(currentPath);
    return;
  }
  
  // Default: route normally
  route(currentPath);
}

window.onpopstate = () => checkAuthAndRoute();
window.onload = () => checkAuthAndRoute();

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    browse(e.target.getAttribute('href'));
  }
}); 