import "basecoat-css/all";
import "./styles/style.css";
// import { createIcons, Menu, ArrowRight, Globe, Star } from "lucide";
import "../bin/app-dashboard.js";
import dashbord from "./pages/dashboard.js";

// createIcons({
//   icons: {
//     Menu,
//     ArrowRight,
//     Globe,
//     Star,
//   },
//   attrs: {
//     class: ["bg-black", "fill-foreground", "w-20", "h-20"],
//     "stroke-width": 1,
//     stroke: "#333",
//     width: 24,
//     height: 24,
//   },
//   nameAttr: "data-lucide",
//   inTemplates: true,
// });

const app = document.querySelector("#app");
app.appendChild(dashbord());
