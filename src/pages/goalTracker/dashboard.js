import Chart from "chart.js/auto";
import "basecoat-css/chart";

import dashboard from "@/pages/goalTracker/dashboard.html?raw";
import statsCard, {
  statsCardSkeleton,
} from "@/components/cards/statsCard/statsCard.js";
import requestHandler from "@/utils/requestHandler";

export default function goalTrackerDashboard() {
  window.Chart = Chart;
  const template = document.createElement("template");
  template.innerHTML = dashboard;

  const root = document.importNode(template.content, true);
  const page = root.querySelector("#goalTrackerDashboardPage");

  const canvasTarget = root.querySelector("#chart");
  const loggedUser = getLoggedUser();

  const statsContainer = root.querySelector("#dashboardStatsCardsContainer");
  renderStatsSkeleton(statsContainer);

  if (loggedUser?.userId) {
    loadDashboardStats(statsContainer, loggedUser.userId);
  }

  loadRecentActivity(loggedUser?.userId)
    .then((activities) => {
      if (!activities) {
        return;
      }
      renderRecentActivity(page, activities);
    })
    .catch((error) => {
      console.error("Error loading recent activity:", error);
    });

  const chartData = [
    { date: "Aug 17", complete: 186, new: 80 },
    { date: "Aug 18", complete: 305, new: 200 },
    { date: "Aug 19", complete: 237, new: 120 },
    { date: "Aug 20", complete: 73, new: 190 },
    { date: "Aug 21", complete: 209, new: 130 },
    { date: "Aug 22", complete: 214, new: 140 },
  ];

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

  return root;
}

const renderStatsSkeleton = (dashboardElement) => {
  if (!dashboardElement) return;

  for (let i = 0; i < 4; i++) {
    dashboardElement.appendChild(statsCardSkeleton());
  }
};

const getLoggedUser = () => {
  return JSON.parse(localStorage.getItem("goalTrackerUser"));
};

const loadDashboardStats = async (dashboardElement, userId) => {
  try {
    const stats = await getDashboardStats(userId);

    if (!stats) {
      // renderDashboardError(dashboardElement);
      return;
    }

    renderDashboardStats(dashboardElement, stats);
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    // renderDashboardError(dashboardElement);
  }
};

const renderDashboardStats = (dashboardElement, stats) => {
  if (!dashboardElement) return;

  dashboardElement.innerHTML = "";

  const dashboardStats = createDashboardStats(stats);

  dashboardStats.forEach((stat) => {
    dashboardElement.appendChild(statsCard(stat));
  });
};

const getDashboardStats = async (userId) => {
  // console.log("Sending request to fetch dashboard stats for userId:", userId);
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

const createDashboardStats = (stats) => [
  {
    title: "Total Goals",
    value: stats.totalTasks,
    secondValue: `Completed Tasks: ${stats.completedTasks}`,
    icon: "List",
  },
  {
    title: "Active Goals",
    value: stats.activeGoals,
    secondValue: `InProgress Goals: ${stats.inProgressGoals}`,
    icon: "Goal",
  },
  {
    title: "Total Reminders",
    value: stats.totalReminders,
    secondValue: `Upcoming Reminders: ${stats.upcomingReminders}`,
    icon: "Bell",
  },
  {
    title: "Completion Rate",
    value: stats.completionRate,
    icon: "CircleCheck",
  },
];

const recentActivityLoader = (activity) => {
  const cleanTime = formatActivityTime(activity.timestamp);

  return `<div class="alert">
            <h2>${activity.type}</h2>
            <p class="text-gray-400">${activity.message}</p>
            <span class="text-gray-400 text-end">${cleanTime}</span>
          </div>`;
};

const renderRecentActivity = (domContext, activities) => {
  const container = domContext.querySelector("#recentActivityContainer");

  if (!container) return;

  container.innerHTML = activities.map(recentActivityLoader).join("");
};

const formatActivityTime = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
// Data fetching functions
const loadRecentActivity = async (userId) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/recent-activity",
      "GET",
      { userId: userId },
    );

    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};
