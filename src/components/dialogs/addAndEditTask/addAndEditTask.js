import addAndEditTaskTemplate from "@/components/dialogs/addAndEditTask/addAndEditTask.html?raw";

export default function addAndEditTask(props) {
  const template = document.createElement("template");
  template.innerHTML = addAndEditTaskTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";
  dialog.querySelector("#addAndEditTaskTitle").textContent =
    props?.title || "Task Details";
  dialog.querySelector("#addAndEditTaskDescription").textContent =
    props?.description ||
    "Hi, I am the new dialog. Make changes to your profile here. Click save when you're done.";

  dialog.querySelector("#cancelButton").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  const taskTitleInput = dialog.querySelector("#addAndEditTaskName");
  const taskDescriptionInput = dialog.querySelector(
    "#addAndEditTaskDescriptionInput",
  );
  const taskStartDateInput = dialog.querySelector("#startDateInput");
  const taskDueDateInput = dialog.querySelector("#dueDateInput");
  const frequencyInput = dialog.querySelector("#frequencyInput");

  taskTitleInput.value = props?.data?.taskName || "";
  taskDescriptionInput.value = props?.data?.description || "";
  taskStartDateInput.value = props?.data?.startDate || "";
  taskDueDateInput.value = props?.data?.dueDate || "";
  frequencyInput.value = props?.data?.frequency || "";

  const taskErrorSection = dialog.querySelector("#taskErrorSection");

  dialog.querySelector("#confirmButton").textContent =
    props?.confermButtonText || "Confirm";
  dialog.querySelector("#confirmButton").addEventListener("click", () => {
    if (typeof props?.onConfirm === "function") {
      const taskTitle = taskTitleInput.value;
      const taskDescription = taskDescriptionInput.value;
      const taskStartDate = taskStartDateInput.value;
      const taskDueDate = taskDueDateInput.value;
      const frequency = frequencyInput.value;

      if (!taskTitle || !taskStartDate || !taskDueDate || !frequency) {
        setError(taskErrorSection, "Please fill in all required fields.");
        return;
      }

      const validFrequencies = ["daily", "weekly", "monthly"];
      if (!validFrequencies.includes(frequency)) {
        setError(
          taskErrorSection,
          "Frequency must be one of the following: daily, weekly, monthly.",
        );
        return;
      }
      const start = new Date(taskStartDate);
      const due = new Date(taskDueDate);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start > due) {
        setError(
          taskErrorSection,
          "Start date cannot be later than the due date.",
        );
        return;
      }

      if (due < today) {
        setError(taskErrorSection, "Due date cannot be in the past.");
        return;
      }

      if (start < today) {
        setError(taskErrorSection, "Start date cannot be in the past.");
        return;
      }

      const taskCreatedDate = new Date().toISOString();

      const taskData = {
        taskName: taskTitle,
        description: taskDescription,
        createdDate: taskCreatedDate,
        startDate: taskStartDate,
        dueDate: taskDueDate,
        frequency: fistLetterUpperCase(frequency),
        userId: props?.data?.userId || null,
      };

      if (props?.data?.taskId) {
        taskData.taskId = props?.data?.taskId;
      }
      props.onConfirm(taskData);
      dialog.close();
      dialog.remove();
    }
  });

  return clone;
}
const fistLetterUpperCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const setError = (container, errorMessage) => {
  container.querySelector("h2").textContent = "Error";
  container.querySelector("p").textContent = errorMessage;
  container.classList.remove("hidden");
};
