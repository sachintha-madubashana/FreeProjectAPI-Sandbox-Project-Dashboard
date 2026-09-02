import remindersTemplate from "@/pages/goalTracker/reminders.html?raw";
import simpleCard, {
  simpleStatsCardSkeleton as reminderStatsCardSkeleton,
} from "@/components/simpleStatsCard/simpleStatsCard.js";
import reminderCard, {
  reminderCardSkeleton,
} from "@/components/cards/reminderCard/reminderCard.js";
import addAndEditReminder from "@/components/dialogs/addAndEditReminder/addAndEditReminder.js";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";
import reminderMoreInfo from "@/components/dialogs/reminderMoreInfo/reminderMoreInfo.js";
import empty from "@/components/empty/empty.js";
import { showToast } from "@/utils/toastSystem.js";
import requestHandler from "@/utils/requestHandler.js";
import {
  getLoggedUser,
  generateDialogAndShow,
} from "@/pages/goalTracker/goalTracker.js";

const ReminderStatus = Object.freeze({
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed",
  OVERDUE: "overdue",
});

let selectedStatus = ReminderStatus.ALL;

export default function remindersPage() {
  const template = document.createElement("template");
  template.innerHTML = remindersTemplate;
  const root = document.importNode(template.content, true);

  const reminders = [];
  const loggedUser = getLoggedUser();

  const page = root.querySelector("#remindersPage");
  renderReminderSkeletons(page);

  loadReminders(loggedUser.userId)
    .then((data) => {
      if (!data) {
        // TODO: Add Error UI
        // renderReminderError(root);
        return;
      }

      reminders.push(...data);

      addStatusToReminders(reminders);

      updateRemindersStats(page, reminders);
      renderReminders(page, reminders, selectedStatus);
    })
    .catch((error) => {
      console.error("Failed to load reminders:", error);
      // TODO: Add Error UI
      // renderReminderError(root);
    });

  setupEventListeners(page, reminders);

  return root;
}

//Set up functions
const renderReminderSkeletons = (page) => {
  const container = page.querySelector("#reminderStatsCardsContainer");
  const reminderCardsContainer = page.querySelector("#reminderCardsContainer");

  if (!container) return;
  container.replaceChildren();

  for (let i = 0; i < 4; i++) {
    container.appendChild(reminderStatsCardSkeleton());
  }

  if (!reminderCardsContainer) return;
  reminderCardsContainer.replaceChildren();
  for (let i = 0; i < 6; i++) {
    reminderCardsContainer.appendChild(reminderCardSkeleton());
  }
};
const setupEventListeners = (page, reminders) => {
  page.querySelector("#searchReminderBtn").addEventListener("click", () => {
    const searchInput = page
      .querySelector("#searchRemindersInput")
      .value.trim();
    searchReminders(page, reminders, searchInput, selectedStatus);
  });

  page.querySelector("#addReminderBtn").addEventListener("click", () => {
    const data = {
      dialogId: "addReminderDialog",
      title: "Add Reminder",
      description:
        "You can add a new reminder here. When you are done, click the save button to save the reminder.",
      saveBtnText: "Add Reminder",
      onAction: (reminderItem) => {
        addStatusToAReminder(reminderItem);
        addReminderToAPI(reminderItem)
          .then((apiResponse) => {
            if (apiResponse) {
              reminderItem.reminderId = apiResponse.reminderId;
            }
            reminders.push(reminderItem);
            renderReminders(page, reminders, selectedStatus);
            updateRemindersStats(page, reminders);
          })
          .catch((error) => {
            console.error("Failed to add reminder:", error);
          });

        console.log("Reminder item saved:", reminderItem);
        // TODO: Call API to update reminder with reminderItem data
      },
    };
    generateDialogAndShow(addAndEditReminder, data);
  });

  page.querySelector("#searchRemindersInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const searchInput = e.target.value.trim();
      searchReminders(page, reminders, searchInput, selectedStatus);
    }
    if (e.key === "Backspace" && e.target.value.trim() === "") {
      renderReminders(page, reminders, selectedStatus);
    }
  });

  page
    .querySelector("#filterAllRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.ALL;
      filterBtnClickHandler(page, reminders, selectedStatus, e.currentTarget);
    });
  page
    .querySelector("#filterCompletedRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.COMPLETED;
      filterBtnClickHandler(page, reminders, selectedStatus, e.currentTarget);
    });
  page
    .querySelector("#filterPendingRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.PENDING;
      filterBtnClickHandler(page, reminders, selectedStatus, e.currentTarget);
    });
  page
    .querySelector("#filterOverdueRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.OVERDUE;
      filterBtnClickHandler(page, reminders, selectedStatus, e.currentTarget);
    });

  page.addEventListener("reminder", (event) => {
    console.log("Received reminder:update event:", event.detail);
    if (event.detail.action === "update") {
      updateReminders(page, reminders, event.detail.item);
      return;
    }
    if (event.detail.action === "delete") {
      deleteReminder(page, reminders, event.detail.item);
      return;
    }
    if (event.detail.action === "viewDetails") {
      seeReminderDetails(event.detail.item);
      return;
    }
    if (event.detail.action === "markAsComplete") {
      markAsComplete(page, reminders, event.detail.item);
      return;
    }
  });
};
const addStatusToReminders = (reminders) => {
  reminders.forEach((reminder) => {
    if (
      !reminder.isAcknowledged &&
      new Date(reminder.reminderDateTime) > new Date()
    ) {
      reminder.status = ReminderStatus.PENDING;
      return;
    }
    if (reminder.isAcknowledged) {
      reminder.status = ReminderStatus.COMPLETED;
      return;
    }
    if (
      !reminder.isAcknowledged &&
      new Date(reminder.reminderDateTime) < new Date()
    ) {
      reminder.status = ReminderStatus.OVERDUE;
    }
  });
};
const addStatusToAReminder = (reminder) => {
  if (
    !reminder.isAcknowledged &&
    new Date(reminder.reminderDateTime) > new Date()
  ) {
    reminder.status = ReminderStatus.PENDING;
  }
  if (reminder.isAcknowledged) {
    reminder.status = ReminderStatus.COMPLETED;
  }
  if (
    !reminder.isAcknowledged &&
    new Date(reminder.reminderDateTime) < new Date()
  ) {
    reminder.status = ReminderStatus.OVERDUE;
  }
  return reminder;
};
const reminderStatsGenerator = (reminders) => {
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter(
    (reminder) => reminder.status === ReminderStatus.COMPLETED,
  ).length;
  const pendingReminders = reminders.filter(
    (reminder) => reminder.status === ReminderStatus.PENDING,
  ).length;
  const overdueReminders = reminders.filter(
    (reminder) => reminder.status === ReminderStatus.OVERDUE,
  ).length;

  return [
    {
      title: "Total Reminders",
      value: totalReminders,
      icon: "Bell",
    },
    {
      title: "Completed Reminders",
      value: completedReminders,
      icon: "AlarmClockCheck",
    },
    {
      title: "Pending Reminders",
      value: pendingReminders,
      icon: "Ellipsis",
    },
    {
      title: "Overdue Reminders",
      value: overdueReminders,
      icon: "RotateCwFadingClock",
    },
  ];
};

