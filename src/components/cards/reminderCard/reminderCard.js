import reminderCardTemplate from "@/components/cards/reminderCard/reminderCard.html?raw";
import addAndEditReminder from "@/components/dialogs/addAndEditReminder/addAndEditReminder.js";

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

  console.log("Reminder card props:", props);
  clone.querySelector("#moreInfoReminderBtn").addEventListener("click", () => {
    // TODO: Open reminder details modal
    console.log(
      "Open reminder details modal for reminderId:",
      props?.reminderId,
    );
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
      title: props?.title,
      description: props?.description,
      saveBtnText: "Save Changes",
      onAction: (reminderItem) => {
        console.log("Reminder item saved:", reminderItem);
        // TODO: Call API to update reminder with reminderItem data
      },
    };
    document
      .getElementById("pageContent")
      .appendChild(addAndEditReminder(data));
    document.getElementById("reminderId" + props?.reminderId).showModal();
  });

  clone.querySelector("#deleteReminderBtn").addEventListener("click", () => {
    // TODO: Call API to delete reminder
    console.log("Delete reminder for reminderId:", props?.reminderId);
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
