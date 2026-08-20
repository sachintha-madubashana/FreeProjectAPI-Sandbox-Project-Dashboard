import headder from "@/components/header.html?raw";

// Initialize admin mode button functionality
const initAdminModeButton = (clone) => {
  const adminModeButton = clone.querySelector("#adminMode");
  if (adminModeButton) {
    adminModeButton.addEventListener("click", () => {
      const buttonMode =
        adminModeButton.attributes.getNamedItem("data-variant")?.value;
      if (buttonMode === "primary") {
        adminModeButton.attributes.getNamedItem("data-variant").value =
          "outline";
        adminModeButton
          .querySelector(".lucide-shield")
          .classList.toggle("hidden");
        adminModeButton
          .querySelector(".lucide-shield-minus")
          .classList.toggle("hidden");
        console.log("Admin mode disabled");
      } else {
        adminModeButton.attributes.getNamedItem("data-variant").value =
          "primary";
        adminModeButton
          .querySelector(".lucide-shield")
          .classList.toggle("hidden");
        adminModeButton
          .querySelector(".lucide-shield-minus")
          .classList.toggle("hidden");
        console.log("Admin mode enabled");
      }
      localStorage.setItem(
        "adminMode",
        adminModeButton.attributes.getNamedItem("data-variant")?.value ===
          "primary"
          ? "primary"
          : "outline",
      );
    });
    const storedAdminMode = localStorage.getItem("adminMode");
    if (storedAdminMode) {
      adminModeButton.attributes.getNamedItem("data-variant").value =
        storedAdminMode;
      if (storedAdminMode === "primary") {
        adminModeButton
          .querySelector(".lucide-shield-minus")
          .classList.add("hidden");
      } else {
        adminModeButton.querySelector(".lucide-shield").classList.add("hidden");
      }
    }
  }
};

// Initialize theme mode based on stored preference
(() => {
  try {
    const stored = localStorage.getItem("themeMode");
    if (
      stored
        ? stored === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    }
  } catch (_) {}
})();

// Theme toggle function
const toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("themeMode", isDark ? "dark" : "light");
};

export default function headderComponent() {
  const template = document.createElement("template");
  template.innerHTML = headder;
  const clone = template.content.cloneNode(true);

  // Add event listener for admin mode button
  initAdminModeButton(clone);

  // Add event listener for theme toggle button
  clone.querySelector("#themeToggle").addEventListener("click", () => {
    toggleTheme();
  });

  return clone;
}
