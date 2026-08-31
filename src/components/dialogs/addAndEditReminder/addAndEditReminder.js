import addAndEditReminderTemplate from "@/components/dialogs/addAndEditReminder/addAndEditReminder.html?raw";

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

  titleImput.value = props?.title || "";
  dateInput.value = props?.reminderDateTime || "";
  descriptionInput.value = props?.description || "";

  clone.querySelector("#saveBtn").addEventListener("click", () => {
    const title = titleImput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;

    const reminderItem = {
      title: title,
      reminderDateTime: date,
      description: description,
      isAcknowledged: false,
    };

    if (props?.onAction) {
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
