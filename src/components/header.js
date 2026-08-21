import header from "@/components/header.html?raw";
import data from "@/assets/data.json" with { type: "json" };

let isAdminMode = false;

// Init admin mode button functionality
const initAdminModeButton = (clone) => {
  const adminOnIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-icon lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
  const adminOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-off-icon lucide-shield-off"><path d="m2 2 20 20"/><path d="M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71"/><path d="M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264"/></svg>`;

  const storedAdminMode = localStorage.getItem("adminMode");
  isAdminMode = storedAdminMode === "true";

  const adminModeButton = clone.querySelector("#adminModeBtn");
  const adminModeIcon = clone.querySelector("#adminModeIcon");

  if (adminModeButton) {
    const asyncButton = () => {
      if (isAdminMode) {
        adminModeButton.attributes.getNamedItem("data-variant").value =
          "primary";
        adminModeIcon.innerHTML = adminOnIcon;
      } else {
        adminModeButton.attributes.getNamedItem("data-variant").value =
          "outline";
        adminModeIcon.innerHTML = adminOffIcon;
      }
    };
    asyncButton();

    adminModeButton.addEventListener("click", () => {
      isAdminMode = !isAdminMode;
      const adminModeEvent = new CustomEvent("adminMode", {
        detail: {
          adminMode: isAdminMode,
        },
      });
      window.dispatchEvent(adminModeEvent);
      localStorage.setItem("adminMode", isAdminMode.toString());
      asyncButton();
    });
  }
};

// Initialize theme mode based on stored preference
(() => {
  try {
    const stored = localStorage.getItem("themeMode");
    if (
      stored
        ? stored === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    }
  } catch (_) {}
})();

// Theme toggle function
const toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("themeMode", isDark ? "dark" : "light");
};
let breadcrumbElement;

function HeaderComponent() {
  const template = document.createElement("template");
  template.innerHTML = header;
  const clone = template.content.cloneNode(true);

  breadcrumbElement = clone.querySelector("#breadcrumbPage");

  // Add event listener for admin mode button
  initAdminModeButton(clone);

  // Add event listener for theme toggle button
  clone.querySelector("#themeToggle").addEventListener("click", () => {
    toggleTheme();
  });

  setPageTitle(
    data.pages.find((page) => page.path === window.location.pathname)?.title ||
      "Page Not Found",
  );

  return clone;
}

// set page title in the breadcrumb
const setPageTitle = (title) => {
  if (breadcrumbElement) {
    breadcrumbElement.textContent = title;
  } else {
    const liveElement = document.querySelector("#breadcrumbPage");
    if (liveElement) liveElement.textContent = title;
  }
};

const getAdminMode = () => isAdminMode;

export { HeaderComponent, setPageTitle, getAdminMode };
