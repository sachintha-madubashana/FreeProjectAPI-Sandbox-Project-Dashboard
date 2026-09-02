import { setPageTitle } from "@/components/header.js";
import { updateActiveItem } from "@/components/sideBar.js";
import dashboardPage from "@/pages/dashboard.js";
import busBookingPage from "@/pages/busBooking.js";
import goalTracker from "@/pages/goalTracker/goalTracker.js";
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
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

function getRoutePath() {
  const pathname = window.location.pathname;

  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    const routePath = pathname.slice(BASE_PATH.length);

    return routePath || "/";
  }

  return pathname || "/";
}

function router() {
  const path = getRoutePath();
  const page = routes[path];

  const urlParams = new URLSearchParams(window.location.search);
  const pageContent = document.querySelector("#pageContent");

  if (!pageContent) {
    console.error("#pageContent was not found.");
    return;
  }

  if (!page) {
    pageContent.innerHTML = `
      <h1>404</h1>
      <p>Page not found.</p>
    `;

    updateData(path);
    return;
  }

  updateData(path);

  pageContent.replaceChildren(page(Object.fromEntries(urlParams.entries())));
}

export function navigate(path) {
  const url = `${BASE_PATH}${path === "/" ? "/" : path}`;

  history.pushState({}, "", url);

  router();
}

export function startRouter() {
  window.addEventListener("popstate", router);
  window.addEventListener("adminMode", router);
  router();
}

function updateData(path) {
  setPageTitle(
    data.pages.find((page) => page.path === path)?.title || "Page Not Found",
  );

  updateActiveItem(path);
}

export function refresh() {
  router();
}
