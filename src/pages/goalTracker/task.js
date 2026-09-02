import taskTemplate from "@/pages/goalTracker/task.html?raw";
import statsCards, {
  simpleStatsCardSkeleton,
} from "@/components/cards/simpleStatsCard/simpleStatsCard.js";
import taskCardContainer, {
  taskCardContainerSkeleton,
} from "@/components/cards/taskCardContainer/taskCardContainer.js";
import showTaskInfo from "@/components/dialogs/showTaskInfo/showTaskInfo.js";
import addAndEditTask from "@/components/dialogs/addAndEditTask/addAndEditTask.js";
import {
  getLoggedUser,
  generateDialogAndShow,
} from "@/pages/goalTracker/goalTracker.js";
import requestHandler from "@/utils/requestHandler.js";
import showToast from "@/utils/toastSystem.js";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";

export const TaskStatus = Object.freeze({
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
      addMissingTaskProperties(fetchedTasks).then(() => {
        addStatusToTasks(fetchedTasks);
        updateTasksStats(page, fetchedTasks);
        tasksSeperatedByFrequency.push(
          ...taskSeperatedByFrequencyGenerator(fetchedTasks),
        );
        renderTasks(page, tasksSeperatedByFrequency);
      });
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
    const searchInput = page.querySelector("#tasksSearchInput").value.trim();
    searchTasks(page, tasksSeperatedByFrequency, searchInput, selectedStatus);
  });

  page.querySelector("#tasksSearchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const searchInput = e.target.value.trim();
      searchTasks(page, tasksSeperatedByFrequency, searchInput, selectedStatus);
    }
    if (e.key === "Backspace" && e.target.value.trim() === "") {
      renderTasks(page, tasksSeperatedByFrequency);
    }
  });

  page.querySelector("#addTaskBtn").addEventListener("click", () => {
    const data = {
      dialogId: "addTaskDialog",
      confermButtonText: "Save Task",
      onConfirm: (task) => {
        addTaskToAPI(task).then((response) => {
          if (response) {
            task.taskId = response.taskId;
          }

          const statusAddedTask = addStatusToATask(task);
          const index = indexOfFrequencyGroup(
            tasksSeperatedByFrequency,
            task.frequency,
          );
          tasksSeperatedByFrequency[index].tasks.push(statusAddedTask);
          updateTasksStats(page, getAllTasks(tasksSeperatedByFrequency));
          renderTasks(page, tasksSeperatedByFrequency);
        });
      },
      title: "Add Task",
      description: "You can add a new task here. Click save when you're done.",
    };
    generateDialogAndShow(addAndEditTask, data);
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
  page.addEventListener("task", (e) => {
    if (e.detail.action === "viewDetails") {
      seeMoreInfo(e.detail.item);
    }
    if (e.detail.action === "deleteTask") {
      deleteTask(page, tasksSeperatedByFrequency, e.detail.item);
    }
    if (e.detail.action === "updateTask") {
      updateTask(page, tasksSeperatedByFrequency, e.detail.item);
    }
    if (e.detail.action === "markAsComplete") {
      markAsComplete(page, tasksSeperatedByFrequency, e.detail.item);
    }
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
const addStatusToATask = (task) => {
  if (!task.isCompleted && new Date(task.dueDate) > new Date()) {
    task.status = TaskStatus.PENDING;
    return task;
  }
  if (task.isCompleted) {
    task.status = TaskStatus.COMPLETED;
    return task;
  }
  if (!task.isCompleted && new Date(task.dueDate) < new Date()) {
    task.status = TaskStatus.OVERDUE;
    return task;
  }
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
const indexOfFrequencyGroup = (tasksSeperatedByFrequency, frequency) => {
  return tasksSeperatedByFrequency.findIndex(
    (group) => group.frequency.toLowerCase() === frequency.toLowerCase(),
  );
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
const addMissingTaskProperties = async (tasks) => {
  await Promise.all(
    tasks.map(async (task) => {
      const data = await loadTaskDetails(task.taskId);
      task.startDate = data.startDate;
      task.description = data.description;
    }),
  );
};
const loadTaskDetails = async (taskId) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/getTask/" + taskId,
      "GET",
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
const getAllTasks = (tasksSeperatedByFrequency) => {
  return tasksSeperatedByFrequency.flatMap((group) => group.tasks);
};
const renderTasks = (root, tasksSeperatedByFrequency, isFiltered = false) => {
  const taskCardsContainer = root.querySelector("#taskCardsContainer");
  taskCardsContainer.replaceChildren();

  if (!isFiltered) {
    tasksSeperatedByFrequency = filterTasksByStatus(
      tasksSeperatedByFrequency,
      selectedStatus,
    );
  }

  tasksSeperatedByFrequency.forEach((searchedTasksGroup) => {
    taskCardsContainer.appendChild(taskCardContainer(searchedTasksGroup));
  });
};

// Filtering and Searching functions
const filterTasksByStatus = (taskSeperatedByFrequency, status) => {
  if (status === TaskStatus.ALL) {
    return taskSeperatedByFrequency;
  }

  return taskSeperatedByFrequency.map((group) => {
    const filteredTasks = group.tasks.filter((task) => task.status === status);

    return {
      ...group,
      tasks: filteredTasks,
    };
  });
};
const searchTasks = (
  page,
  tasksSeperatedByFrequency,
  searchInput,
  selectedStatus,
) => {
  if (searchInput) {
    const query = searchInput.toLowerCase().trim();

    const searchedTasks = tasksSeperatedByFrequency.map((group) => {
      const filteredTasks = group.tasks.filter(
        (task) =>
          task.taskName.toLowerCase().includes(query) &&
          (selectedStatus === TaskStatus.ALL || task.status === selectedStatus),
      );

      return {
        ...group,
        tasks: filteredTasks,
      };
    });
    renderTasks(page, searchedTasks, true);
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

//Card Action functions
const updateTask = (page, tasksSeperatedByFrequency, taskItem, successMsg) => {
  updateTaskToAPI(taskItem, successMsg);
  const item = addStatusToATask(taskItem);
  const index = indexOfFrequencyGroup(
    tasksSeperatedByFrequency,
    item.frequency,
  );
  const taskIndex = tasksSeperatedByFrequency[index].tasks.findIndex(
    (t) => t.taskId === item.taskId,
  );
  tasksSeperatedByFrequency[index].tasks[taskIndex] = item;
  updateTasksStats(page, getAllTasks(tasksSeperatedByFrequency));
  renderTasks(page, tasksSeperatedByFrequency);
};
const deleteTask = (page, tasksSeperatedByFrequency, taskItem) => {
  const data = {
    dialogId: "confirmationDialog",
    title: "Delete Task",
    description:
      "Are you sure you want to delete this task? This action cannot be undone.",
    confermButtonText: "Delete",
    onConfirm: () => {
      deleteTaskFromAPI(taskItem.taskId);
      const groupIndex = indexOfFrequencyGroup(
        tasksSeperatedByFrequency,
        taskItem.frequency,
      );
      const taskIndex = tasksSeperatedByFrequency[groupIndex].tasks.findIndex(
        (t) => t.taskId === taskItem.taskId,
      );
      if (taskIndex !== -1) {
        tasksSeperatedByFrequency[groupIndex].tasks.splice(taskIndex, 1);
      }
      updateTasksStats(page, getAllTasks(tasksSeperatedByFrequency));
      renderTasks(page, tasksSeperatedByFrequency);
    },
  };
  generateDialogAndShow(confirmationDialog, data);
};
const seeMoreInfo = (taskItem) => {
  const dialogData = {
    dialogId: "showTaskInfo",
    title: taskItem.taskName,
    description: taskItem.description || "No description available.",
    status: {
      Frequency: {
        value: taskItem.frequency,
        icon: "Goal",
      },
      Status: {
        value: capitalizeFirstLetter(taskItem.status),
        icon: "Goal",
      },
      "Remaining Time": {
        value: findRemainingDays(taskItem.dueDate) + " days",
        icon: "Goal",
      },
      "Created Date": {
        value: dateFormatter(taskItem.createdDate),
        icon: "Goal",
      },
      "Start Date": {
        value: dateFormatter(taskItem.startDate),
        icon: "Goal",
      },
      "Due Date": {
        value: dateFormatter(taskItem.dueDate),
        icon: "Goal",
      },
    },
    data: taskItem,
  };

  generateDialogAndShow(showTaskInfo, dialogData);
};
const markAsComplete = (page, tasksSeperatedByFrequency, taskItem) => {
  const toastData = { category: "success" };
  if (taskItem.isCompleted) {
    toastData.title = "Reminder Completed";
    toastData.description = "The reminder has been marked as completed.";
  } else {
    toastData.title = "Reminder Uncompleted";
    toastData.description = "The reminder has been marked as uncompleted.";
  }
  updateTask(page, tasksSeperatedByFrequency, taskItem);
};

// API Interaction functions
const addTaskToAPI = async (task) => {
  try {
    task.userId = getLoggedUser().userId;
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/createTask/",
      "POST",
      task,
    );
    showToast({
      category: "success",
      title: "Task Added",
      description: "The task has been successfully added.",
    });

    return response;
  } catch (error) {
    console.error("Error adding task:", error);
    showToast({
      category: "error",
      title: "Error Adding Task",
      description: "There was an error adding the task. Please try again.",
    });
  }
};
const updateTaskToAPI = async (task, successMsg = null) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/updateTask/" +
        task.taskId,
      "PUT",
      task,
    );
    showToast(
      successMsg ?? {
        category: "success",
        title: "Task Updated",
        description: "The task has been successfully updated.",
      },
    );

    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    showToast({
      category: "error",
      title: "Error Updating Task",
      description: "There was an error updating the task. Please try again.",
    });
  }
};
const deleteTaskFromAPI = async (taskId) => {
  try {
    task.userId = getLoggedUser().userId;
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/deleteTask/" + taskId,
      "DELETE",
    );
    showToast({
      category: "success",
      title: "Task Deleted",
      description: "The task has been successfully deleted.",
    });

    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    showToast({
      category: "error",
      title: "Error deleting Task",
      description: "There was an error deleting the task. Please try again.",
    });
  }
};

// Utility functions
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const findRemainingDays = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffInMs = due - now;

  const remainingDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return remainingDays;
};
const dateFormatter = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Colombo",
    hour12: false,
  });
};
