import { setPageTitle } from "@/components/header.js";
import { updateActiveItem } from "@/components/sideBar.js";
import dashboardPage from "@/pages/dashboard.js";
import busBookingPage from "@/pages/busBooking.js";
import data from "@/assets/data.json" with { type: "json" };

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
  setPageTitle(
    data.pages.find((page) => page.path === path)?.title || "Page Not Found",
  );
  updateActiveItem(path);
}

export function startRouter() {
  window.addEventListener("popstate", router);
  window.addEventListener("adminMode", () => {
    router();
  });
  router();
}
