import "basecoat-css/all";
import "@/styles/style.css";

import { HeaderComponent } from "@/components/header.js";
import { SideBarComponent } from "@/components/sideBar.js";
import { startRouter } from "@/router/router.js";

const main = document.querySelector("#main");
const app = document.querySelector("#app");

main.prepend(SideBarComponent());

app.appendChild(HeaderComponent());

const pageContent = document.createElement("div");
pageContent.id = "pageContent";

app.appendChild(pageContent);

startRouter();
