import sidebar from "@/components/sideBar.html?raw";
import data from "@/assets/data.json" with { type: "json" };
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";
import { navigate } from "@/router/router.js";
import { sortingFunction } from "@/pages/dashboard.js";

function SideBarComponent() {
  const template = document.createElement("template");
  template.innerHTML = sidebar;
  const clone = template.content.cloneNode(true);
  const root = clone.querySelector("#sidebar");

  const sidebarMenu = root.querySelector("#sideberMenu");
  const sideberMenuItem = root.querySelector("#sideberMenuItem");
  sidebarMenu.replaceChildren();
  const currentPath = window.location.pathname;

  const sortedPages = sortingFunction(data.pages);
  const homeProject = sortedPages.find((project) => project.id === 1);
  const otherProjects = sortedPages.filter((project) => project.id !== 1);
  const finalSidebarPages = homeProject
    ? [homeProject, ...otherProjects]
    : otherProjects;

  root.querySelector("#activeProjectCount").textContent =
    `${otherProjects.filter((project) => project.status == "active").length} Sandbox Applications`;

  finalSidebarPages.forEach((project) => {
    const menuItem = sideberMenuItem.cloneNode(true);
    const link = menuItem.querySelector("a");
    const badgeElement = menuItem.querySelector("#badge");

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

    if (project.status) {
      badgeElement.appendChild(badge(project.status));
    }
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

const badge = (type) => {
  const template = document.createElement("template");

  const classMapping = {
    developing:
      "badge bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    active:
      "badge bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    unavilable:
      "badge bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  let htmlString = `<span class="${classMapping[type]}">${type}</span>`;

  template.innerHTML = htmlString.trim();

  return template.content.firstElementChild;
};
