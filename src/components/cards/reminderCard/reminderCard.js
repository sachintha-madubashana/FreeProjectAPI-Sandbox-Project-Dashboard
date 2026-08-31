import reminderCardTemplate from "@/components/cards/reminderCard/reminderCard.html?raw";
import addAndEditReminder from "@/components/dialogs/addAndEditReminder/addAndEditReminder.js";
import {
  updateReminders,
  deleteReminder,
  seeReminderDetails,
} from "@/pages/goalTracker/reminders.js";

export default function reminderCard(props) {
  const template = document.createElement("template");
  template.innerHTML = reminderCardTemplate;
  const clone = document.importNode(template.content, true);

  clone.querySelector("#reminderTitle").textContent = props?.title || "";
  clone.querySelector("#reminderDescription").textContent =
    props?.description || "";
  clone.querySelector("#reminderStartDate").textContent =
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

  clone.querySelector("#reminderCardHeader").append(badge(props?.status));

  const dropdown = clone.querySelector("#moreActionDropdown");
  clone.querySelector(".card").addEventListener("mouseleave", () => {
    dropdown.close();
  });

  clone.querySelector("#moreInfoReminderBtn").addEventListener("click", () => {
    seeReminderDetails(props?.reminderId);
  });

  clone
    .querySelector("#markAsCompleteReminderBtn")
    .addEventListener("click", () => {
      // TODO: Call API to mark reminder as complete
      console.log(
        "Mark reminder as complete for reminderId:",
        props?.reminderId,
      );
    });

  clone.querySelector("#editReminderBtn").addEventListener("click", () => {
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

  clone.querySelector("#deleteReminderBtn").addEventListener("click", () => {
    deleteReminder(props?.reminderId);
  });

  return clone;
}
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
