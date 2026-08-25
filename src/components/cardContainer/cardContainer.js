import cardContainerTemplate from "@/components/cardContainer/cardContainer.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";

export default function cardContainer(props) {
  const template = document.createElement("template");
  template.innerHTML = cardContainerTemplate;
  const clone = document.importNode(template.content, true);

  clone.querySelector("#frequency").textContent = props?.frequency || "Title";
  clone.querySelector("#emptyTitle").textContent =
    "No " + props?.frequency + " available.";
  clone.querySelector("#description").textContent =
    "Create a " + props?.frequency + " task.";

  loadAndRenderIcon(
    props?.frequencyIcon || "CircleX",
    clone.querySelector("#taskCard"),
    clone.querySelector("#taskCardIcon"),
  );

  loadAndRenderIcon(
    props?.emptyIcon || "FolderX",
    clone.querySelector("#taskCard"),
    clone.querySelector("#taskCardMessageIcon"),
  );

  return clone;
}
