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
  const milestoneErrorSection = clone.querySelector("#milestoneErrorSection");

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
      if (!title || !date) {
        setError(milestoneErrorSection, "Title and Date are required fields.");
        return;
      }
      if (new Date(date) < new Date()) {
        setError(
          milestoneErrorSection,
          "Please select a future date and time.",
        );
        return;
      }
      props.onConfirm(milestoneItem);
      dialog.close();
      dialog.remove();
    }
  });

  return clone;
}

const setError = (container, errorMessage) => {
  container.querySelector("h2").textContent = "Error";
  container.querySelector("p").textContent = errorMessage;
  container.classList.remove("hidden");
};
