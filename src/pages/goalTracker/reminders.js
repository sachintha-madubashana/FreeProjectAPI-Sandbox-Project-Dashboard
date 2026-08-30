import remindersTemplate from "@/pages/goalTracker/reminders.html?raw";
import simpleCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import reminderCard from "@/components/cards/reminderCard/reminderCard.js";
import addAndEditReminder from "@/components/dialogs/addAndEditReminder/addAndEditReminder.js";

const ReminderStatus = Object.freeze({
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed",
  OVERDUE: "overdue",
});

let selectedStatus = ReminderStatus.ALL;
export default function reminders() {
  const template = document.createElement("template");
  template.innerHTML = remindersTemplate;
  const clone = document.importNode(template.content, true);

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

  addStatusToReminder(reminders);

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

const addStatusToReminder = (reminders) => {
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
  filterRemindersByStatus(reminders, selectedStatus).forEach((reminder) => {
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
    console.log("Searching ...");
    const filteredReminders = reminders.filter((reminder) => {
      const matchesStatus =
        selectedStatus === ReminderStatus.ALL ||
        reminder.status === selectedStatus;
      const matchesSearch = reminder.title
        .toLowerCase()
        .includes(searchInput.toLowerCase());

      return matchesStatus && matchesSearch;
    });
    const reminderCardsContainer = document.querySelector(
      "#reminderCardsContainer",
    );
    reminderCardsContainer.replaceChildren();
    filteredReminders.forEach((reminder) => {
      reminderCardsContainer.appendChild(reminderCard(reminder));
    });
    console.log("filteredReminders:", filteredReminders);
  } else {
    //TODO: add a message to the user that the search input is empty
    console.log("Search input is empty.");
  }
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
