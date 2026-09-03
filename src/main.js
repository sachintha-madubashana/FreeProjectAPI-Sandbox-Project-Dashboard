// import "basecoat-css/all";
import "@/styles/style.css";

import { HeaderComponent } from "@/components/header.js";
import { SideBarComponent } from "@/components/sideBar.js";
import { startRouter } from "@/router/router.js";
import initToastSysyem from "@/utils/toastSystem.js";

const main = document.querySelector("#main");
const app = document.querySelector("#app");

main.prepend(SideBarComponent());

app.appendChild(HeaderComponent());

const pageContent = document.createElement("div");
pageContent.id = "pageContent";
pageContent.classList = "flex flex-col flex-1 min-h-0";

app.appendChild(pageContent);
initToastSysyem();

startRouter();
