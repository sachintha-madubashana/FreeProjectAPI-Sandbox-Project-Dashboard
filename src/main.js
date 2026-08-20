import "basecoat-css/all";
import "@/styles/style.css";
import headderComponent from "@/components/headder.js";
import dashbord from "@/pages/dashboard.js";
import data from "@/assets/data.json" with { type: "json" };
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";

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

// Add event listener for theme toggle button
// document.querySelector("#themeToggle").addEventListener("click", () => {
//   toggleTheme();
// });

// Add event listener for admin mode button
initAdminModeButton(document);

const app = document.querySelector("#app");
app.appendChild(headderComponent());
app.appendChild(dashbord());

// Populate the sidebar menu with items from data
const sidebarMenu = document.querySelector("#sideberMenu");
const sideberMenuItem = document.querySelector("#sideberMenuItem");

data.pages.forEach((project) => {
  const menuItem = sideberMenuItem.cloneNode(true);

  menuItem.querySelector("span").textContent = project.title;
  menuItem.querySelector("a").classList.remove("item-selected");
  menuItem.querySelector("#icon").setAttribute("data-lucide", project.icon);
  menuItem.querySelector("#icon").style.cssText = "color: " + project.iconColor;
  menuItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    console.log(`Clicked on ${project.title}`);
    // navigation here
  });

  loadAndRenderIcon(project.icon, menuItem);
  sidebarMenu.appendChild(menuItem);
});
