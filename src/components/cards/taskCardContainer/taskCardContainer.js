import cardContainerTemplate from "@/components/cards/taskCardContainer/taskCardContainer.html?raw";
import cardContainerSkeletonTemplate from "@/components/cards/taskCardContainer/taskCardContainerSkeleton.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import taskCard from "@/components/cards/taskCard/taskCard.js";

const createTemplate = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  return document.importNode(template.content, true);
};

export default function taskCardContainer(props) {
  const clone = createTemplate(cardContainerTemplate);
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

export function taskCardContainerSkeleton() {
  return createTemplate(cardContainerSkeletonTemplate);
}
