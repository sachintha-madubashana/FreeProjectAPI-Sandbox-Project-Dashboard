import addAndEditTaskTemplate from "@/components/dialogs/addAndEditTask/addAndEditTask.html?raw";

export default function addAndEditTask(props) {
  const template = document.createElement("template");
  template.innerHTML = addAndEditTaskTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";
  clone.querySelector("#addAndEditTaskTitle").textContent =
    props?.title || "Task Details";
  clone.querySelector("#addAndEditTaskDescription").textContent =
    props?.description ||
    "Hi, I am the new dialog. Make changes to your profile here. Click save when you're done.";

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
