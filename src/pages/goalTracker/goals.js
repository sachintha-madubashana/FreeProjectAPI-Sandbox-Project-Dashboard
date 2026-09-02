import goalsTemplate from "@/pages/goalTracker/goals.html?raw";
import simpleCard, {
  simpleStatsCardSkeleton as goalsStatsCardSkeleton,
} from "@/components/simpleStatsCard/simpleStatsCard.js";
import goalCard, {
  goalsCardSkeleton,
} from "@/components/cards/goalCard/goalCard.js";
import goalMoreInfo from "@/components/dialogs/goalMoreInfo/goalMoreInfo.js";
import addAndEditGoal from "@/components/dialogs/addAndEditGoal/addAndEditGoal";
import empty from "@/components/empty/empty.js";
import {
  getLoggedUser,
  generateDialogAndShow,
} from "@/pages/goalTracker/goalTracker.js";
import requestHandler from "@/utils/requestHandler.js";
import { showToast } from "@/utils/toastSystem.js";

const GoalStatus = Object.freeze({
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed",
  OVERDUE: "overdue",
});
let selectedStatus = GoalStatus.ALL;
export default function goals() {
  const template = document.createElement("template");
  template.innerHTML = goalsTemplate;
  const clone = document.importNode(template.content, true);

  const goals = [];
  const loggedUser = getLoggedUser();

  const page = clone.querySelector("#goalsPage");
  renderGoalSkeletons(page);

  loadGoals(loggedUser.userId)
    .then((data) => {
      if (!data) {
        return;
      }

      goals.push(...data);

      addMilestonesToGoals(goals).then(() => {
        updateGoalsStats(page, goals);
        renderGoals(page, goals, selectedStatus);
      });
    })
    .catch((error) => {
      console.error("Failed to load goals:", error);
      // TODO: Add Error UI
      showToast({
        category: "error",
        title: "Failed to load goals",
        description:
          "An error occurred while loading goals. Please try again later.",
      });
    });

  setUpEventListeners(page, goals);
  console.log("Goals Page Loaded", goals);
  return clone;
}

//Set up functions
const renderGoalSkeletons = (page) => {
  const container = page.querySelector("#goalsStatsCardsContainer");
  const goalCardsContainer = page.querySelector("#goalCardsContainer");

  if (!container) return;
  container.replaceChildren();

  for (let i = 0; i < 4; i++) {
    container.appendChild(goalsStatsCardSkeleton());
  }

  if (!goalCardsContainer) return;
  goalCardsContainer.replaceChildren();
  for (let i = 0; i < 6; i++) {
    goalCardsContainer.appendChild(goalsCardSkeleton());
  }
};
const setUpEventListeners = (page, goals) => {
  page.querySelector("#searchGoalBtn").addEventListener("click", () => {
    const searchInput = page.querySelector("#searchGoalInput").value.trim();
    searchGoals(page, goals, searchInput, selectedStatus);
  });

  page.querySelector("#searchGoalInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const searchInput = e.target.value.trim();
      searchGoals(page, goals, searchInput, selectedStatus);
    }
    if (e.key === "Backspace" && e.target.value.trim() === "") {
      renderGoals(page, goals, selectedStatus);
    }
  });

  page.querySelector("#filterAllBtn").addEventListener("click", (e) => {
    selectedStatus = GoalStatus.ALL;
    filterBtnClickHandler(page, goals, selectedStatus, e.currentTarget);
  });
  page.querySelector("#filterCompletedBtn").addEventListener("click", (e) => {
    selectedStatus = GoalStatus.COMPLETED;
    filterBtnClickHandler(page, goals, selectedStatus, e.currentTarget);
  });
  page.querySelector("#filterPendingBtn").addEventListener("click", (e) => {
    selectedStatus = GoalStatus.PENDING;
    filterBtnClickHandler(page, goals, selectedStatus, e.currentTarget);
  });
  page.querySelector("#filterOverdueBtn").addEventListener("click", (e) => {
    selectedStatus = GoalStatus.OVERDUE;
    filterBtnClickHandler(page, goals, selectedStatus, e.currentTarget);
  });
  page.querySelector("#addGoalBtn").addEventListener("click", () => {
    const data = {
      dialogId: "addGoalDialog",
      confermButtonText: "Save Goal",
      placeholder: "goal",
      onConfirm: (goal) => {
        addStatusToAGoal(goal);
        console.log("New Goal Added:", goal);
        goals.push(goal);
        renderGoals(page, goals, selectedStatus);
        updateGoalsStats(page, goals);
        // TODO: add to the api and get the goal id
      },
      title: "Add Goal",
      description: "You can add a new Goal here. Click save when you're done.",
    };
    generateDialogAndShow(addAndEditGoal, data);
  });
};
const addStatusToAGoal = (goal) => {
  if (goal.milestones.length > 0) {
    const allCompleted = goal.milestones.every(
      (milestone) => milestone.isCompleted,
    );

    if (allCompleted) {
      goal.status = GoalStatus.COMPLETED;
      return;
    }
  }

  if (new Date(goal.endDate) < new Date()) {
    goal.status = GoalStatus.OVERDUE;
    return;
  }

  goal.status = GoalStatus.PENDING;
};
const goalStatsGenerator = (goals) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(
    (goal) => goal.status === GoalStatus.COMPLETED,
  ).length;
  const pendingGoals = goals.filter(
    (goal) => goal.status === GoalStatus.PENDING,
  ).length;
  const overdueGoals = goals.filter(
    (goal) => goal.status === GoalStatus.OVERDUE,
  ).length;

  return [
    {
      title: "Total Goals",
      value: totalGoals,
      icon: "Goal",
    },
    {
      title: "Completed Goals",
      value: completedGoals,
      icon: "CircleCheck",
    },
    {
      title: "Pending Goals",
      value: pendingGoals,
      icon: "Ellipsis",
    },
    {
      title: "Overdue Goals",
      value: overdueGoals,
      icon: "RotateCwFadingClock",
    },
  ];
};

