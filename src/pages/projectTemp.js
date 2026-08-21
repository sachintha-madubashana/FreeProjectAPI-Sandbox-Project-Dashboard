// replace impots with the correct file names
import projectTemp from "@/pages/html/projectTemp.html?raw";
import projectTempAdmin from "@/pages/html/projectTempAdmin.html?raw";
import { getAdminMode } from "@/components/header.js";
// remove this import
import data from "@/assets/data.json" with { type: "json" };

// Give a unique name to the function
export default function projectTempPage() {
  // remove this two lines
  const path = window.location.pathname;
  let name = data.pages.find((p) => p.path === path)?.title || "Page Not Found";

  const template = document.createElement("template");
  if (getAdminMode()) {
    // change the template to the correct admin template
    template.innerHTML = projectTempAdmin;

    // remove this line
    name = name + " Admin ";
  } else {
    // change the template to the correct user template
    template.innerHTML = projectTemp;
  }
  const clone = template.content.cloneNode(true);

  // remove this line
  clone.querySelector("h2").textContent = name + " Page";

  return clone;
}
