import showTaskInfoTemplate from "@/components/dialogs/showTaskInfo/showTaskInfo.html?raw";
import simpleStatsCards from "@/components/cards/simpleStatsCard/simpleStatsCard.js";

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
export default function showTaskInfo(props) {
  const template = document.createElement("template");
  template.innerHTML = showTaskInfoTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");

  dialog.id = props?.dialogId || "dialogId";
  clone.querySelector("#taskTitle").textContent =
    props?.title || "Task Details";
  clone.querySelector("#taskDescription").textContent =
    props?.description ||
    "Hi, I am the new dialog. Make changes to your profile here. Click save when you're done.";

  if (props?.status && Object.keys(props?.status).length > 0) {
    Object.entries(props.status).forEach(([key, value]) => {
      clone.querySelector("#taskStatusContainer").appendChild(
        simpleStatsCards({
          title: key,
          value: value.value,
          icon: value.icon,
        }),
      );
    });
  }

  const markAsCompleteBtn = clone.querySelector("#markAsCompleteBtn");
  markAsCompleteBtnStateChanger(markAsCompleteBtn, props.data.isCompleted);

  markAsCompleteBtn.addEventListener("click", () => {
    props.data.isCompleted = !props.data.isCompleted;
    markAsCompleteBtnStateChanger(markAsCompleteBtn, props.data.isCompleted);
    document.querySelector("#taskPage")?.dispatchEvent(
      new CustomEvent("task", {
        detail: { item: props.data, action: "markAsComplete" },
        bubbles: true,
      }),
    );
  });

  return clone;
}

const markAsCompleteBtnStateChanger = (markAsCompleteBtn, isCompleted) => {
  if (markAsCompleteBtn && isCompleted) {
    markAsCompleteBtn.innerHTML = checkIcon + "Mark as Uncomplete";
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
    markAsCompleteBtn.innerHTML = checkIcon + "Mark as Complete";
    markAsCompleteBtn.setAttribute("data-tooltip", "Mark as Complete");
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
};
