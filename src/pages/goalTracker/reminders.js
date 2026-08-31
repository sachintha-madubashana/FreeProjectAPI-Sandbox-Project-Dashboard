import remindersTemplate from "@/pages/goalTracker/reminders.html?raw";
import simpleCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import reminderCard from "@/components/cards/reminderCard/reminderCard.js";
import addAndEditReminder from "@/components/dialogs/addAndEditReminder/addAndEditReminder.js";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";
import reminderMoreInfo from "@/components/dialogs/reminderMoreInfo/reminderMoreInfo.js";
import empty from "@/components/empty/empty.js";
import { showToast } from "@/utils/toastSystem.js";

const ReminderStatus = Object.freeze({
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed",
  OVERDUE: "overdue",
});

let selectedStatus = ReminderStatus.ALL;

const reminders = [
  {
    reminderId: 229,
    title: "Reminder 1",
    description: "Description for Reminder 1",
    reminderDateTime: "2026-08-27T16:10:00",
    isAcknowledged: true,
    userId: 9583,
  },
  {
    reminderId: 230,
    title: "Reminder 2",
    description: "Description for Reminder 2",
    reminderDateTime: "2026-08-30T20:10:00",
    isAcknowledged: false,
    userId: 9583,
  },
  {
    reminderId: 231,
    title: "Reminder 3",
    description: "Description for Reminder 3",
    reminderDateTime: "2026-08-27T16:10:00",
    isAcknowledged: false,
    userId: 9583,
  },
  {
    reminderId: 232,
    title: "Reminder 4",
    description: "Description for Reminder 4",
    reminderDateTime: "2026-08-30T20:10:00",
    isAcknowledged: false,
    userId: 9583,
  },
];
export default function remindersPage() {
  const template = document.createElement("template");
  template.innerHTML = remindersTemplate;
  const clone = document.importNode(template.content, true);

  addStatusToReminders(reminders);

  const remindersStatus = reminderStatsGenerator(reminders);
  remindersStatus.forEach((stats) => {
    clone
      .querySelector("#reminderStatsCardsContainer")
      .appendChild(simpleCards(stats));
  });

  renderReminders(clone, reminders, selectedStatus);

  clone.querySelector("#searchReminderBtn").addEventListener("click", () => {
    const searchInput = document
      .querySelector("#searchRemindersInput")
      .value.trim();
    remindersSearch(reminders, searchInput, selectedStatus);
  });

  clone.querySelector("#addReminderBtn").addEventListener("click", () => {
    const data = {
      dialogId: "addReminderDialog",
      title: "Add Reminder",
      description:
        "You can add a new reminder here. When you are done, click the save button to save the reminder.",
      saveBtnText: "Add Reminder",
      onAction: (reminderItem) => {
        addStatusToAReminder(reminderItem);
        addReminderToAPI(reminderItem);
        reminders.push(reminderItem);
        renderReminders(document, reminders, selectedStatus);
        console.log("Reminder item saved:", reminderItem);
        // TODO: Call API to update reminder with reminderItem data
      },
    };
    document
      .getElementById("pageContent")
      .appendChild(addAndEditReminder(data));
    document.getElementById(data.dialogId).showModal();
  });

  clone
    .querySelector("#filterAllRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.ALL;
      filterBtnClickHandler(reminders, selectedStatus, e.currentTarget);
    });
  clone
    .querySelector("#filterCompletedRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.COMPLETED;
      filterBtnClickHandler(reminders, selectedStatus, e.currentTarget);
    });
  clone
    .querySelector("#filterPendingRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.PENDING;
      filterBtnClickHandler(reminders, selectedStatus, e.currentTarget);
    });
  clone
    .querySelector("#filterOverdueRemindersBtn")
    .addEventListener("click", (e) => {
      selectedStatus = ReminderStatus.OVERDUE;
      filterBtnClickHandler(reminders, selectedStatus, e.currentTarget);
    });
  return clone;
}

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

const renderReminders = (clone, reminders, selectedStatus) => {
  const reminderCardsContainer = clone.querySelector("#reminderCardsContainer");
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

const remindersSearch = (reminders, searchInput, selectedStatus) => {
  if (searchInput) {
    const filteredReminders = reminders.filter((reminder) => {
      const matchesStatus =
        selectedStatus === ReminderStatus.ALL ||
        reminder.status === selectedStatus;
      const matchesSearch = reminder.title
        .toLowerCase()
        .includes(searchInput.toLowerCase());

      return matchesStatus && matchesSearch;
    });
    renderReminders(document, filteredReminders, selectedStatus);
  } else {
    showToast({
      category: "warning",
      title: "Search input is empty",
      description: "Search input is empty. Please enter a search term.",
    });
  }
};

const showEmptyUI = (container, emptyData) => {
  const emptyTemplate = empty(emptyData);
  emptyTemplate
    .querySelector(".empty")
    .classList.add("col-span-1", "md:col-span-2", "lg:col-span-3");
  container.appendChild(emptyTemplate);
};

const filterBtnClickHandler = (reminders, selectedStatus, clickedButton) => {
  renderReminders(document, reminders, selectedStatus);
  document.querySelector("#searchRemindersInput").value = "";
  filterBtnStateHandler(clickedButton);
};

const filterBtnStateHandler = (clickedButton) => {
  const filterButtons = document.querySelectorAll(
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

const addReminderToAPI = (reminder) => {
  reminder.userId = 9583; //TODO: Get the userId from the logged in user
  //TODO: Call API to add reminder
  console.log("Add reminder to API");

  console.log("Get reminder from API");
  reminder.reminderId = 233; //TODO: Get the reminderId from the API response
};

const updateReminderToAPI = (reminder) => {
  reminder.userId = 9583; //TODO: Get the userId from the logged in user
  //TODO: Call API to add reminder
  console.log("Update reminder to API");
};

const updateReminders = (reminderItem) => {
  addStatusToAReminder(reminderItem);
  updateReminderToAPI(reminderItem);
  const index = reminders.findIndex(
    (r) => r.reminderId === reminderItem.reminderId,
  );
  if (index !== -1) {
    reminders[index] = reminderItem;
  }
  renderReminders(document, reminders, selectedStatus);
};

const deleteReminderFromAPI = (reminderId) => {
  //TODO: Call API to delete reminder
  console.log("Delete reminder from API for reminderId:", reminderId);
};

const deleteReminder = (reminderId) => {
  const data = {
    dialogId: "confirmationDialog",
    title: "Delete Reminder",
    description:
      "Are you sure you want to delete this reminder? This action cannot be undone.",
    confermButtonText: "Delete",
    onConfirm: () => {
      deleteReminderFromAPI(reminderId);
      const index = reminders.findIndex((r) => r.reminderId === reminderId);
      if (index !== -1) {
        reminders.splice(index, 1);
      }
      renderReminders(document, reminders, selectedStatus);
    },
  };

  document.getElementById("pageContent").appendChild(confirmationDialog(data));
  document.getElementById("confirmationDialog").showModal();
};

const seeReminderDetails = (reminderId) => {
  const reminder = reminders.find((r) => r.reminderId === reminderId);
  if (reminder) {
    const data = {
      dialogId: "reminderDetailsDialog" + reminderId,
      title: "Reminder Details",
      description: "Here are the details of your reminder.",
      data: reminder,
    };
    document.getElementById("pageContent").appendChild(reminderMoreInfo(data));
    document.getElementById("reminderDetailsDialog" + reminderId).showModal();
  }
};

export { updateReminders, deleteReminder, seeReminderDetails };
