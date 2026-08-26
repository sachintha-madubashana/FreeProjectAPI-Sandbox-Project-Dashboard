import showTaskInfoTemplate from "@/components/dialogs/showTaskInfo/showTaskInfo.html?raw";
import simpleStatsCards from "@/components/simpleStatsCards/simpleStatsCards.js";

export default function showTaskInfo(props) {
  const template = document.createElement("template");
  template.innerHTML = showTaskInfoTemplate;
  const clone = document.importNode(template.content, true);

  clone.querySelector("dialog").id = props?.dialogId || "dialogId";
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

  return clone;
}