// Data fetching functions
const loadReminders = async (userId) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/getReminders",
      "GET",
      { userId: userId },
    );

    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};

// Stats Rendering functions
const updateRemindersStats = (root, reminders) => {
  const remindersStatus = reminderStatsGenerator(reminders);
  const reminderStatsCardsContainer = root.querySelector(
    "#reminderStatsCardsContainer",
  );
  reminderStatsCardsContainer.replaceChildren();
  remindersStatus.forEach((stats) => {
    reminderStatsCardsContainer.appendChild(simpleCard(stats));
  });
};
const renderReminders = (root, reminders, selectedStatus) => {
  const reminderCardsContainer = root.querySelector("#reminderCardsContainer");
  reminderCardsContainer.replaceChildren();
  const filteredReminders = filterRemindersByStatus(reminders, selectedStatus);

  if (filteredReminders.length === 0) {
    const emptyData = {
      title: "No reminders found",
      description: "No reminders found for the selected status.",
      icon: "BellOff",
    };
    showEmptyUI(reminderCardsContainer, emptyData);
    return;
  }

  filteredReminders.forEach((reminder) => {
    reminderCardsContainer.appendChild(reminderCard(reminder));
  });
};

// Filtering and Searching functions
const filterRemindersByStatus = (reminders, status) => {
  if (status === ReminderStatus.ALL) {
    return reminders;
  }
  if (status === ReminderStatus.COMPLETED) {
    return reminders.filter(
      (reminder) => reminder.status === ReminderStatus.COMPLETED,
    );
  }
  if (status === ReminderStatus.PENDING) {
    return reminders.filter(
      (reminder) => reminder.status === ReminderStatus.PENDING,
    );
  }
  if (status === ReminderStatus.OVERDUE) {
    return reminders.filter(
      (reminder) => reminder.status === ReminderStatus.OVERDUE,
    );
  }
};
const searchReminders = (page, reminders, searchInput, selectedStatus) => {
  if (searchInput) {
    const searchedReminders = reminders.filter((reminder) =>
      reminder.title.toLowerCase().includes(searchInput.toLowerCase()),
    );
    renderReminders(page, searchedReminders, selectedStatus);
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
  reminders,
  selectedStatus,
  clickedButton,
) => {
  filterBtnStateHandler(page, clickedButton);
  if (page.querySelector("#searchRemindersInput").value.trim() !== "") {
    searchReminders(
      page,
      reminders,
      page.querySelector("#searchRemindersInput").value,
      selectedStatus,
    );
    return;
  }
  renderReminders(page, reminders, selectedStatus);
};

// UI functions
const showEmptyUI = (container, emptyData) => {
  const emptyTemplate = empty(emptyData);
  emptyTemplate
    .querySelector(".empty")
    .classList.add("col-span-1", "md:col-span-2", "lg:col-span-3");
  container.appendChild(emptyTemplate);
};
const filterBtnStateHandler = (page, clickedButton) => {
  const filterButtons = page.querySelectorAll(
    "#reminderStatusFilterGroup button",
  );

  filterButtons.forEach((button) => {
    if (button === clickedButton) {
      button.setAttribute("data-variant", "primary");
    } else {
      button.setAttribute("data-variant", "outline");
    }
  });
};

// API Interaction functions
const addReminderToAPI = async (reminder) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/createReminder",
      "POST",
      {
        title: reminder.title,
        description: reminder.description,
        reminderDateTime: reminder.reminderDateTime,
        isAcknowledged: reminder.isAcknowledged,
        userId: getLoggedUser().userId,
      },
    );
    showToast({
      category: "success",
      title: "Reminder Added",
      description: "The reminder has been successfully added.",
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};
const updateReminderToAPI = async (reminder, toastMsgData) => {
  try {
    await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/updateReminder/" +
        reminder.reminderId,
      "PUT",
      {
        reminderId: reminder.reminderId,
        title: reminder.title,
        description: reminder.description,
        reminderDateTime: reminder.reminderDateTime,
        isAcknowledged: reminder.isAcknowledged,
        userId: getLoggedUser().userId,
      },
    );
    showToast(
      toastMsgData || {
        category: "success",
        title: "Reminder Updated",
        description: "The reminder has been successfully updated.",
      },
    );
  } catch (error) {
    showToast({
      category: "error",
      title: "Update Failed",
      description: "Failed to update the reminder. Please try again later.",
    });
    console.error("Error fetching dashboard stats:", error);
  }
};
const deleteReminderFromAPI = async (reminderId) => {
  try {
    await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/deleteReminder/" +
        reminderId,
      "DELETE",
    );
    showToast({
      category: "success",
      title: "Reminder Deleted",
      description: "The reminder has been successfully deleted.",
    });
  } catch (error) {
    showToast({
      category: "error",
      title: "Delete Failed",
      description: "Failed to delete the reminder. Please try again later.",
    });
    console.error("Error fetching dashboard stats:", error);
  }
};

