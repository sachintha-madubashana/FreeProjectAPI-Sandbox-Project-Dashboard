import goalMoreInfoCardTemplate from "@/components/dialogs/goalMoreInfo/goalMoreInfo.html?raw";
import simpleStatsCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import emptyComponent from "@/components/empty/empty.js";

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

  goalStatus(props?.goalData).forEach((status) => {
    goalStatusContainer.appendChild(simpleStatsCards(status));
  });

  const milestoneCard = clone.querySelector("#milestoneCard");
  const milestoneContainer = clone.querySelector("#milestoneContainer");
  milestoneContainer.replaceChildren();
  if (props?.goalData?.milestones.length > 0) {
    props?.goalData?.milestones?.forEach((milestone) => {
      const cardClone = milestoneCard.cloneNode(true);
      milestoneContainer.appendChild(cardClone);
    });

    return clone;
  }
  const emptyProps = {
    title: "No Milestones Yet",
    description:
      "You haven't created any milestones for this goal yet. Get started by creating your first milestone.",
    icon: "Flag",
    action: {
      text: "Create Milestone",
      callback: () => {
        console.log("Create Milestone button clicked");
        // Add your logic here to handle the button click event
      },
    },
  };
  milestoneContainer.appendChild(emptyComponent(emptyProps));

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
