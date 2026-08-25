import taskTemplate from "@/pages/goalTracker/task.html?raw";
import statsCards from "@/components/simpleStatsCards/simpleStatsCards.js";

export default function task() {
  const template = document.createElement("template");
  template.innerHTML = taskTemplate;
  const clone = document.importNode(template.content, true);

  const taskStats = {
    totalTasks: 50,
    completedTasks: 25,
    pendingTasks: 9,
    overdueTasks: 2,
  };

  // Render stats cards
  clone.querySelector("#taskCardsContainer").appendChild(
    statsCards({
      title: "Total Tasks",
      value: taskStats.totalTasks,
      icon: "ClipboardList",
    }),
  );
  clone.querySelector("#taskCardsContainer").appendChild(
    statsCards({
      title: "Completed Tasks",
      value: taskStats.completedTasks,
      icon: "CircleCheck",
    }),
  );
  clone.querySelector("#taskCardsContainer").appendChild(
    statsCards({
      title: "Pending Tasks",
      value: taskStats.pendingTasks,
      icon: "Ellipsis",
    }),
  );
  clone.querySelector("#taskCardsContainer").appendChild(
    statsCards({
      title: "Overdue Tasks",
      value: taskStats.overdueTasks,
      icon: "RotateCwFadingClock",
    }),
  );

  return clone;
}
