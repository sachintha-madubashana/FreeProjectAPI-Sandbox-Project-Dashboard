import Chart from "chart.js/auto";
import "basecoat-css/chart";

import dashboard from "@/pages/goalTracker/dashboard.html?raw";
import statsCards from "@/components/statsCards/statsCards.js";

export default function goalTrackerDashboard() {
  window.Chart = Chart;
  const template = document.createElement("template");
  template.innerHTML = dashboard;
  const clone = document.importNode(template.content, true);
  const canvasTarget = clone.querySelector("#chart");

  const recentActivity = [
    {
      type: "Reminder Added",
      message: "Added reminder: fghjkl;'",
      timestamp: "2026-08-24T01:43:00",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
    {
      type: "Goal Created",
      message: "New goal created: werty",
      timestamp: "2026-08-22T11:43:04.897",
    },
  ];

  const dashboardStats = {
    totalTasks: 50,
    completedTasks: 25,
    activeGoals: 9,
    inProgressGoals: 2,
    totalReminders: 5,
    upcomingReminders: 1,
    completionRate: "10%",
  };

  const chartData = [
    { date: "Aug 17", complete: 186, new: 80 },
    { date: "Aug 18", complete: 305, new: 200 },
    { date: "Aug 19", complete: 237, new: 120 },
    { date: "Aug 20", complete: 73, new: 190 },
    { date: "Aug 21", complete: 209, new: 130 },
    { date: "Aug 22", complete: 214, new: 140 },
  ];

  // Render stats cards
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Total Goals",
      value: dashboardStats.totalTasks,
      secondValue: "Completed Tasks : " + dashboardStats.completedTasks,
      icon: "List",
    }),
  );
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Active Goals",
      value: dashboardStats.activeGoals,
      secondValue: "InProgress Goals : " + dashboardStats.inProgressGoals,
      icon: "Goal",
    }),
  );
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Total Reminders",
      value: dashboardStats.totalReminders,
      secondValue: "Upcoming Reminders : " + dashboardStats.upcomingReminders,
      icon: "Bell",
    }),
  );
  clone.querySelector("#statsCardsContainer").appendChild(
    statsCards({
      title: "Completion Rate",
      value: dashboardStats.completionRate,
      icon: "CircleCheck",
    }),
  );

  recentActivity.forEach((activity) => {
    clone.querySelector("#recentActivityContainer").innerHTML = recentActivity
      .map((activity) => recentActivityLoader(activity))
      .join("");
  });

  requestAnimationFrame(() => {
    if (!canvasTarget) return;

    window.basecoat.chart(canvasTarget, {
      type: "line",
      labelKey: "date",
      data: chartData,
      series: {
        complete: { label: "Complete Tasks", color: "var(--chart-0)" },
        new: { label: "New Tasks", color: "var(--color-green-400)" },
      },
      options: {
        responsive: true,
      },
    });
  });

  return clone;
}

const recentActivityLoader = (activity) => {
  const cleanTime = new Date(activity.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<div class="alert">
            <h2>${activity.type}</h2>
            <p class="text-gray-400">${activity.message}</p>
            <span class="text-gray-400 text-end">${cleanTime}</span>
          </div>`;
};
