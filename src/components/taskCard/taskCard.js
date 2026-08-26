import taskCardTemplate from "@/components/taskCard/taskCard.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";

export default function taskCard(props) {
  const template = document.createElement("template");
  template.innerHTML = taskCardTemplate;
  const clone = document.importNode(template.content, true);

  return clone;
}
