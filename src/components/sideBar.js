import sidebar from "@/components/sideBar.html?raw";
import data from "@/assets/data.json" with { type: "json" };
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";

export default function sidebarComponent() {
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

    menuItem.querySelector("span").textContent = project.title;
    if (project.path === currentPath) {
      menuItem.querySelector("a").classList.add("item-selected");
    }

    // menuItem.querySelector("a").setAttribute("href", project.apiEndpoint);
    menuItem.querySelector("#icon").setAttribute("data-lucide", project.icon);
    menuItem.querySelector("#icon").style.cssText =
      "color: " + project.iconColor;
    menuItem.querySelector("a").addEventListener("click", (e) => {
      // navigation here
      console.log(`Clicked on ${project.title}`);
      e.preventDefault();
    });

    loadAndRenderIcon(project.icon, menuItem);
    sidebarMenu.appendChild(menuItem);
  });

  return clone;
}
