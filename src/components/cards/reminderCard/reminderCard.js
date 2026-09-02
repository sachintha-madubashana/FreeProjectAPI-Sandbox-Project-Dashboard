import reminderCardTemplate from "@/components/cards/reminderCard/reminderCard.html?raw";
import reminderCardSkeletonTemplate from "@/components/cards/reminderCard/reminderCardSkeleton.html?raw";
import addAndEditReminder from "@/components/dialogs/addAndEditReminder/addAndEditReminder.js";
import { generateDialogAndShow } from "@/pages/goalTracker/goalTracker.js";

const createTemplate = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  return document.importNode(template.content, true);
};

export default function reminderCard(props) {
  const clone = createTemplate(reminderCardTemplate);
  const page = clone.querySelector(".card");

  const checkIcon = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-circle-check-icon lucide-circle-check"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>`;
  const nonCheckIcon = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-circle-x-icon lucide-circle-x"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>`;

  page.querySelector(".reminder-title").textContent =
    props?.title ?? "Reminder Title";
  page.querySelector(".reminder-description").textContent =
    props?.description ?? "No description provided.";
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

  const markAsCompleteBtn = page.querySelector("#markAsCompleteReminderBtn");
  if (markAsCompleteBtn) {
    const isCompleted = props?.status === "completed";
    markAsCompleteBtn.innerHTML = isCompleted ? nonCheckIcon : checkIcon;
    if (isCompleted) {
      markAsCompleteBtn.setAttribute("data-tooltip", "Mark as Uncomplete");
      markAsCompleteBtn.classList.add(
        "btn",
        "bg-amber-100",
        "dark:bg-amber-950",
        "text-amber-950",
        "dark:text-amber-400",
        "hover:bg-amber-200",
        "dark:hover:bg-amber-900",
      );
      markAsCompleteBtn.classList.remove(
        "bg-green-100",
        "dark:bg-green-950",
        "text-green-950",
        "dark:text-green-400",
        "hover:bg-green-200",
        "dark:hover:bg-green-900",
      );
    } else {
      markAsCompleteBtn.classList.add(
        "btn",
        "bg-green-100",
        "dark:bg-green-950",
        "text-green-950",
        "dark:text-green-400",
        "hover:bg-green-200",
        "dark:hover:bg-green-900",
      );
      markAsCompleteBtn.classList.remove(
        "bg-amber-100",
        "dark:bg-amber-950",
        "text-amber-950",
        "dark:text-amber-400",
        "hover:bg-amber-200",
        "dark:hover:bg-amber-900",
      );
    }
  }
  page.querySelector(".reminder-card-header").append(badge(props?.status));

  setupEventListeners(page, props);
  return clone;
}

// Set up Functions
const setupEventListeners = (page, props) => {
  setupMouseEventListener(page);

  page.addEventListener("click", () => {
    page.dispatchEvent(
      new CustomEvent("reminder", {
        detail: { item: props, action: "viewDetails" },
        bubbles: true,
      }),
    );
  });

  page
    .querySelector("#moreActionDropdownTrigger")
    .addEventListener("click", (e) => {
      e.stopPropagation();
    });

  page.querySelector("#moreInfoReminderBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    page.dispatchEvent(
      new CustomEvent("reminder", {
        detail: { item: props, action: "viewDetails" },
        bubbles: true,
      }),
    );
  });

  page
    .querySelector("#markAsCompleteReminderBtn")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      page.dispatchEvent(
        new CustomEvent("reminder", {
          detail: { item: props, action: "markAsComplete" },
          bubbles: true,
        }),
      );
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
        page.dispatchEvent(
          new CustomEvent("reminder", {
            detail: { item: reminderItem, action: "update" },
            bubbles: true,
          }),
        );
      },
    };
    generateDialogAndShow(addAndEditReminder, data);
  });

  page.querySelector("#deleteReminderBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    page.dispatchEvent(
      new CustomEvent("reminder", {
        detail: { item: props, action: "delete" },
        bubbles: true,
      }),
    );
  });
};
const setupMouseEventListener = (page) => {
  const dropdown = page.querySelector("#moreActionDropdown");
  page.addEventListener("mouseleave", () => {
    dropdown.close();
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
  const clone = createTemplate(reminderCardSkeletonTemplate);
  const page = clone.querySelector(".card");
  setupMouseEventListener(page);
  return clone;
}
