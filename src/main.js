import "basecoat-css/all";
import "@/styles/style.css";
import dashbord from "@/pages/dashboard.js";

const app = document.querySelector("#app");
app.appendChild(dashbord());
