import statsCardTemplate from "@/components/cards/statsCard/statsCard.html?raw";
import statsCardSkeletonTemplate from "@/components/cards/statsCard/statsCardSkeleton.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";

const createTemplate = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  return document.importNode(template.content, true);
};

export default function statsCard(props) {
  const root = createTemplate(statsCardTemplate);

  root.querySelector("#cardTitle").textContent = props?.title ?? "Card Title";
  root.querySelector("#cardValue").textContent = props?.value ?? "0";
  root.querySelector("#cardSecondValue").textContent = props?.secondValue ?? "";

  loadAndRenderIcon(
    props?.icon || "Bug",
    root.querySelector(".card"),
    root.querySelector("#icon"),
  );

  return root;
}

export function statsCardSkeleton() {
  return createTemplate(statsCardSkeletonTemplate);
}
