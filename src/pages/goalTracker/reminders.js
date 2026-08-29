import remindersTemplate from "@/pages/goalTracker/reminders.html?raw";
import simpleCards from "@/components/simpleStatsCards/simpleStatsCards.js";

let selectedStatus = "All";
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
      .querySelector("#searchReminderInput")
      .value.trim();
    remindersSearch(reminders, searchInput, selectedStatus);
  });

  console.log("Reminders with status:", reminders);
  return clone;
}

const addStatusToReminder = (reminders) => {
  reminders.forEach((reminder) => {
    if (
      !reminder.isAcknowledged &&
      new Date(reminder.reminderDateTime) > new Date()
    ) {
      reminder.status = "Pending";
      return;
    }
    if (reminder.isAcknowledged) {
      reminder.status = "Completed";
      return;
    }
    if (
      !reminder.isAcknowledged &&
      new Date(reminder.reminderDateTime) < new Date()
    ) {
      reminder.status = "Overdue";
    }
  });
};

const reminderStatsGenerator = (reminders) => {
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter(
    (reminder) => reminder.status === "Completed",
  ).length;
  const pendingReminders = reminders.filter(
    (reminder) => reminder.status === "Pending",
  ).length;
  const overdueReminders = reminders.filter(
    (reminder) => reminder.status === "Overdue",
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
    // reminderCardsContainer.appendChild(reminderCard(reminder)); // TODO: Add reminderCard
  });
};

const filterRemindersByStatus = (reminders, status) => {
  if (status === "All") {
    return reminders;
  }
  if (status === "Completed") {
    return reminders.filter((reminder) => reminder.status === "Completed");
  }
  if (status === "Pending") {
    return reminders.filter((reminder) => reminder.status === "Pending");
  }
  if (status === "Overdue") {
    return reminders.filter((reminder) => reminder.status === "Overdue");
  }
};

const remindersSearch = (reminders, searchInput, selectedStatus) => {
  if (searchInput) {
    console.log("Searching ...");
    const filteredReminders = reminders.filter((reminder) => {
      const matchesStatus =
        selectedStatus === "All" || reminder.status === selectedStatus;
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
      //   reminderCardsContainer.appendChild(reminderCard(reminder)); // TODO: Add reminderCard
    });
    console.log("filteredReminders:", filteredReminders);
  } else {
    //TODO: add a message to the user that the search input is empty
    console.log("Search input is empty.");
  }
};
