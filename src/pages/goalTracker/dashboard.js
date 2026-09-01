import Chart from "chart.js/auto";
import "basecoat-css/chart";

import dashboard from "@/pages/goalTracker/dashboard.html?raw";
import statsCards, {
  statsCardSkeleton,
} from "@/components/statsCards/statsCards.js";
import requestHandler from "@/utils/requestHandler";

export default function goalTrackerDashboard() {
  window.Chart = Chart;
  const template = document.createElement("template");
  template.innerHTML = dashboard;
  const clone = document.importNode(template.content, true);
  const canvasTarget = clone.querySelector("#chart");
  const loggedUser = JSON.parse(localStorage.getItem("goalTrackerUser"));

  for (let i = 0; i < 4; i++) {
    renderStatsCards(clone, null); // Render skeleton cards
  }

  getDashboardStats(loggedUser.userId).then((stats) => {
    if (!stats) return;

    console.log("Fetched dashboard stats:", stats);

    const dashboardStatsObjArray = [
      {
        title: "Total Goals",
        value: stats.totalTasks,
        secondValue: "Completed Tasks : " + stats.completedTasks,
        icon: "List",
      },
      {
        title: "Active Goals",
        value: stats.activeGoals,
        secondValue: "InProgress Goals : " + stats.inProgressGoals,
        icon: "Goal",
      },
      {
        title: "Total Reminders",
        value: stats.totalReminders,
        secondValue: "Upcoming Reminders : " + stats.upcomingReminders,
        icon: "Bell",
      },
      {
        title: "Completion Rate",
        value: stats.completionRate,
        icon: "CircleCheck",
      },
    ];
    clearStatsCardsContainer(document);
    dashboardStatsObjArray.forEach((stat) => {
      console.log("Rendering stat card:", stat);
      renderStatsCards(document, stat);
    });
  });

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

  const chartData = [
    { date: "Aug 17", complete: 186, new: 80 },
    { date: "Aug 18", complete: 305, new: 200 },
    { date: "Aug 19", complete: 237, new: 120 },
    { date: "Aug 20", complete: 73, new: 190 },
    { date: "Aug 21", complete: 209, new: 130 },
    { date: "Aug 22", complete: 214, new: 140 },
  ];

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
const clearStatsCardsContainer = (domContext) => {
  const statsCardsContainer = domContext.querySelector(
    "#dashboardStatsCardsContainer",
  );
  if (!statsCardsContainer) return;
  statsCardsContainer.innerHTML = "";
};

const renderStatsCards = (domContext, stats) => {
  const statsCardsContainer = domContext.querySelector(
    "#dashboardStatsCardsContainer",
  );
  if (!statsCardsContainer) return;

  if (stats) {
    console.log("Rendering cards ");
    statsCardsContainer.appendChild(statsCards(stats));
  } else {
    console.log("Rendering scalatons ");
    statsCardsContainer.appendChild(statsCardSkeleton());
  }
};

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

const getDashboardStats = async (userId) => {
  console.log("Sending request to fetch dashboard stats for userId:", userId);
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/dashboard",
      "GET",
      { userId: userId },
    );

    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};
