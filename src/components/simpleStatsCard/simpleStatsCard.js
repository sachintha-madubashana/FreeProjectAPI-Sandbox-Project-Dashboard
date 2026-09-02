import statsCardsTemplate from "@/components/simpleStatsCard/simpleStatsCard.html?raw";
import simpleStatsCardSkeletonTemplate from "@/components/simpleStatsCard/simpleStatsCardSkeleton.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";

const createTemplate = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  return document.importNode(template.content, true);
};

export default function simpleStatsCard(props) {
  const clone = createTemplate(statsCardsTemplate);
  clone.querySelector(".card-title").textContent = props?.title ?? "Card Title";
  clone.querySelector(".card-value").textContent = props?.value ?? "0";

  loadAndRenderIcon(
    props?.icon || "Bug",
    clone.querySelector(".card"),
    clone.querySelector(".icon"),
  );

  return clone;
}

export function simpleStatsCardSkeleton() {
  return createTemplate(simpleStatsCardSkeletonTemplate);
}
