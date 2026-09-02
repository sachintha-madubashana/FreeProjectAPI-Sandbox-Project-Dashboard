import taskTemplate from "@/pages/goalTracker/task.html?raw";
import statsCards, {
  simpleStatsCardSkeleton,
} from "@/components/simpleStatsCard/simpleStatsCard.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import taskCardContainer, {
  taskCardContainerSkeleton,
} from "@/components/taskCardContainer/taskCardContainer.js";
import showTaskInfo from "@/components/dialogs/showTaskInfo/showTaskInfo.js";
import addAndEditTask from "@/components/dialogs/addAndEditTask/addAndEditTask.js";
import { getLoggedUser } from "@/pages/goalTracker/goalTracker.js";
import requestHandler from "@/utils/requestHandler.js";

const TaskStatus = Object.freeze({
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed",
  OVERDUE: "overdue",
});
let selectedStatus = TaskStatus.ALL;
export default function task() {
  const template = document.createElement("template");
  template.innerHTML = taskTemplate;
  const clone = document.importNode(template.content, true);

  const tasksSeperatedByFrequency = [];
  const loggedUser = getLoggedUser();
  const page = clone.querySelector("#taskPage");
  renderTaskSkeleton(page);

  loadTasks(loggedUser.userId)
    .then((fetchedTasks) => {
      if (!fetchedTasks) {
        return;
      }
      addStatusToTasks(fetchedTasks);
      updateTasksStats(page, fetchedTasks);
      tasksSeperatedByFrequency.push(
        ...taskSeperatedByFrequencyGenerator(fetchedTasks),
      );
      renderTasks(page, tasksSeperatedByFrequency);
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
    });

  setupEventListeners(page, tasksSeperatedByFrequency);

  return clone;
}

//Set up functions
const renderTaskSkeleton = (root) => {
  const statsCardsContainer = root.querySelector("#taskStatsCardsContainer");
  const taskCardsContainer = root.querySelector("#taskCardsContainer");

  if (!statsCardsContainer) return;
  statsCardsContainer.replaceChildren();

  for (let i = 0; i < 4; i++) {
    statsCardsContainer.appendChild(simpleStatsCardSkeleton());
  }

  if (!taskCardsContainer) return;
  taskCardsContainer.replaceChildren();
  for (let i = 0; i < 3; i++) {
    taskCardsContainer.appendChild(taskCardContainerSkeleton());
  }
};
const setupEventListeners = (page, tasksSeperatedByFrequency) => {
  page.querySelector("#searchBtn").addEventListener("click", () => {
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

  page.querySelector("#addTaskBtn").addEventListener("click", () => {
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
  page.querySelector("#filterAllTasksBtn").addEventListener("click", (e) => {
    selectedStatus = TaskStatus.ALL;
    filterBtnClickHandler(
      page,
      tasksSeperatedByFrequency,
      selectedStatus,
      e.currentTarget,
    );
  });
  page
    .querySelector("#filterPendingTasksBtn")
    .addEventListener("click", (e) => {
      selectedStatus = TaskStatus.PENDING;
      filterBtnClickHandler(
        page,
        tasksSeperatedByFrequency,
        selectedStatus,
        e.currentTarget,
      );
    });
  page
    .querySelector("#filterCompletedTasksBtn")
    .addEventListener("click", (e) => {
      selectedStatus = TaskStatus.COMPLETED;
      filterBtnClickHandler(
        page,
        tasksSeperatedByFrequency,
        selectedStatus,
        e.currentTarget,
      );
    });
  page
    .querySelector("#filterOverdueOverdueBtn")
    .addEventListener("click", (e) => {
      selectedStatus = TaskStatus.OVERDUE;
      filterBtnClickHandler(
        page,
        tasksSeperatedByFrequency,
        selectedStatus,
        e.currentTarget,
      );
    });
};
const addStatusToTasks = (tasks) => {
  tasks.forEach((task) => {
    if (!task.isCompleted && new Date(task.dueDate) > new Date()) {
      task.status = TaskStatus.PENDING;
      return;
    }
    if (task.isCompleted) {
      task.status = TaskStatus.COMPLETED;
      return;
    }
    if (!task.isCompleted && new Date(task.dueDate) < new Date()) {
      task.status = TaskStatus.OVERDUE;
    }
  });
};
const taskStatsGenerator = (tasks) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED,
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === TaskStatus.PENDING,
  ).length;
  const overdueTasks = tasks.filter(
    (task) => task.status === TaskStatus.OVERDUE,
  ).length;

  return [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: "ClipboardList",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: "CircleCheck",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      icon: "Ellipsis",
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks,
      icon: "RotateCwFadingClock",
    },
  ];
};
const taskSeperatedByFrequencyGenerator = (tasks) => {
  const dailyTask = [];
  const weeklyTask = [];
  const monthlyTask = [];

  tasks.forEach((task) => {
    const frequency = task.frequency.toLowerCase();
    if (frequency === "daily") {
      dailyTask.push(task);
    } else if (frequency === "weekly") {
      weeklyTask.push(task);
    } else if (frequency === "monthly") {
      monthlyTask.push(task);
    }
  });

  return [
    {
      frequency: "Daily",
      frequencyIcon: "Sun",
      tasks: dailyTask,
    },
    {
      frequency: "Weekly",
      frequencyIcon: "CalendarDays",
      tasks: weeklyTask,
    },
    {
      frequency: "Monthly",
      frequencyIcon: "Calendar",
      tasks: monthlyTask,
    },
  ];
};

// Data fetching functions
const loadTasks = async (userId) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/getAllTasks",
      "GET",
      { userId: userId },
    );

    return response;
  } catch (error) {
    console.error("Error fetching Tasks:", error);
  }
};

