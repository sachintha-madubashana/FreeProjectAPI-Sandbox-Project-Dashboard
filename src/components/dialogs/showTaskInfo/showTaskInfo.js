import showTaskInfoTemplate from "@/components/dialogs/showTaskInfo/showTaskInfo.html?raw";
import simpleStatsCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";

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

  Object.entries(props.status).forEach(([key, value]) => {
    clone.querySelector("#taskStatusContainer").appendChild(
      simpleStatsCards({
        title: key,
        value: value.value,
        icon: value.icon,
      }),
    );
  });

  clone.querySelector("#deleteTaskBtn").addEventListener("click", () => {
    const data = {
      dialogId: "confirmationDialog",
      confermButtonText: "Delete",
      onConfirm: () => {
        console.log("Task deleted:", props?.taskId);
        dialog.close();
        dialog.remove();
      },
      title: "Delete Task",
      description:
        "Are you sure you want to delete " + props?.taskName + " task?",
    };
    document
      .getElementById("pageContent")
      .appendChild(confirmationDialog(data));
    document.getElementById("confirmationDialog").showModal();
  });

  return clone;
}
