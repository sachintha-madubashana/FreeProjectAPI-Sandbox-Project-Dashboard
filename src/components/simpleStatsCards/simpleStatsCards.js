import statsCardsTemplate from "@/components/simpleStatsCards/simpleStatsCards.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";

export default function simpleStatsCards(props) {
  const template = document.createElement("template");
  template.innerHTML = statsCardsTemplate;

  const clone = document.importNode(template.content, true);
  clone.querySelector("#cardTitle").textContent = props?.title || "Card Title";
  clone.querySelector("#cardValue").textContent = props?.value || "0";

  loadAndRenderIcon(
    props?.icon || "Bug",
    clone.querySelector(".card"),
    clone.querySelector("#icon"),
  );

  return clone;
}
