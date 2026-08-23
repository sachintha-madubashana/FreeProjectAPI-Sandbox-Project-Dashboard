// replace impots with the correct file names
// import projectTemp from "@/pages/html/projectTemp.html?raw";
// import projectTempAdmin from "@/pages/html/projectTempAdmin.html?raw";
import login from "@/components/login/login.js";
import { getAdminMode } from "@/components/header.js";

export default function goalTracker() {
  const template = document.createElement("template");
  const clone = template.content.cloneNode(true);

  const loginProps = {
    title: "Goal Tracker Login",
  };

  clone.appendChild(login(loginProps));

  return clone;
}