// Reminder Card Action functions
const updateReminders = (page, reminders, reminderItem) => {
  const item = addStatusToAReminder(reminderItem);
  updateReminderToAPI(item);
  const index = reminders.findIndex((r) => r.reminderId === item.reminderId);
  if (index !== -1) {
    reminders[index] = item;
  }
  renderReminders(page, reminders, selectedStatus);
  updateRemindersStats(page, reminders);
};
const deleteReminder = (page, reminders, reminderItem) => {
  const data = {
    dialogId: "confirmationDialog",
    title: "Delete Reminder",
    description:
      "Are you sure you want to delete this reminder? This action cannot be undone.",
    confermButtonText: "Delete",
    onConfirm: () => {
      deleteReminderFromAPI(reminderItem.reminderId);
      const index = reminders.findIndex(
        (r) => r.reminderId === reminderItem.reminderId,
      );
      if (index !== -1) {
        reminders.splice(index, 1);
      }
      renderReminders(page, reminders, selectedStatus);
      updateRemindersStats(page, reminders);
    },
  };

  document.getElementById("pageContent").appendChild(confirmationDialog(data));
  document.getElementById("confirmationDialog").showModal();
};
const seeReminderDetails = (reminder) => {
  if (reminder) {
    const data = {
      dialogId: "reminderDetailsDialog" + reminder.id,
      title: "Reminder Details",
      description: "Here are the details of your reminder.",
      data: reminder,
    };
    generateDialogAndShow(reminderMoreInfo, data);
  }
};
const markAsComplete = (page, reminders, reminderItem) => {
  const toastData = { category: "success" };
  reminderItem.isAcknowledged = !reminderItem.isAcknowledged;

  if (reminderItem.isAcknowledged) {
    reminderItem.status = ReminderStatus.COMPLETED;
    toastData.title = "Reminder Completed";
    toastData.description = "The reminder has been marked as completed.";
  } else {
    reminderItem = addStatusToAReminder(reminderItem);
    const index = reminders.findIndex(
      (r) => r.reminderId === reminderItem.reminderId,
    );
    if (index !== -1) {
      reminders[index] = reminderItem;
    }
    toastData.title = "Reminder Uncompleted";
    toastData.description = "The reminder has been marked as uncompleted.";
  }
  updateReminderToAPI(reminderItem, toastData);
  renderReminders(page, reminders, selectedStatus);
  updateRemindersStats(page, reminders);
};
