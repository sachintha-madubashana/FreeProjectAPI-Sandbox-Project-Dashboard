// replace impots with the correct file names
import dashboard from "@/pages/html/goalTraker/dashboard.html?raw";
import { refresh } from "@/router/router.js";

export default function goalTrakerDashboard() {
  const template = document.createElement("template");
  template.innerHTML = dashboard;
  const clone = document.importNode(template.content, true);

  clone.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("goalTrackerUser");
    refresh();
  });

  return clone;
}
