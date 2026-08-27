import goalCardTemplate from "@/components/cards/goalCard/goalCard.html?raw";
// import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
// import { showMoreInfoDialog } from "@/pages/goalTracker/goal.js";
// import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";
// import addAndEditgoal from "@/components/dialogs/addAndEditgoal/addAndEditgoal.js";

export default function goalCard(props) {
  const template = document.createElement("template");
  template.innerHTML = goalCardTemplate;
  const clone = document.importNode(template.content, true);

  clone.querySelector("#goalTitle").textContent = props?.goalName || "";
  clone.querySelector("#goalDescription").textContent =
    props?.description || "";
  clone.querySelector("#goalStartDate").textContent =
    "Start : " +
    new Date(props?.startDate).toLocaleString(
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
  clone.querySelector("#goalDueDate").textContent =
    "Due : " +
    new Date(props?.endDate).toLocaleString(
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

  clone.querySelector("#moreInfoBtn").addEventListener("click", () => {});

  return clone;
}

const badge = (type) => {
  const template = document.createElement("template");
  let htmlString = ``;

  switch (type) {
    case "pending":
      htmlString = `<span
        class="badge bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      >
        Pending
      </span>`;
      break;
    case "done":
      htmlString = `<span
        class="badge bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      >
        Done
      </span>`;
      break;
    case "overdue":
      htmlString = `<span
        class="badge bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
      >
        Overdue
      </span>`;
      break;
  }
  template.innerHTML = htmlString.trim();

  return template.content.firstElementChild;
};

const findRemainingDays = (goal) => {
  const now = new Date();
  const due = new Date(goal.dueDate);
  const diffInMs = due - now;

  const remainingDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return remainingDays;
};

const capitalizeFirstLetter = (string) => {
  console.log("capitalizeFirstLetter:", string);
  return string.charAt(0).toUpperCase() + string.slice(1);
};
