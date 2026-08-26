import taskCardTemplate from "@/components/taskCard/taskCard.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { showMoreInfoDialog } from "@/pages/goalTracker/task.js";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";
import addAndEditTask from "@/components/dialogs/addAndEditTask/addAndEditTask.js";

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

  clone.querySelector(".field").append(badge(props?.status || ""));

  clone.querySelector("#moreInfoBtn").addEventListener("click", () => {
    const dialogData = {
      dialogId: "showTaskInfo",
      title: props?.taskName,
      description: props?.description || "No description available.",
      status: {
        Frequency: {
          value: props?.frequency, // need the frequency value from the task object
          icon: "Goal",
        },
        Status: {
          value: capitalizeFirstLetter(props?.status),
          icon: "Goal",
        },
        "Remaining Time": {
          value: findRemainingDays(props) + " days",
          icon: "Goal",
        },
        "Created Date": {
          value: new Date(props?.createdDate).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              timeZone: "Asia/Colombo",
              hour12: false,
            } || "Created Date",
          ),
          icon: "Goal",
        },
        "Due Date": {
          value: new Date(props?.dueDate).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              timeZone: "Asia/Colombo",
              hour12: false,
            } || "Due Date",
          ),
          icon: "Goal",
        },
      },
    };
    showMoreInfoDialog(dialogData);
  });
  clone.querySelector("#deleteTaskBtn").addEventListener("click", () => {
    const data = {
      dialogId: "confirmationDialog",
      confermButtonText: "Delete",
      onConfirm: () => {
        console.log("Task deleted:", props?.taskId);
      },
      title: "Delete Task",
      description:
        "Are you sure you want to delete " + props?.taskName + " task?",
    };
    document
      .getElementById("pageContent")
      .appendChild(confirmationDialog(data));
    document.getElementById("confirmationDialog").showModal();
  });
  clone.querySelector("#editTaskBtn").addEventListener("click", () => {
    const data = {
      dialogId: "editTaskDialog",
      confermButtonText: "Save Changes",
      onConfirm: () => {
        console.log("Task edited:", props?.taskId);
      },
      title: "Edit Task",
      description:
        "You can edit the task details here. Click save when you're done.",
    };
    document.getElementById("pageContent").appendChild(addAndEditTask(data));
    document.getElementById("editTaskDialog").showModal();
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

const findRemainingDays = (task) => {
  const now = new Date();
  const due = new Date(task.dueDate);
  const diffInMs = due - now;

  const remainingDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return remainingDays;
};

const capitalizeFirstLetter = (string) => {
  console.log("capitalizeFirstLetter:", string);
  return string.charAt(0).toUpperCase() + string.slice(1);
};
