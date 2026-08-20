import cardHtml from "./card.html?raw";
import loadAndRenderIcon from "../../utils/loadAndRenderIcon.js";

const template = document.createElement("template");
template.innerHTML = cardHtml;

export default async function projectCardComponent(projectData) {
  const clone = template.content.cloneNode(true);
  // const iconRegistry = { Star, Bus, Heart, Send };

  clone.querySelector("#icon").setAttribute("data-lucide", projectData.icon);
  clone.querySelector("#icon").style.cssText =
    "color: " + projectData.iconColor;
  clone.querySelector(".project-title").textContent = projectData.title;
  clone.querySelector(".project-desc").textContent = projectData.description;

  await loadAndRenderIcon(projectData.icon, clone);
  // createIcons({
  //   icons: { [projectData.icon]: iconRegistry[projectData.icon] },
  //   nameAttr: "data-lucide",
  //   root: clone,
  //   inTemplates: true,
  // });

  return clone;
}
