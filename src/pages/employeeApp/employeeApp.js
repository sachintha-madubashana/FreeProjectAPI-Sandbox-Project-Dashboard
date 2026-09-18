// replace impots with the correct file names
import employeeApp from "@/pages/employeeApp/employeeApp.html?raw";
import employeeAppAdmin from "@/pages/employeeApp/employeeAppAdmin.html?raw";
import { getAdminMode } from "@/components/header.js";
import { getPages } from "@/utils/settings.js";
// remove this import

// Give a unique name to the function
export default function projectTempPage() {
  // remove this two lines
  const path = window.location.pathname;
  let name =
    getPages().find((p) => p.path === path)?.title ||
    "Employee App Page Not Found";

  const template = document.createElement("template");
  if (getAdminMode()) {
    // change the template to the correct admin template
    template.innerHTML = employeeAppAdmin;

    // remove this line
    name = name + " Employee App Admin";
  } else {
    // change the template to the correct user template
    template.innerHTML = employeeApp;
  }
  // const clone = template.content.cloneNode(true);
  const clone = document.importNode(template.content, true); // Best practice to use this.

  // remove this line
  clone.querySelector("h2").textContent = name + " Page";

  return clone;
}
