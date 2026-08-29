import reminderCardTemplate from "@/components/cards/reminderCard/reminderCard.html?raw";

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

  clone.querySelector("#reminderCardHeader").append(badge(props?.status || ""));

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
