import "basecoat-css/all";
import "./styles/style.css";
import { createIcons, Menu, ArrowRight, Globe, Star } from "lucide";
import "../bin/app-dashboard.js";
import dashboardBannerComponent from "./components/dashboard/dashboard-banner.js";
import projectCardComponent from "./components/dashboard/card.js";
import data from "./assets/data.json" with { type: "json" };

createIcons({
  icons: {
    Menu,
    ArrowRight,
    Globe,
    Star,
  },
  attrs: {
    class: ["bg-black", "fill-foreground", "w-20", "h-20"],
    "stroke-width": 1,
    stroke: "#333",
    width: 24,
    height: 24,
  },
  nameAttr: "data-lucide",
  inTemplates: true,
});

const app = document.querySelector("#app");
const projects = data.projects;

app.appendChild(dashboardBannerComponent(data.banner));

const gridContainer = document.createElement("div");
gridContainer.className =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-full";
projects.forEach((project) => {
  const cardNode = projectCardComponent(project);
  gridContainer.appendChild(cardNode);
});

app.appendChild(gridContainer);
