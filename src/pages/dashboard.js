import dashbord from "@/pages/dashboard.html?raw";
import dashboardBannerComponent from "@/components/dashboard/dashboard-banner.js";
import projectCardComponent from "@/components/dashboard/card.js";
import data from "@/assets/data.json" with { type: "json" };
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";

// Create a template element and set its innerHTML to the imported dashboard HTML
const template = document.createElement("template");
template.innerHTML = dashbord;

// Initialize admin mode button functionality
const initAdminModeButton = (clone) => {
  const adminModeButton = clone.querySelector("#adminMode");
  if (adminModeButton) {
    adminModeButton.addEventListener("click", () => {
      const buttonMode =
        adminModeButton.attributes.getNamedItem("data-variant")?.value;
      if (buttonMode === "primary") {
        adminModeButton.attributes.getNamedItem("data-variant").value =
          "outline";
        adminModeButton
          .querySelector(".lucide-shield")
          .classList.toggle("hidden");
        adminModeButton
          .querySelector(".lucide-shield-minus")
          .classList.toggle("hidden");
        console.log("Admin mode disabled");
      } else {
        adminModeButton.attributes.getNamedItem("data-variant").value =
          "primary";
        adminModeButton
          .querySelector(".lucide-shield")
          .classList.toggle("hidden");
        adminModeButton
          .querySelector(".lucide-shield-minus")
          .classList.toggle("hidden");
        console.log("Admin mode enabled");
      }
      localStorage.setItem(
        "adminMode",
        adminModeButton.attributes.getNamedItem("data-variant")?.value ===
          "primary"
          ? "primary"
          : "outline",
      );
    });
    const storedAdminMode = localStorage.getItem("adminMode");
    if (storedAdminMode) {
      adminModeButton.attributes.getNamedItem("data-variant").value =
        storedAdminMode;
      if (storedAdminMode === "primary") {
        adminModeButton
          .querySelector(".lucide-shield-minus")
          .classList.add("hidden");
      } else {
        adminModeButton.querySelector(".lucide-shield").classList.add("hidden");
      }
    }
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

export default function dashboardPage() {
  const clone = template.content.cloneNode(true);

  // Add event listener for theme toggle button
  clone.querySelector("#themeToggle").addEventListener("click", () => {
    toggleTheme();
  });

  // Add event listener for admin mode button
  initAdminModeButton(clone);

  // Populate the dashboard with banner and project cards
  const cardsConteiner = clone.querySelector("#cardsConteiner");
  const pages = data.pages;

  cardsConteiner.appendChild(dashboardBannerComponent(data.banner));

  const gridContainer = document.createElement("div");
  gridContainer.className =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-full";
  pages.forEach((project) => {
    projectCardComponent(project).then((cardNode) => {
      gridContainer.appendChild(cardNode);
    });
  });

  cardsConteiner.appendChild(gridContainer);

  // Populate the sidebar menu with items from data
  const sidebarMenu = clone.querySelector("#sideberMenu");
  const sideberMenuItem = clone.querySelector("#sideberMenuItem");

  pages.forEach((project) => {
    const menuItem = sideberMenuItem.cloneNode(true);

    menuItem.querySelector("span").textContent = project.title;
    menuItem.querySelector("a").classList.remove("item-selected");
    menuItem.querySelector("#icon").setAttribute("data-lucide", project.icon);
    menuItem.querySelector("#icon").style.cssText =
      "color: " + project.iconColor;
    menuItem.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`Clicked on ${project.title}`);
      // navigation here
    });

    loadAndRenderIcon(project.icon, menuItem);

    sidebarMenu.appendChild(menuItem);
  });

  return clone;
}
