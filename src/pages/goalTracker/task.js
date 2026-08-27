import taskTemplate from "@/pages/goalTracker/task.html?raw";
import statsCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import taskCardContainer from "@/components/taskCardContainer/taskCardContainer.js";
import showTaskInfo from "@/components/dialogs/showTaskInfo/showTaskInfo.js";
import addAndEditTask from "@/components/dialogs/addAndEditTask/addAndEditTask.js";

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

  const tasksSeperatedByFrequency = [
    {
      frequency: "Daily",
      frequencyIcon: "Sun",
      tasks: [
        {
          taskId: 403,
          taskName: "adfg",
          createdDate: "2026-08-22T11:42:12.543",
          dueDate: "2026-08-29T11:42:12.543",
          isCompleted: true,
          status: "done",
          userId: 9567,
        },
        {
          taskId: 404,
          taskName: "aaaaa",
          createdDate: "2026-08-22T11:42:33.177",
          dueDate: "2026-08-29T00:00:00",
          isCompleted: false,
          status: "pending",
          userId: 9567,
        },
        {
          taskId: 405,
          taskName: "dfhdfh",
          createdDate: "2026-08-25T11:56:05.087",
          dueDate: "2026-09-01T00:00:00",
          isCompleted: false,
          status: "overdue",
          userId: 9567,
        },
      ],
    },
    {
      frequency: "Weekly",
      frequencyIcon: "CalendarDays",
      tasks: [
        {
          taskId: 406,
          taskName: "adfg",
          createdDate: "2026-08-22T11:42:12.543",
          dueDate: "2026-08-29T11:42:12.543",
          isCompleted: true,
          status: "done",
          userId: 9567,
        },
        {
          taskId: 407,
          taskName: "aaaaa",
          createdDate: "2026-08-22T11:42:33.177",
          dueDate: "2026-08-29T00:00:00",
          isCompleted: false,
          status: "pending",
          userId: 9567,
        },
        {
          taskId: 408,
          taskName: "dfhdfh",
          createdDate: "2026-08-25T11:56:05.087",
          dueDate: "2026-09-01T00:00:00",
          isCompleted: false,
          status: "overdue",
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
  tasksSeperatedByFrequency.forEach((taskSeperatedByFrequency) => {
    taskCardsContainer.appendChild(taskCardContainer(taskSeperatedByFrequency));
  });

  clone.querySelector("#searchBtn").addEventListener("click", () => {
    const searchInput = document.querySelector("#searchInput").value.trim();
    if (searchInput) {
      console.log("Searching ...");
      const filteredTasks = tasksSeperatedByFrequency.map((group) => ({
        ...group,
        tasks: group.tasks.filter((task) =>
          task.taskName.toLowerCase().includes(searchInput.toLowerCase()),
        ),
      }));

      const taskCardsContainer = document.querySelector("#taskCardsContainer");
      taskCardsContainer.replaceChildren();
      filteredTasks.forEach((taskSeperatedByFrequency) => {
        console.log(
          "Filtered tasks for frequency:",
          taskSeperatedByFrequency.frequency,
          taskSeperatedByFrequency.tasks,
        );
        taskCardsContainer.appendChild(
          taskCardContainer(taskSeperatedByFrequency),
        );
      });
    } else {
      console.log("Search input is empty.");
    }
  });

  clone.querySelector("#addTaskBtn").addEventListener("click", () => {
    const data = {
      dialogId: "addTaskDialog",
      confermButtonText: "Save Task",
      onConfirm: () => {
        console.log("Task added:", props?.taskId);
      },
      title: "Add Task",
      description: "You can add a new task here. Click save when you're done.",
    };
    document.getElementById("pageContent").appendChild(addAndEditTask(data));
    document.getElementById("addTaskDialog").showModal();
  });

  return clone;
}

export function showMoreInfoDialog(prams) {
  document.getElementById("pageContent").appendChild(showTaskInfo(prams));
  document.getElementById("showTaskInfo").showModal();
}
