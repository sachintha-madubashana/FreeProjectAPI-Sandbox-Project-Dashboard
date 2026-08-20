import "basecoat-css/all";
import "@/styles/style.css";

import headerComponent from "@/components/header.js";
import sidebar from "@/components/sideBar.js";
import { router } from "@/router/router.js";

const main = document.querySelector("#main");
const app = document.querySelector("#app");

main.prepend(sidebar());

app.appendChild(headerComponent());

const pageContent = document.createElement("div");
pageContent.id = "pageContent";

app.appendChild(pageContent);

router();
