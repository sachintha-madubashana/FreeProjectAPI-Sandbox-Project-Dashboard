import employeeApp from "@/pages/employeeApp/employeeApp.html?raw";
import employeeAppAdmin from "@/pages/employeeApp/employeeAppAdmin.html?raw";
import { getAdminMode } from "@/components/header.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { getPageByPath } from "@/utils/settings.js";

export default function projectTempPage() {
  const currentPath = window.location.pathname.split("/").pop();
  const page = getPageByPath("/" + currentPath);

  const template = document.createElement("template");
  if (getAdminMode()) {
    template.innerHTML = employeeAppAdmin;
  } else {
    template.innerHTML = employeeApp;
  }
  const clone = document.importNode(template.content, true);

  loadAndRenderIcon(
    page.icon,
    clone.querySelector("#pageHeader"),
    clone.querySelector("#icon"),
  );

  return clone;
}
