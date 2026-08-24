import statsCardsTemplate from "@/components/statsCards/statsCards.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";

export default function statsCards(props) {
  const template = document.createElement("template");
  template.innerHTML = statsCardsTemplate;

  const clone = document.importNode(template.content, true);
  clone.querySelector("#cardTitle").textContent = props?.title || "Card Title";
  clone.querySelector("#cardValue").textContent = props?.value || "0";
  clone.querySelector("#cardSecondValue").textContent =
    props?.secondValue || "";

  loadAndRenderIcon(
    "List",
    clone.querySelector(".card"),
    clone.querySelector("#icon"),
  );

  return clone;
}
