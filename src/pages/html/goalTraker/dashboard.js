// replace impots with the correct file names
import dashboard from "@/pages/html/goalTraker/dashboard.html?raw";
import { refresh } from "@/router/router.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import statsCards from "@/components/statsCards/statsCards.js";

export default function goalTrakerDashboard() {
  const template = document.createElement("template");
  template.innerHTML = dashboard;
  const clone = document.importNode(template.content, true);

  // load and render icons for tabs
  loadAndRenderIcon(
    "LayoutDashboard",
    clone.querySelector("#tabsWithIconsTabDashboard"),
    clone.querySelector("#tabDashboardIcon"),
  );
  loadAndRenderIcon(
    "Logs",
    clone.querySelector("#tabsWithIconsTabTask"),
    clone.querySelector("#tabTaskIcon"),
  );

  clone.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("goalTrackerUser");
    refresh();
  });

  // Render stats cards
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Total Goals",
      value: "10",
      secondValue: "Completed Tasks : 5",
    }),
  );
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Active Goals",
      value: "10",
      secondValue: "InProgress Goals : 5",
    }),
  );
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Total Reminders",
      value: "10",
      secondValue: "Upcoming Reminders : 5",
    }),
  );
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Completion Rate",
      value: "10%",
    }),
  );

  return clone;
}
