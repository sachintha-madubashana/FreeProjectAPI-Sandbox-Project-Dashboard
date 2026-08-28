import addAndEditGoalTemplate from "@/components/dialogs/addAndEditGoal/addAndEditGoal.html?raw";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";

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

  clone.querySelector("#titleInput").placeholder =
    "Enter your " + props?.placeholder + " title";
  clone.querySelector("#descriptionInput").placeholder =
    "Enter your " + props?.placeholder + " description";

  clone.querySelector("#addMilestoneButton").addEventListener("click", () => {
    document.getElementById("pageContent").appendChild(
      confirmationDialog({
        dialogId: "addMilestoneDialog",
        title: "Add Milestone",
      }),
    );
    document.getElementById("addMilestoneDialog").showModal();
  });

  clone.querySelector("#deleteMilestoneBtn").addEventListener("click", () => {
    const data = {
      dialogId: "confirmationDialog",
      confermButtonText: "Delete",
      onConfirm: () => {
        console.log("Milestone deleted ");
      },
      title: "Delete Milestone",
      description: "Are you sure you want to delete milestone?",
    };
    document
      .getElementById("pageContent")
      .appendChild(confirmationDialog(data));
    document.getElementById("confirmationDialog").showModal();
  });

  clone.querySelector("#cancelButton").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  clone.querySelector("#confirmButton").textContent =
    props?.confermButtonText || "Confirm";

  clone.querySelector("#confirmButton").addEventListener("click", () => {
    if (typeof props?.onConfirm === "function") {
      props?.onConfirm();
      dialog.close();
      dialog.remove();
    }
  });

  return clone;
}
