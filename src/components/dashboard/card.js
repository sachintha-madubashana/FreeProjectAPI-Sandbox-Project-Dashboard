import cardHtml from "@/components/dashboard/card.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { navigate } from "@/router/router.js";
import { showToast } from "@/utils/toastSystem.js";

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

  clone.querySelector(".project-status").appendChild(badge(cardStatus));

  return clone;
}

const badge = (type) => {
  const template = document.createElement("template");

  const classMapping = {
    developing:
      "badge bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    active:
      "badge bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    unavilable:
      "badge bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  let htmlString = `<span class="${classMapping[type]}">${capitalizeFirstLetter(type)}</span>`;

  template.innerHTML = htmlString.trim();

  return template.content.firstElementChild;
};
const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
