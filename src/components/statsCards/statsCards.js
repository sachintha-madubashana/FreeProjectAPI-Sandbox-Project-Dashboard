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
    props?.icon || "Bug",
    clone.querySelector(".card"),
    clone.querySelector("#icon"),
  );

  return clone;
}

export function statsCardSkeleton() {
  const template = document.createElement("template");

  template.innerHTML = `
  <div class="card p-4 drop-shadow-sm hover:drop-shadow-xl hover:scale-105 hover:border-gray-400 duration-300">
  <div class="flex flex-row justify-between items-center">
    <div class="flex flex-col justify-center items-start w-full space-y-2">
      <header class="w-full space-y-2">
        <h2 class="skeleton w-full h-4" id="cardTitle"></h2>
        <p class="skeleton w-full h-4" id="cardValue"> </p>
      </header>
      <p class="skeleton w-full h-4" id="cardSecondValue"></p>
    </div>
    <div
      class="object-cover rounded-lg size-20 m-2 skeleton"
    ></div>
  </div>
</div>`;

  return document.importNode(template.content, true);
}
