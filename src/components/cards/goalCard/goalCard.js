import goalCardTemplate from "@/components/cards/goalCard/goalCard.html?raw";
import goalCardSkeletonTemplate from "@/components/cards/goalCard/goalCardSkeleton.html?raw";
import { generateDialogAndShow } from "@/pages/goalTracker/goalTracker.js";
import goalMoreInfo from "@/components/dialogs/goalMoreInfo/goalMoreInfo.js";

const createTemplate = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  return document.importNode(template.content, true);
};

export default function goalCard(props) {
  const clone = createTemplate(goalCardTemplate);

  clone.querySelector("#goalTitle").textContent = props?.goalName || "";
  clone.querySelector("#goalDescription").textContent =
    props?.description || "";
  clone.querySelector("#goalStartDate").textContent =
    "Start : " +
    new Date(props?.startDate).toLocaleString(
      "en-US",
      {
        month: "2-digit",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Colombo",
        hour12: false,
      } || "Due Date",
    );
  clone.querySelector("#goalDueDate").textContent =
    "Due : " +
    new Date(props?.endDate).toLocaleString(
      "en-US",
      {
        month: "2-digit",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Colombo",
        hour12: false,
      } || "Due Date",
    );

  clone.querySelector("#moreInfoBtn").addEventListener("click", () => {
    const dialogData = {
      dialogId: "showGoalInfo",
      goalData: props,
    };
    generateDialogAndShow(goalMoreInfo, dialogData);
  });

  return clone;
}

export const goalsCardSkeleton = () => {
  const clone = createTemplate(goalCardSkeletonTemplate);
  return clone;
};
