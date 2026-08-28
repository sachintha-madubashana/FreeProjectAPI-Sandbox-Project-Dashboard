import addAndEditGoalTemplate from "@/components/dialogs/addAndEditGoal/addAndEditGoal.html?raw";

export default function addAndEditGoal(props) {
  const template = document.createElement("template");
  template.innerHTML = addAndEditGoalTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";
  clone.querySelector("#addAndEditGoalTitle").textContent =
    props?.title || "Goal Details";
  clone.querySelector("#addAndEditGoalDescription").textContent =
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
