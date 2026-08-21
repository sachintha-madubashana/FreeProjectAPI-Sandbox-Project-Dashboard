import sidebar from "@/components/sideBar.html?raw";
import data from "@/assets/data.json" with { type: "json" };
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";
import { navigate } from "@/router/router.js";

function SideBarComponent() {
  const template = document.createElement("template");
  template.innerHTML = sidebar;
  const clone = template.content.cloneNode(true);

  // Populate the sidebar menu with items from data
  const sidebarMenu = clone.querySelector("#sideberMenu");
  const sideberMenuItem = clone.querySelector("#sideberMenuItem");
  sidebarMenu.replaceChildren();
  const currentPath = window.location.pathname;

  data.pages.forEach((project) => {
    const menuItem = sideberMenuItem.cloneNode(true);
    const link = menuItem.querySelector("a");

    menuItem.querySelector("span").textContent = project.title;

    if (project.path === currentPath) {
      link.classList.add("item-selected");
    }
    link.setAttribute("href", project.path);
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(project.path);
    });
    menuItem.querySelector("#icon").style.cssText =
      "color: " + project.iconColor;

    loadAndRenderIcon(project.icon, menuItem, menuItem.querySelector("#icon"));
    sidebarMenu.appendChild(menuItem);
  });

  return clone;
}

const updateActiveItem = (path) => {
  document.querySelectorAll("#sideberMenu a").forEach((item) => {
    item.hasAttribute("href") && item.getAttribute("href") === path
      ? item.classList.add("item-selected")
      : item.classList.remove("item-selected");
  });
};

export { SideBarComponent, updateActiveItem };
