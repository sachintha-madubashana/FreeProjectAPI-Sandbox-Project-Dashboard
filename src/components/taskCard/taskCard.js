import taskCardTemplate from "@/components/taskCard/taskCard.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { showMoreInfoDialog } from "@/pages/goalTracker/task.js";

export default function taskCard(props) {
  const template = document.createElement("template");
  template.innerHTML = taskCardTemplate;
  const clone = document.importNode(template.content, true);

  const checkbox = clone.querySelector("#completedCheckbox");
  if (checkbox) {
    checkbox.checked = !!props?.isCompleted;
    checkbox.id = props?.taskId || 0;

    checkbox.addEventListener("change", (event) => {
      console.log(
        "Checkbox state changed:",
        props?.taskId + " : " + event.target.checked,
      );
      // Api call here
    });
  }

  clone.querySelector("#taskTitle").setAttribute("for", props?.taskId || 0);
  clone.querySelector("#taskTitle").textContent = props?.taskName || "";
  clone.querySelector("#taskDueDate").textContent =
    "Due : " +
    new Date(props?.dueDate).toLocaleString(
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

  clone.querySelector(".field").append(badge(props?.status || "pending"));

  clone.querySelector("#moreInfoBtn").addEventListener("click", () => {
    console.log("More Info button clicked for task:", props?.taskId);
    // document.getElementById("demo-dialog-edit-profile").showModal();
    showMoreInfoDialog();
  });

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
