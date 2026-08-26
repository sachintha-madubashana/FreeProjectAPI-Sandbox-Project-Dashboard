import taskTemplate from "@/pages/goalTracker/task.html?raw";
import statsCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import taskCardContainer from "@/components/taskCardContainer/taskCardContainer.js";

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
      tasks: [
        {
          taskId: 403,
          taskName: "adfg",
          createdDate: "2026-08-22T11:42:12.543",
          dueDate: "2026-08-29T00:00:00",
          isCompleted: false,
          userId: 9567,
        },
        {
          taskId: 404,
          taskName: "aaaaa",
          createdDate: "2026-08-22T11:42:33.177",
          dueDate: "2026-08-29T00:00:00",
          isCompleted: false,
          userId: 9567,
        },
        {
          taskId: 405,
          taskName: "dfhdfh",
          createdDate: "2026-08-25T11:56:05.087",
          dueDate: "2026-09-01T00:00:00",
          isCompleted: false,
          userId: 9567,
        },
      ],
    },
    {
      frequency: "Weekly",
      frequencyIcon: "CalendarDays",
      tasks: [
        {
          taskId: 403,
          taskName: "adfg",
          createdDate: "2026-08-22T11:42:12.543",
          dueDate: "2026-08-29T00:00:00",
          isCompleted: false,
          userId: 9567,
        },
        {
          taskId: 404,
          taskName: "aaaaa",
          createdDate: "2026-08-22T11:42:33.177",
          dueDate: "2026-08-29T00:00:00",
          isCompleted: false,
          userId: 9567,
        },
        {
          taskId: 405,
          taskName: "dfhdfh",
          createdDate: "2026-08-25T11:56:05.087",
          dueDate: "2026-09-01T00:00:00",
          isCompleted: false,
          userId: 9567,
        },
      ],
    },
    {
      frequency: "Monthly",
      frequencyIcon: "Calendar",
      tasks: [],
    },
  ];
  const taskCardsContainer = clone.querySelector("#taskCardsContainer");
  taskSeperatedByFrequency.forEach((task) => {
    console.log("task", task);

    taskCardsContainer.appendChild(taskCardContainer(task));
  });

  return clone;
}
