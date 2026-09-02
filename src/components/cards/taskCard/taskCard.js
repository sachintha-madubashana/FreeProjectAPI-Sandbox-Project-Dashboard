import taskCardTemplate from "@/components/cards/taskCard/taskCard.html?raw";
import { TaskStatus } from "@/pages/goalTracker/task.js";
import addAndEditTask from "@/components/dialogs/addAndEditTask/addAndEditTask.js";
import { generateDialogAndShow } from "@/pages/goalTracker/goalTracker.js";

export default function taskCard(props) {
  const template = document.createElement("template");
  template.innerHTML = taskCardTemplate;
  const clone = document.importNode(template.content, true);
  const page = clone.querySelector(".card");

  const checkbox = page.querySelector("#completedCheckbox");
  if (checkbox) {
    checkbox.checked = !!props?.isCompleted;
    checkbox.id = props?.taskId || 0;

    checkbox.addEventListener("change", (event) => {
      props.isCompleted = event.target.checked;
      page.dispatchEvent(
        new CustomEvent("task", {
          detail: { item: props, action: "markAsComplete" },
          bubbles: true,
        }),
      );
    });
  }

  page.querySelector("#taskTitle").setAttribute("for", props?.taskId || 0);
  page.querySelector("#taskTitle").textContent = props?.taskName || "";
  page.querySelector("#taskDueDate").textContent =
    "Due : " + dateFormatter(props?.dueDate);

  page.querySelector(".field").append(badge(props?.status || ""));

  setupEventListeners(page, props);
  return clone;
}

const setupEventListeners = (page, props) => {
  page.addEventListener("click", () => {
    page.dispatchEvent(
      new CustomEvent("task", {
        detail: { item: props, action: "viewDetails" },
        bubbles: true,
      }),
    );
  });

  page.querySelector("#moreInfoBtn").addEventListener("click", () => {
    page.dispatchEvent(
      new CustomEvent("task", {
        detail: { item: props, action: "viewDetails" },
        bubbles: true,
      }),
    );
  });
  page.querySelector("#deleteTaskBtn").addEventListener("click", () => {
    page.dispatchEvent(
      new CustomEvent("task", {
        detail: { item: props, action: "deleteTask" },
        bubbles: true,
      }),
    );
  });
  page.querySelector("#editTaskBtn").addEventListener("click", () => {
    const data = {
      dialogId: "editTaskDialog",
      confermButtonText: "Save Changes",
      data: props,
      onConfirm: (taskData) => {
        page.dispatchEvent(
          new CustomEvent("task", {
            detail: { item: taskData, action: "updateTask" },
            bubbles: true,
          }),
        );
      },
      title: "Edit Task",
      description:
        "You can edit the task details here. Click save when you're done.",
    };
    generateDialogAndShow(addAndEditTask, data);
  });
};

const badge = (type) => {
  const template = document.createElement("template");
  let htmlString = ``;

  switch (type) {
    case TaskStatus.PENDING:
      htmlString = `<span
        class="badge bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      >
        Pending
      </span>`;
      break;
    case TaskStatus.COMPLETED:
      htmlString = `<span
        class="badge bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      >
        Done
      </span>`;
      break;
    case TaskStatus.OVERDUE:
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
const dateFormatter = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Colombo",
    hour12: false,
  });
};
