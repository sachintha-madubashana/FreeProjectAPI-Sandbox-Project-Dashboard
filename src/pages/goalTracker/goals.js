import goalsTemplate from "@/pages/goalTracker/goals.html?raw";
import simpleCards from "@/components/simpleStatsCards/simpleStatsCards.js";
import goalCard from "@/components/cards/goalCard/goalCard.js";

export default function goals() {
  const template = document.createElement("template");
  template.innerHTML = goalsTemplate;
  const clone = document.importNode(template.content, true);

  const goals = [
    {
      goalId: 273,
      goalName: "Goal 1",
      description: "Description for Goal 1",
      startDate: "2026-08-27T02:07:31.82",
      endDate: "2026-09-18T00:00:00",
      userId: 9583,
    },
    {
      goalId: 274,
      goalName: "Goal 2",
      description: "Description for Goal 2",
      startDate: "2026-08-27T02:08:48.223",
      endDate: "2026-09-01T00:00:00",
      userId: 9583,
    },
    {
      goalId: 275,
      goalName: "Goal 3",
      description: "Description for Goal 3",
      startDate: "2026-08-20T02:09:01.223",
      endDate: "2026-08-27T11:09:01.223",
      userId: 9583,
    },
  ];
  addMileStonesToGoal(goals);

  const goalsStatus = goalStatsGenerator(goals);

  goalsStatus.forEach((stats) => {
    clone
      .querySelector("#goalsStatsCardsContainer")
      .appendChild(simpleCards(stats));
  });

  goals.forEach((goal) => {
    clone.querySelector("#goalCardsContainer").appendChild(goalCard(goal));
  });

  clone.querySelector("#searchGoalBtn").addEventListener("click", () => {
    const searchInput = document.querySelector("#searchGoalInput").value.trim();
    if (searchInput) {
      console.log("Searching ...");
      const filteredGoals = goals.filter((goal) =>
        goal.goalName.toLowerCase().includes(searchInput.toLowerCase()),
      );
      const goalCardsContainer = document.querySelector("#goalCardsContainer");
      goalCardsContainer.replaceChildren();
      filteredGoals.forEach((goal) => {
        goalCardsContainer.appendChild(goalCard(goal));
      });
    } else {
      //add a message to the user that the search input is empty
      console.log("Search input is empty.");
    }
  });

  return clone;
}

const goalStatsGenerator = (goals) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => goal.isCompleted).length;
  const pendingGoals = totalGoals - completedGoals;
  const overdueGoals = goals.filter(
    (goal) => new Date(goal.endDate) < new Date(),
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

const addMileStonesToGoal = (goals) => {
  const milestones = [
    [
      {
        milestoneId: 454,
        milestoneName: "m1",
        description: "asd",
        targetDate: "2026-08-18T00:00:00",
        isCompleted: false,
      },
      {
        milestoneId: 455,
        milestoneName: "m2",
        description: "asdasd",
        targetDate: "2026-08-18T00:00:00",
        isCompleted: false,
      },
    ],
    [
      {
        milestoneId: 450,
        milestoneName: "m1",
        description: "sdfg",
        targetDate: "2026-08-27T00:00:00",
        isCompleted: false,
      },
      {
        milestoneId: 451,
        milestoneName: "m2",
        description: "sfdgsd",
        targetDate: "2026-08-28T00:00:00",
        isCompleted: false,
      },
    ],
    [
      {
        milestoneId: 456,
        milestoneName: "m1",
        description: "asd",
        targetDate: "2026-08-18T00:00:00",
        isCompleted: true,
      },
      {
        milestoneId: 457,
        milestoneName: "m2",
        description: "asdasd",
        targetDate: "2026-08-18T00:00:00",
        isCompleted: true,
      },
    ],
  ];

  goals.forEach((goal, index) => {
    const goalMilestones = milestones[index] || [];

    goal.milestones = goalMilestones;
    goal.isCompleted = goalMilestones.every(
      (milestone) => milestone.isCompleted,
    );
  });
};
