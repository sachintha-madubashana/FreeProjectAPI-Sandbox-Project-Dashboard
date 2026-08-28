import addAndEditMilestoneTemplate from "@/components/dialogs/addAndEditMilestone/addAndEditMilestone.html?raw";

export default function addAndEditMilestone(props) {
  const template = document.createElement("template");
  template.innerHTML = addAndEditMilestoneTemplate;
  const clone = document.importNode(template.content, true);

  const dialog = clone.querySelector("dialog");
  dialog.id = props?.dialogId || "dialogId";
  clone.querySelector("#addAndEditMilestoneTitle").textContent =
    props?.title || "Milestone Details";
  clone.querySelector("#addAndEditMilestoneDescription").textContent =
    props?.description;

  const titleImput = clone.querySelector("#milestoneInputTitle");
  const dateInput = clone.querySelector("#milestoneInputDate");
  const descriptionInput = clone.querySelector("#milestoneDescriptionInput");

  clone.querySelector("#saveBtn").addEventListener("click", () => {
    const title = titleImput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;

    const milestoneItem = {
      title: title,
      date: date,
      description: description,
    };

    if (props?.onConfirm) {
      props.onConfirm(milestoneItem);
      dialog.close();
      dialog.remove();
    }
  });

  return clone;
}
