import dashbord from "@/pages/html/dashboard.html?raw";
import dashboardBannerComponent from "@/components/dashboard/dashboard-banner.js";
import projectCardComponent from "@/components/dashboard/card.js";
import data from "@/assets/data.json" with { type: "json" };

// Create a template element and set its innerHTML to the imported dashboard HTML
const template = document.createElement("template");
template.innerHTML = dashbord;

export default function dashboardPage() {
  const clone = template.content.cloneNode(true);
  const root = clone.querySelector("#cardsConteiner");
  const pages = data.pages;

  root.appendChild(dashboardBannerComponent(data.banner));

  const gridContainer = document.createElement("div");
  gridContainer.className =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-full";

  const sortedPages = sortingFunction(pages).filter(
    (project) => project.id !== 1,
  );
  const cardPromises = sortedPages.map((project) =>
    projectCardComponent(project),
  );

  Promise.all(cardPromises).then((cardNodes) => {
    cardNodes.forEach((cardNode) => {
      gridContainer.appendChild(cardNode);
    });
    root.appendChild(gridContainer);
  });

  return clone;
}

export const sortingFunction = (pages) => {
  const projectStatusOrder = {
    active: 1,
    developing: 2,
    unavilable: 3,
  };

  return [...pages].sort((a, b) => {
    const statusA = projectStatusOrder[a.status] || 4;
    const statusB = projectStatusOrder[b.status] || 4;

    if (statusA !== statusB) {
      return statusA - statusB;
    } else {
      return a.title.localeCompare(b.title);
    }
  });
};
