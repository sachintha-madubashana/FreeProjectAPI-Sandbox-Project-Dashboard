import "basecoat-css/all";
import "@/styles/style.css";
import headerComponent from "@/components/header.js";
import sidebar from "@/components/sideBar.js";
import dashbord from "@/pages/dashboard.js";
import data from "@/assets/data.json" with { type: "json" };
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";

document.querySelector("#main").prepend(sidebar(1));

const app = document.querySelector("#app");
app.appendChild(headerComponent());
const div = document.createElement("div");
div.id = "pageContent";
div.appendChild(dashbord());
app.appendChild(div);

const path = window.location.pathname;
if (path === "/test") {
  console.log("Current path is the root or index.html");
  document
    .querySelector("#pageContent")
    .replaceChildren(`<h1>This is replaced content.</h1>`);
} else {
  console.log("Current path is:", path);
}