// Stats Rendering functions
const updateTasksStats = (root, tasks) => {
  const taskStats = taskStatsGenerator(tasks);
  const taskStatsCardsContainer = root.querySelector(
    "#taskStatsCardsContainer",
  );
  taskStatsCardsContainer.replaceChildren();
  taskStats.forEach((stats) => {
    taskStatsCardsContainer.appendChild(statsCards(stats));
  });
};
const renderTasks = (root, tasksSeperatedByFrequency) => {
  const taskCardsContainer = root.querySelector("#taskCardsContainer");
  taskCardsContainer.replaceChildren();
  tasksSeperatedByFrequency.forEach((taskSeperatedByFrequency) => {
    taskCardsContainer.appendChild(taskCardContainer(taskSeperatedByFrequency));
  });
};

// Filtering and Searching functions
const filterTasksByStatus = (tasks, status) => {
  if (status === TaskStatus.ALL) {
    return tasks;
  }
  if (status === TaskStatus.COMPLETED) {
    return tasks.filter((tasks) => tasks.status === TaskStatus.COMPLETED);
  }
  if (status === TaskStatus.PENDING) {
    return tasks.filter((task) => task.status === TaskStatus.PENDING);
  }
  if (status === TaskStatus.OVERDUE) {
    return tasks.filter((task) => task.status === TaskStatus.OVERDUE);
  }
};
const searchTasks = (page, tasks, searchInput, selectedStatus) => {
  if (searchInput) {
    const searchedTasks = tasks.filter((tasks) =>
      tasks.title.toLowerCase().includes(searchInput.toLowerCase()),
    );
    renderTasks(page, searchedTasks, selectedStatus);
  } else {
    showToast({
      category: "warning",
      title: "Search input is empty",
      description: "Search input is empty. Please enter a search term.",
    });
  }
};
const filterBtnClickHandler = (
  page,
  tasksSeperatedByFrequency,
  selectedStatus,
  clickedButton,
) => {
  filterBtnStateHandler(page, clickedButton);
  const inputValue = page.querySelector("#tasksSearchInput").value.trim();
  if (inputValue !== "") {
    searchTasks(page, tasksSeperatedByFrequency, inputValue, selectedStatus);
    return;
  }
  renderTasks(page, tasksSeperatedByFrequency, selectedStatus);
};
const filterBtnStateHandler = (page, clickedButton) => {
  const filterButtons = page.querySelectorAll("#taskStatusFilterGroup button");

  filterButtons.forEach((button) => {
    if (button === clickedButton) {
      button.setAttribute("data-variant", "primary");
    } else {
      button.setAttribute("data-variant", "outline");
    }
  });
};

export function showMoreInfoDialog(prams) {
  document.getElementById("pageContent").appendChild(showTaskInfo(prams));
  document.getElementById("showTaskInfo").showModal();
}