// Data fetching functions
const loadGoals = async (userId) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/getAllGoalsByUser",
      "GET",
      { userId: userId },
    );

    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};
const addMilestonesToGoals = async (goals) => {
  await Promise.all(
    goals.map(async (goal) => {
      const data = await loadMilestone(goal.goalId);

      goal.milestones = data?.milestones || [];
      addStatusToAGoal(goal);
    }),
  );
};
const loadMilestone = async (goalId) => {
  try {
    const response = await requestHandler(
      "https://api.freeprojectapi.com/api/GoalTracker/getGoal/" + goalId,
      "GET",
    );

    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};

// Stats Rendering functions
const updateGoalsStats = (root, goals) => {
  const goalsStatus = goalStatsGenerator(goals);
  const goalStatsCardsContainer = root.querySelector(
    "#goalsStatsCardsContainer",
  );
  goalStatsCardsContainer.replaceChildren();
  goalsStatus.forEach((stats) => {
    goalStatsCardsContainer.appendChild(simpleCard(stats));
  });
};
const renderGoals = (root, goals, selectedStatus) => {
  const goalCardsContainer = root.querySelector("#goalCardsContainer");
  goalCardsContainer.replaceChildren();

  const filteredGoals = filterGoalsByStatus(goals, selectedStatus);
  if (filteredGoals.length === 0) {
    const emptyData = {
      title: "No Goals Found",
      description: "You have no goals to display.",
      icon: "Goal",
    };
    showEmptyUI(goalCardsContainer, emptyData);
    return;
  }

  filteredGoals.forEach((goal) => {
    goalCardsContainer.appendChild(goalCard(goal));
  });
};

// Filtering and Searching functions
const filterGoalsByStatus = (goals, status) => {
  if (status === GoalStatus.ALL) {
    return goals;
  }
  if (status === GoalStatus.COMPLETED) {
    return goals.filter((goal) => goal.status === GoalStatus.COMPLETED);
  }
  if (status === GoalStatus.PENDING) {
    return goals.filter((goal) => goal.status === GoalStatus.PENDING);
  }
  if (status === GoalStatus.OVERDUE) {
    return goals.filter((goal) => goal.status === GoalStatus.OVERDUE);
  }
};
const filterBtnClickHandler = (page, goals, selectedStatus, clickedButton) => {
  filterBtnStateHandler(page, clickedButton);
  if (page.querySelector("#searchGoalInput").value.trim() !== "") {
    searchGoals(
      page,
      goals,
      page.querySelector("#searchGoalInput").value,
      selectedStatus,
    );
    return;
  }
  renderGoals(page, goals, selectedStatus);
};
const filterBtnStateHandler = (page, clickedButton) => {
  const filterButtons = page.querySelectorAll("#goalStatusFilterGroup button");

  filterButtons.forEach((button) => {
    if (button === clickedButton) {
      button.setAttribute("data-variant", "primary");
    } else {
      button.setAttribute("data-variant", "outline");
    }
  });
};
const searchGoals = (page, goals, searchInput, selectedStatus) => {
  if (searchInput) {
    const searchedGoals = goals.filter((goal) =>
      goal.goalName.toLowerCase().includes(searchInput.toLowerCase()),
    );

    renderGoals(page, searchedGoals, selectedStatus);
  } else {
    showToast({
      category: "info",
      title: "Search Input Empty",
      description: "Please enter a search term to find goals.",
    });
  }
};

// UI functions
const showEmptyUI = (container, emptyData) => {
  const emptyTemplate = empty(emptyData);
  emptyTemplate
    .querySelector(".empty")
    .classList.add("col-span-1", "md:col-span-2", "lg:col-span-3");
  container.appendChild(emptyTemplate);
};
