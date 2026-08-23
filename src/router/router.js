import { setPageTitle } from "@/components/header.js";
import { updateActiveItem } from "@/components/sideBar.js";
import dashboardPage from "@/pages/dashboard.js";
import busBookingPage from "@/pages/busBooking.js";
import goalTracker from "@/pages/goalTracker.js";
import templatePage from "@/pages/projectTemp.js";
import data from "@/assets/data.json" with { type: "json" };

const routes = {
  "/": dashboardPage,
  "/bus-booking": busBookingPage,
  "/bank-loan": templatePage,
  "/college-project": templatePage,
  "/ecommerce": templatePage,
  "/employee-app": templatePage,
  "/onboarding": templatePage,
  "/enquiry": templatePage,
  "/fees-tracking": templatePage,
  "/goal-tracker": goalTracker,
  "/leave-tracker": templatePage,
  "/competition": templatePage,
  "/smart-parking": templatePage,
  "/survey": templatePage,
  "/user-app": templatePage,
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
  updateData(path);
  router();
}

export function startRouter() {
  window.addEventListener("popstate", () => {
    updateData(window.location.pathname);
    router();
  });
  window.addEventListener("adminMode", () => {
    router();
  });
  router();
}

const updateData = (path) => {
  setPageTitle(
    data.pages.find((page) => page.path === path)?.title || "Page Not Found",
  );
  updateActiveItem(path);
};
