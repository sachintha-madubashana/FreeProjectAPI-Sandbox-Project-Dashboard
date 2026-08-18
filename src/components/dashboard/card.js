import cardHtml from "./card.html?raw";
import * as LucideIcons from "lucide";

const template = document.createElement("template");
template.innerHTML = cardHtml;

export default function projectCardComponent(projectData) {
  const clone = template.content.cloneNode(true);
  const icon = LucideIcons[projectData.icon];

  clone.querySelector("#icon").setAttribute("data-lucide", projectData.icon);
  clone.querySelector("#icon").style.cssText =
    "color: " + projectData.iconColor;
  clone.querySelector(".project-title").textContent = projectData.title;
  clone.querySelector(".project-desc").textContent = projectData.description;

  LucideIcons.createIcons({
    icons: { [projectData.icon]: icon },
    nameAttr: "data-lucide",
    root: clone,
    attrs: {
      width: 50,
      height: 40,
    },
    nameAttr: "data-lucide",
    inTemplates: true,
  });

  return clone;
}
