import goalCardTemplate from "@/components/cards/goalCard/goalCard.html?raw";

export default function goalCard(props) {
  const template = document.createElement("template");
  template.innerHTML = goalCardTemplate;
  const clone = document.importNode(template.content, true);

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

  clone.querySelector("#moreInfoBtn").addEventListener("click", () => {});

  return clone;
}
