import reminderCardTemplate from "@/components/cards/reminderCard/reminderCard.html?raw";
import reminderCardSkeletonTemplate from "@/components/cards/reminderCard/reminderCardSkeleton.html?raw";
import addAndEditReminder from "@/components/dialogs/addAndEditReminder/addAndEditReminder.js";
import {
  updateReminders,
  deleteReminder,
  seeReminderDetails,
  markAsComplete,
} from "@/pages/goalTracker/reminders.js";

const createTemplate = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  return document.importNode(template.content, true);
};

export default function reminderCard(props) {
  const clone = createTemplate(reminderCardTemplate);
  const page = clone.querySelector(".card");

  page.querySelector(".reminder-title").textContent =
    props?.title ?? "Reminder Title";
  page.querySelector(".reminder-description").textContent =
    props?.description || "";
  page.querySelector(".reminder-start-date").textContent =
    "Reminder Time : " +
    new Date(props?.reminderDateTime).toLocaleString(
      "en-US",
      {
        month: "2-digit",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Colombo",
        hour12: false,
      } || "Due Date",
    );

  page.querySelector(".reminder-card-header").append(badge(props?.status));

  setupEventListeners(page, props);

  return clone;
}

// Set up Functions
const setupEventListeners = (page, props) => {
  const dropdown = page.querySelector("#moreActionDropdown");
  page.addEventListener("mouseleave", () => {
    dropdown.close();
  });

  page.addEventListener("click", () => {
    seeReminderDetails(props?.reminderId);
  });

  page
    .querySelector("#moreActionDropdownTrigger")
    .addEventListener("click", (e) => {
      e.stopPropagation();
    });

  page.querySelector("#moreInfoReminderBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    seeReminderDetails(props?.reminderId);
  });

  page
    .querySelector("#markAsCompleteReminderBtn")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      markAsComplete(props?.reminderId);
    });

  page.querySelector("#editReminderBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    const data = {
      dialogId: "reminderId" + props?.reminderId,
      title: "Edit Reminder",
      description:
        "Edit the details of your reminder. When you are done, click the save button to save the changes.",
      saveBtnText: "Save Changes",
      data: props,
      onAction: (reminderItem) => {
        updateReminders(reminderItem);
      },
    };
    document
      .getElementById("pageContent")
      .appendChild(addAndEditReminder(data));
    document.getElementById("reminderId" + props?.reminderId).showModal();
  });

  page.querySelector("#deleteReminderBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteReminder(props?.reminderId);
  });
};
const badge = (type) => {
  const template = document.createElement("template");

  const classMapping = {
    pending:
      "badge bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    completed:
      "badge bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    overdue: "badge bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  let htmlString = `<span class="${classMapping[type]}">${capitalizeFirstLetter(type)}</span>`;

  template.innerHTML = htmlString.trim();

  return template.content.firstElementChild;
};
const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Skeleton
export function reminderCardSkeleton() {
  return createTemplate(reminderCardSkeletonTemplate);
}
