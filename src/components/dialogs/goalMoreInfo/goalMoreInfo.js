import goalMoreInfoCardTemplate from "@/components/dialogs/goalMoreInfo/goalMoreInfo.html?raw";
import simpleStatsCards from "@/components/simpleStatsCard/simpleStatsCard.js";
import emptyComponent from "@/components/empty/empty.js";

const checkIcon = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-circle-check-icon lucide-circle-check"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>`;
const nonCheckIcon = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-circle-x-icon lucide-circle-x"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>`;

export default function goalMoreInfoCard(props) {
  const template = document.createElement("template");
  template.innerHTML = goalMoreInfoCardTemplate;
  const clone = document.importNode(template.content, true);

  const page = clone.querySelector("dialog");

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
      milestoneCardLoader(page, milestoneContainer, milestoneCard, milestone);
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

  setupEventListeners(page, props);

  return clone;
}

const setupEventListeners = (page, props) => {
  page.querySelector("#editGoalBtn").addEventListener("click", (e) => {
    console.log("Edit Goal button clicked");
  });

  page.querySelector("#deleteGoalBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    page.dispatchEvent(
      new CustomEvent("goal", {
        detail: { item: props, action: "delete" },
        bubbles: true,
      }),
    );
  });
};

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

const milestoneCardLoader = (
  page,
  milestoneContainer,
  milestoneCard,
  milestone,
) => {
  const cardClone = milestoneCard.cloneNode(true);
  cardClone.querySelector("h2").textContent =
    milestone?.milestoneName || "unknown milestone";
  cardClone.querySelector("p").textContent =
    milestone?.description || "undefined description";
  const markAsCompleteBtn = cardClone.querySelector("#markAsComplete");
  if (markAsCompleteBtn) {
    const isCompleted = milestone?.isCompleted;
    markAsCompleteBtn.innerHTML = isCompleted ? nonCheckIcon : checkIcon;
    if (isCompleted) {
      markAsCompleteBtn.setAttribute("data-tooltip", "Mark as Uncomplete");
      markAsCompleteBtn.classList.add(
        "btn",
        "bg-amber-100",
        "dark:bg-amber-950",
        "text-amber-950",
        "dark:text-amber-400",
        "hover:bg-amber-200",
        "dark:hover:bg-amber-900",
      );
      markAsCompleteBtn.classList.remove(
        "bg-green-100",
        "dark:bg-green-950",
        "text-green-950",
        "dark:text-green-400",
        "hover:bg-green-200",
        "dark:hover:bg-green-900",
      );
    } else {
      markAsCompleteBtn.classList.add(
        "btn",
        "bg-green-100",
        "dark:bg-green-950",
        "text-green-950",
        "dark:text-green-400",
        "hover:bg-green-200",
        "dark:hover:bg-green-900",
      );
      markAsCompleteBtn.classList.remove(
        "bg-amber-100",
        "dark:bg-amber-950",
        "text-amber-950",
        "dark:text-amber-400",
        "hover:bg-amber-200",
        "dark:hover:bg-amber-900",
      );
    }
  }

  cardClone.querySelector("#markAsComplete").addEventListener("click", (e) => {
    e.stopPropagation();
    const isCompleted = !milestone?.isCompleted;

    milestone.isCompleted = !isCompleted;

    page.dispatchEvent(
      new CustomEvent("goal", {
        detail: { action: "markAsComplete" },
        bubbles: true,
      }),
    );
  });

  milestoneContainer.appendChild(cardClone);
};
