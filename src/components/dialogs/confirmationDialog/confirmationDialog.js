import confirmationDialogTemplate from "@/components/dialogs/confirmationDialog/confirmationDialog.html?raw";

// @param {Object} props - The properties for the confirmation dialog.
// @param {string} props.dialogId - The ID of the dialog element.
// @param {string} props.title - The title of the confirmation dialog.
// @param {string} props.description - The description of the confirmation dialog.
// @param {string} props.confermButtonText - The text for the confirm button.
// @param {Function} props.onConfirm - The callback function to be called when the confirm button is clicked.
export default function confirmationDialog(props) {
  const template = document.createElement("template");
  template.innerHTML = confirmationDialogTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId;

  clone.querySelector("#confirmationDialogTitle").textContent =
    props?.title || "Are you sure you want to proceed?";
  clone.querySelector("#confirmationDialogDescription").textContent =
    props?.description ||
    "This action cannot be undone. Please confirm your choice.";

  clone.querySelector("#cancelButton").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  clone.querySelector("#confirmButton").textContent =
    props?.confermButtonText || "Confirm";
  clone.querySelector("#confirmButton").addEventListener("click", () => {
    if (typeof props?.onConfirm === "function") {
      props.onConfirm();
      dialog.close();
      dialog.remove();
    }
  });

  return clone;
}
