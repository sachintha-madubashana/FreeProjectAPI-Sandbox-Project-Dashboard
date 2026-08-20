import dashbord from "@/pages/dashboard.html?raw";
import dashboardBannerComponent from "@/components/dashboard/dashboard-banner.js";
import projectCardComponent from "@/components/dashboard/card.js";
import data from "@/assets/data.json" with { type: "json" };
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";

// Create a template element and set its innerHTML to the imported dashboard HTML
const template = document.createElement("template");
template.innerHTML = dashbord;

export default function dashboardPage() {
  const clone = template.content.cloneNode(true);

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

  return clone;
}
