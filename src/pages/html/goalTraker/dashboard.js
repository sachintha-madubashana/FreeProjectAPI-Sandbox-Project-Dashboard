import Chart from "chart.js/auto";
import "basecoat-css/chart";

import dashboard from "@/pages/html/goalTraker/dashboard.html?raw";
import { refresh } from "@/router/router.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import statsCards from "@/components/statsCards/statsCards.js";

export default function goalTrakerDashboard() {
  window.Chart = Chart;
  const template = document.createElement("template");
  template.innerHTML = dashboard;
  const clone = document.importNode(template.content, true);
  const canvasTarget = clone.querySelector("#visitors-chart");

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
  requestAnimationFrame(() => {
    if (!canvasTarget) return;

    window.basecoat.chart(canvasTarget, {
      type: "line",
      labelKey: "month",
      data: [
        { month: "Jan", desktop: 186, mobile: 80 },
        { month: "Feb", desktop: 305, mobile: 200 },
        { month: "Mar", desktop: 237, mobile: 120 },
        { month: "Apr", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "Jun", desktop: 214, mobile: 140 },
      ],
      series: {
        desktop: { label: "Desktop", color: "var(--chart-0)" },
        mobile: { label: "Mobile", color: "var(--chart-1)" },
      },
    });
  });

  return clone;
}
