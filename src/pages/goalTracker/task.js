import taskTemplate from "@/pages/goalTracker/task.html?raw";
import statsCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import cardContainer from "@/components/cardContainer/cardContainer.js";

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
  clone.querySelector("#taskStatsCardsContainer").appendChild(
    statsCards({
      title: "Total Tasks",
      value: taskStats.totalTasks,
      icon: "ClipboardList",
    }),
  );
  clone.querySelector("#taskStatsCardsContainer").appendChild(
    statsCards({
      title: "Completed Tasks",
      value: taskStats.completedTasks,
      icon: "CircleCheck",
    }),
  );
  clone.querySelector("#taskStatsCardsContainer").appendChild(
    statsCards({
      title: "Pending Tasks",
      value: taskStats.pendingTasks,
      icon: "Ellipsis",
    }),
  );
  clone.querySelector("#taskStatsCardsContainer").appendChild(
    statsCards({
      title: "Overdue Tasks",
      value: taskStats.overdueTasks,
      icon: "RotateCwFadingClock",
    }),
  );

  const taskSeperatedByFrequency = [
    {
      frequency: "Daily",
      frequencyIcon: "Sun",
      tasks: [],
    },
    {
      frequency: "Weekly",
      frequencyIcon: "CalendarDays",
      tasks: [],
    },
    {
      frequency: "Monthly",
      frequencyIcon: "Calendar",
      tasks: [],
    },
  ];

  taskSeperatedByFrequency.forEach((task) => {
    clone.querySelector("#taskCardsContainer").appendChild(cardContainer(task));
  });

  return clone;
}
