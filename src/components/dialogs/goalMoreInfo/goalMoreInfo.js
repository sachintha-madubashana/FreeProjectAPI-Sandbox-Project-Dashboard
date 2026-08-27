import goalMoreInfoCardTemplate from "@/components/dialogs/goalMoreInfo/goalMoreInfo.html?raw";
import simpleStatsCards from "@/components/simpleStatsCards/simpleStatsCards.js";

export default function goalMoreInfoCard(props) {
  const template = document.createElement("template");
  template.innerHTML = goalMoreInfoCardTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";

  clone.querySelector("#goalTitle").textContent =
    props?.goalData?.goalName || "unknown goal";
  clone.querySelector("#goalDescription").textContent =
    props?.goalData?.description || "undefined description";

  const goalStatusContainer = clone.querySelector("#goalStatusContainer");
  console.log("params.status:", props);

  goalStatus(props?.goalData).forEach((status) => {
    goalStatusContainer.appendChild(simpleStatsCards(status));
  });

  return clone;
}

const goalStatus = (goalData) => {
  let status = [];
  if (goalData?.startDate && goalData?.endDate) {
    const startDate = new Date(goalData.startDate);
    const endDate = new Date(goalData.endDate);
    const currentDate = new Date();

    status.push({
      title: "Start Date",
      value: startDate.toLocaleString(
        "en-US",
        {
          month: "2-digit",
          day: "2-digit",
        } || "",
      ),
      icon: "Calendar",
    });

    status.push({
      title: "Target Date",
      value: endDate.toLocaleString(
        "en-US",
        {
          month: "2-digit",
          day: "2-digit",
        } || "",
      ),
      icon: "CalendarClock",
    });

    const remainingTime = endDate - currentDate;
    if (remainingTime > 0) {
      const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

      status.push({
        title: "Remaining Time",
        value: daysRemaining,
        icon: "Clock",
      });
    }
  }

  return status;
};
