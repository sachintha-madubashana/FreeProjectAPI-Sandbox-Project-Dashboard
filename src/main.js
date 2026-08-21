import "basecoat-css/all";
import "@/styles/style.css";

import { HeaderComponent, setPageTitle } from "@/components/header.js";
import { SideBarComponent, updateActiveItem } from "@/components/sideBar.js";
import { startRouter } from "@/router/router.js";
import data from "@/assets/data.json" with { type: "json" };

const main = document.querySelector("#main");
const app = document.querySelector("#app");

main.prepend(SideBarComponent());

app.appendChild(HeaderComponent());

const pageContent = document.createElement("div");
pageContent.id = "pageContent";

app.appendChild(pageContent);

startRouter();
