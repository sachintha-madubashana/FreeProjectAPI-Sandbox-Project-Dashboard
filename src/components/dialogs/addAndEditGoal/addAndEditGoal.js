import addAndEditGoalTemplate from "@/components/dialogs/addAndEditGoal/addAndEditGoal.html?raw";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";
import empty from "@/components/empty/empty.js";

export default function addAndEditGoal(props) {
  const template = document.createElement("template");
  template.innerHTML = addAndEditGoalTemplate;
  const clone = document.importNode(template.content, true);

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

  let count = 0;
  clone.querySelector("#addMilestoneButton").addEventListener("click", () => {
    if (milestoneArray.length === 0) {
      milestoneContainer.replaceChildren();
    }

    const currentId = count;

    const clone = milestoneCard.cloneNode(true);
    clone.querySelector("h2").textContent = "Milestone " + currentId;
    clone.querySelector("p").textContent = "This is milestone " + currentId;

    clone.querySelector("#deleteMilestoneBtn").addEventListener("click", () => {
      console.log("Deleting milestone with id:", currentId);
      milestoneArray = milestoneArray.filter(
        (milestone) => milestone.id !== currentId,
      );
      clone.remove();
      refreshMilestoneContainer(milestoneContainer, milestoneArray);
      console.log("milestoneArray after deletion:", milestoneArray);
    });
    milestoneContainer.appendChild(clone);

    milestoneArray.push({
      id: currentId,
      title: "Milestone " + currentId,
      description: "This is milestone " + currentId,
      targetDate: "2026-08-28T00:00:00",
    });
    count++;
  });

  clone.querySelector("#cancelButton").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  clone.querySelector("#confirmButton").textContent =
    props?.confermButtonText || "Confirm";

  clone.querySelector("#confirmButton").addEventListener("click", () => {
    if (typeof props?.onConfirm === "function") {
      props?.onConfirm();
      dialog.close();
      dialog.remove();
    }
  });

  return clone;
}

const refreshMilestoneContainer = (milestoneContainer, milestoneArray) => {
  console.log("milestoneMap:", milestoneArray);
  if (milestoneArray.length === 0) {
    const emptyTemplate = empty({
      title: "No Milestones Yet",
      description:
        "You have not added any milestones yet. Click the button below to add your first milestone.",
      icon: "Flag",
    });
    milestoneContainer.replaceChildren(emptyTemplate);
  }
};
