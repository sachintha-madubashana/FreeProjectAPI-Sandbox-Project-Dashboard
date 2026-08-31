import reminderMoreInfoTemplate from "@/components/dialogs/reminderMoreInfo/reminderMoreInfo.html?raw";

export default function reminderMoreInfo(props) {
  const template = document.createElement("template");
  template.innerHTML = reminderMoreInfoTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";
  clone.querySelector("#addAndEditReminderTitle").textContent =
    props?.title || "Reminder Details";
  clone.querySelector("#addAndEditReminderDescription").textContent =
    props?.description;

  const titleImput = clone.querySelector("#reminderInputTitle");
  const dateInput = clone.querySelector("#reminderInputDate");
  const descriptionInput = clone.querySelector("#reminderDescriptionInput");

  titleImput.disabled = true;
  dateInput.disabled = true;
  descriptionInput.disabled = true;

  titleImput.value = props?.data?.title || "";
  dateInput.value = props?.data?.reminderDateTime || "";
  descriptionInput.value = props?.data?.description || "";

  clone.querySelector("#cancelBtn").addEventListener("click", () => {
    if (props?.onCancel) {
      props.onCancel();
    }
    dialog.close();
    dialog.remove();
  });

  return clone;
}
