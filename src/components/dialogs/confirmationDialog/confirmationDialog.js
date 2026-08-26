import confirmationDialogTemplate from "@/components/dialogs/confirmationDialog/confirmationDialog.html?raw";

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
