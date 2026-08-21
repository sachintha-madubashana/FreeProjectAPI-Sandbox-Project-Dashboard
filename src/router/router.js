import dashboardPage from "@/pages/dashboard.js";
import busBookingPage from "@/pages/busBooking.js";

const routes = {
  "/": dashboardPage,
  "/bus-booking": busBookingPage,
};

export function router() {
  const path = window.location.pathname;
  const page = routes[path];
  const pageContent = document.querySelector("#pageContent");

  if (!page) {
    pageContent.innerHTML = `
      <h1>404</h1>
      <p>Page not found.</p>
    `;
    return;
  }

  pageContent.replaceChildren(page());
}

export function navigate(path) {
  history.pushState({}, "", path);
  router();
}

export function startRouter() {
  window.addEventListener("popstate", router);
  router();
}
