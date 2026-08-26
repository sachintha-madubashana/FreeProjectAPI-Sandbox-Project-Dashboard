import cardContainerTemplate from "@/components/taskCardContainer/taskCardContainer.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import taskCard from "@/components/taskCard/taskCard.js";

export default function taskCardContainer(props) {
  const template = document.createElement("template");
  template.innerHTML = cardContainerTemplate;
  const clone = document.importNode(template.content, true);

  clone.querySelector("#frequency").textContent = props?.frequency || "Title";
  loadAndRenderIcon(
    props?.frequencyIcon || "CircleX",
    clone.querySelector("#taskCard"),
    clone.querySelector("#taskCardIcon"),
  );

  if (!props?.tasks || props?.tasks.length === 0) {
    clone.querySelector("#emptyTitle").textContent =
      "No " + props?.frequency + " available.";
    clone.querySelector("#description").textContent =
      "Create a " + props?.frequency + " task.";
    loadAndRenderIcon(
      props?.emptyIcon || "FolderX",
      clone.querySelector("#taskCard"),
      clone.querySelector("#taskCardMessageIcon"),
    );

    clone.querySelector("#taskCardsSection").classList.add("empty");
    return clone;
  }

  clone.querySelector("#taskCardsSection").replaceChildren();
  clone.querySelector("#taskCardsSection").classList.remove("empty");
  props?.tasks.forEach((task) => {
    clone.querySelector("#taskCardsSection").appendChild(taskCard(task));
  });

  return clone;
}
