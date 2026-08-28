import addAndEditGoalTemplate from "@/components/dialogs/addAndEditGoal/addAndEditGoal.html?raw";
import empty from "@/components/empty/empty.js";
import addAndEditMilestone from "@/components/dialogs/addAndEditMilestone/addAndEditMilestone.js";

let count = 1;
export default function addAndEditGoal(props) {
  const template = document.createElement("template");
  template.innerHTML = addAndEditGoalTemplate;
  const clone = document.importNode(template.content, true);

  const goalObject = {};
  let milestoneArray = [];

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";
  clone.querySelector("#addAndEditGoalTitle").textContent =
    props?.title || "Goal Details";
  clone.querySelector("#addAndEditGoalDescription").textContent =
    props?.description ||
    "Hi, I am the new dialog. Make changes to your profile here. Click save when you're done.";

  clone.querySelector("#titleInput").placeholder =
    "Enter your " + props?.placeholder + " title";
  clone.querySelector("#descriptionInput").placeholder =
    "Enter your " + props?.placeholder + " description";

  const milestoneContainer = clone.querySelector("#milestoneContainer");
  const milestoneCard = clone.querySelector("#milestoneCard");
  refreshMilestoneContainer(milestoneContainer, milestoneArray);

  clone.querySelector("#addMilestoneButton").addEventListener("click", () => {
    const currentId = count;

    const data = {
      dialogId: "addMilestoneDialog",
      confermButtonText: "Save Milestone",
      placeholder: "milestone",
      onConfirm: (milestoneItem) => {
        if (milestoneArray.length === 0) {
          milestoneContainer.replaceChildren();
        }
        addMilestoneCard(
          milestoneContainer,
          milestoneCard,
          milestoneArray,
          currentId,
          milestoneItem,
        );
        count++;
      },
      title: "Add Milestone",
      description:
        "You can add a new milestone here. Click add when you're done.",
    };
    document
      .getElementById("pageContent")
      .appendChild(addAndEditMilestone(data));
    document.getElementById("addMilestoneDialog").showModal();
  });

  clone.querySelector("#cancelButton").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  clone.querySelector("#confirmButton").textContent =
    props?.confermButtonText || "Confirm";

  const titleInput = clone.querySelector("#titleInput");
  const descriptionInput = clone.querySelector("#descriptionInput");
  const startDateInput = clone.querySelector("#startDateInput");
  const endDateInput = clone.querySelector("#endDateInput");

  clone.querySelector("#confirmButton").addEventListener("click", () => {
    goalObject.goalName = titleInput.value;
    goalObject.description = descriptionInput.value;
    goalObject.startDate = startDateInput.value;
    goalObject.endDate = endDateInput.value;
    goalObject.milestones = milestoneArray;

    if (typeof props?.onConfirm === "function") {
      props?.onConfirm(goalObject);
      dialog.close();
      dialog.remove();
    }
  });

  return clone;
}

const refreshMilestoneContainer = (milestoneContainer, milestoneArray) => {
  if (milestoneArray.length === 0) {
    const emptyTemplate = empty({
      title: "No Milestones Yet",
      description:
        "You have not added any milestones yet. Click the button below to add your first milestone.",
      icon: "Flag",
    });
    milestoneContainer.replaceChildren(emptyTemplate);
    count = 1;
  }
};

const addMilestoneCard = (
  milestoneContainer,
  milestoneCard,
  milestoneArray,
  currentId,
  milestoneItem,
) => {
  const clone = milestoneCard.cloneNode(true);
  clone.querySelector("h2").textContent = milestoneItem.title;
  clone.querySelector("p").textContent = milestoneItem.description;

  clone.querySelector("#deleteMilestoneBtn").addEventListener("click", () => {
    const index = milestoneArray.findIndex(
      (milestone) => milestone.id === currentId,
    );
    if (index !== -1) {
      milestoneArray.splice(index, 1);
    }
    clone.remove();
    refreshMilestoneContainer(milestoneContainer, milestoneArray);
  });
  milestoneContainer.appendChild(clone);

  milestoneArray.push(milestoneItem);
};
