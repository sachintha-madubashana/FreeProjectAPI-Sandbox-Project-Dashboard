import cardHtml from "@/components/dashboard/card.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { navigate } from "@/router/router.js";

const template = document.createElement("template");
template.innerHTML = cardHtml;

export default async function projectCardComponent(projectData) {
  const clone = template.content.cloneNode(true);

  clone.querySelector("#icon").setAttribute("data-lucide", projectData.icon);
  clone.querySelector("#icon").style.cssText =
    "color: " + projectData.iconColor;
  clone.querySelector(".project-title").textContent = projectData.title;
  clone.querySelector(".project-desc").textContent = projectData.description;
  clone.querySelector("div").addEventListener("click", () => {
    navigate(projectData.path);
  });

  await loadAndRenderIcon(projectData.icon, clone);

  return clone;
}
