export default function initToastSystem() {
  const div = document.createElement("div");
  div.id = "toaster";
  div.className = "toaster";
  document.getElementById("app").appendChild(div);
}

//@param {Object} options - Options for the toast notification
//@param {string} options.category - Category of the toast (e.g., "info", "success", "warning", "error")
//@param {string} options.title - Title of the toast notification
//@param {string} options.description - Description of the toast notification
export const showToast = (options) => {
  const toaster = document.getElementById("toaster");

  if (!toaster) {
    console.error(
      "Toaster system not initialized. Call initAlertSystem() first.",
    );
    return;
  }

  toaster.toast({
    category: options?.category || "info",
    title: options?.title || "Default Title",
    description: options?.description || "Default Description",
    cancel: {
      label: "Dismiss",
      onclick: `toast.close()`,
    },
  });
};
