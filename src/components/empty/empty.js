import empty from "@/components/empty/empty.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon";

export default function emptyComponent(props) {
  const template = document.createElement("template");
  template.innerHTML = empty;
  const clone = document.importNode(template.content, true);

  clone.querySelector("#title").textContent = props?.title || "No Title Yet";
  clone.querySelector("#description").textContent =
    props?.description ||
    "No description available. Please provide a description for this component.";

  loadAndRenderIcon(
    props?.icon || "Bug",
    clone.querySelector("#icon").parentElement,
    clone.querySelector("#icon"),
  );
  console.log("props?.action:", props?.action);
  if (props?.action) {
    const actionButton = clone.querySelector("#actionButton");
    actionButton.textContent = props?.action?.text || "Click Me";
    actionButton.setAttribute(
      "data-variant",
      props?.action?.variant || "primary",
    );
    actionButton.addEventListener("click", () => {
      if (typeof props?.action?.callback === "function") {
        props.action.callback();
      }
    });
    return clone;
  }

  clone.querySelector("footer").remove();

  return clone;
}
