import addAndEditReminderTemplate from "@/components/dialogs/addAndEditReminder/addAndEditReminder.html?raw";
import { showToast } from "@/utils/toastSystem.js";

export default function addAndEditReminder(props) {
  const template = document.createElement("template");
  template.innerHTML = addAndEditReminderTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";
  clone.querySelector("#addAndEditReminderTitle").textContent =
    props?.title || "Reminder Details";
  clone.querySelector("#addAndEditReminderDescription").textContent =
    props?.description;
  clone.querySelector("#saveBtn").textContent = props?.saveBtnText || "Save";

  const titleImput = clone.querySelector("#reminderInputTitle");
  const dateInput = clone.querySelector("#reminderInputDate");
  const descriptionInput = clone.querySelector("#reminderDescriptionInput");
  const reminderErrorSection = clone.querySelector("#reminderErrorSection");

  titleImput.value = props?.data?.title || "";
  dateInput.value = props?.data?.reminderDateTime || "";
  descriptionInput.value = props?.data?.description || "";

  clone.querySelector("#saveBtn").addEventListener("click", () => {
    const title = titleImput.value.trim();
    const date = dateInput.value;
    const description = descriptionInput.value;

    const reminderItem = {
      reminderId: props?.data?.reminderId || null,
      title: title,
      reminderDateTime: date,
      description: description,
      isAcknowledged: false,
      status: props?.data?.status || "Pending",
    };

    if (props?.onAction) {
      if (!title || !date) {
        setError(reminderErrorSection, "Title and Date are required fields.");
        return;
      }
      if (new Date(date) < new Date()) {
        setError(reminderErrorSection, "Please select a future date and time.");
        return;
      }
      props.onAction(reminderItem);
      dialog.close();
      dialog.remove();
    }
  });

  clone.querySelector("#cancelBtn").addEventListener("click", () => {
    if (props?.onCancel) {
      props.onCancel();
    }
    dialog.close();
    dialog.remove();
  });

  return clone;
}

const setError = (container, errorMessage) => {
  container.querySelector("h2").textContent = "Error";
  container.querySelector("p").textContent = errorMessage;
  container.classList.remove("hidden");
};
