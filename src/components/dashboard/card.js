import cardHtml from "@/components/dashboard/card.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { navigate } from "@/router/router.js";
import { showToast } from "@/utils/toastSystem.js";
import { getProjectStatusBadge } from "@/utils/utilityFunctions.js";

const template = document.createElement("template");
template.innerHTML = cardHtml;

export default async function projectCardComponent(projectData) {
  const clone = template.content.cloneNode(true);

  const iconColor = "color: " + projectData.iconColor;
  const icon = projectData.icon;
  const cardTitle = projectData.title;
  const cardDesc = projectData.description;
  const cardStatus = projectData.status;
  const path = projectData.path;

  clone.querySelector("#icon").style.cssText = iconColor;
  clone.querySelector(".project-title").textContent = cardTitle;
  clone.querySelector(".project-desc").textContent = cardDesc;
  clone.querySelector("div").addEventListener("click", () => {
    if (cardStatus === "active") {
      navigate(path);
    } else {
      showToast({
        category: "info",
        title: `Project "${cardTitle}" is ${cardStatus}`,
        description: `The project "${cardTitle}" is currently ${cardStatus}. Please check back later.`,
      });
    }
  });

  await loadAndRenderIcon(icon, clone, clone.querySelector("#icon"));

  clone
    .querySelector(".project-status")
    .appendChild(getProjectStatusBadge(cardStatus));

  return clone;
}
