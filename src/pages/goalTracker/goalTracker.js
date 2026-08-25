import login from "@/components/login/login.js";
import register from "@/components/register/register.js";
import goalTrackerHTML from "@/pages/goalTracker/goalTracker.html?raw";
import goalTrakerDashboard from "@/pages/goalTracker/dashboard.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { refresh } from "@/router/router.js";
import taskPage from "@/pages/goalTracker/task.js";
import templatePage from "@/pages/projectTemp.js";

export default function goalTracker() {
  const logedInUser = localStorage.getItem("goalTrackerUser") || false;

  if (logedInUser === false) {
    const template = document.createElement("div");
    template.classList.add("size-full");

    const loginProps = {
      title: "Goal Tracker Login",
      onNavigateToSignup: () => {
        template.innerHTML = "";
        template.appendChild(register(registerProps));
      },
    };

    const registerProps = {
      title: "Goal Tracker Register",
      onNavigateToLogin: () => {
        template.innerHTML = "";
        template.appendChild(login(loginProps));
      },
    };

    template.appendChild(login(loginProps));

    return template;
  }

  const template = document.createElement("template");
  template.innerHTML = goalTrackerHTML;
  const clone = document.importNode(template.content, true);

  clone
    .querySelector("#tabsWithIconsPanelDashboard")
    .appendChild(goalTrakerDashboard());
  clone.querySelector("#tabsWithIconsPanelTask").appendChild(taskPage());
  clone.querySelector("#tabsWithIconsPanelGoal").appendChild(templatePage());
  clone
    .querySelector("#tabsWithIconsPanelReminders")
    .appendChild(templatePage());
  clone.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("goalTrackerUser");
    refresh();
  });

  // load and render icons for tabs
  loadIcons(clone);

  return clone;
}

const loadIcons = (clone) => {
  loadAndRenderIcon(
    "LayoutDashboard",
    clone.querySelector("#tabsWithIconsTabDashboard"),
    clone.querySelector("#tabDashboardIcon"),
  );
  loadAndRenderIcon(
    "Logs",
    clone.querySelector("#tabsWithIconsTabTask"),
    clone.querySelector("#tabTaskIcon"),
  );
  loadAndRenderIcon(
    "Goal",
    clone.querySelector("#tabsWithIconsTabGoal"),
    clone.querySelector("#tabGoalIcon"),
  );
  loadAndRenderIcon(
    "Bell",
    clone.querySelector("#tabsWithIconsTabReminders"),
    clone.querySelector("#tabRemindersIcon"),
  );
};
