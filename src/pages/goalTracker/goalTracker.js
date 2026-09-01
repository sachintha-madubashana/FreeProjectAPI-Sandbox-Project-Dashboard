import login, {
  resetAllLogins,
  resetAllLoginBtns,
} from "@/components/login/login.js";
import register from "@/components/register/register.js";
import goalTrackerHTML from "@/pages/goalTracker/goalTracker.html?raw";
import goalTrakerDashboard from "@/pages/goalTracker/dashboard.js";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import { refresh } from "@/router/router.js";
import taskPage from "@/pages/goalTracker/task.js";
import goalsPage from "@/pages/goalTracker/goals.js";
import remindersPage from "@/pages/goalTracker/reminders.js";
import { showToast } from "@/utils/toastSystem";

const TABS_CONFIG = {
  dashboard: {
    btn: "#tabsWithIconsTabDashboardBtn",
    panel: "#tabsWithIconsPanelDashboard",
    icon: "#tabDashboardIcon",
    iconName: "LayoutDashboard",
    page: goalTrakerDashboard,
  },
  tasks: {
    btn: "#tabsWithIconsTabTaskBtn",
    panel: "#tabsWithIconsPanelTask",
    icon: "#tabTaskIcon",
    iconName: "Logs",
    page: taskPage,
  },
  goals: {
    btn: "#tabsWithIconsTabGoalBtn",
    panel: "#tabsWithIconsPanelGoal",
    icon: "#tabGoalIcon",
    iconName: "Goal",
    page: goalsPage,
  },
  reminders: {
    btn: "#tabsWithIconsTabRemindersBtn",
    panel: "#tabsWithIconsPanelReminders",
    icon: "#tabRemindersIcon",
    iconName: "Bell",
    page: remindersPage,
  },
};
export default function goalTracker(params) {
  const logedInUser = localStorage.getItem("goalTrackerUser") || false;
  if (logedInUser === false) {
    const template = document.createElement("div");
    template.classList.add("size-full");

    const loginProps = {
      title: "Goal Tracker Login",
      login: (user) => {
        fetch("https://api.freeprojectapi.com/api/GoalTracker/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            localStorage.setItem("goalTrackerUser", JSON.stringify(data));
            resetAllLogins();
            refresh();
          })
          .catch((error) => {
            showToast({
              category: "error",
              title: "Error",
              description: error.message,
            });
            resetAllLoginBtns();
            console.error("Error:", error);
          });
      },
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

    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url);

    template.appendChild(login(loginProps));

    return template;
  }

  const template = document.createElement("template");
  template.innerHTML = goalTrackerHTML;
  const clone = document.importNode(template.content, true);

  Object.entries(TABS_CONFIG).forEach(([tabKey, config]) => {
    clone.querySelector(config.panel)?.appendChild(config.page());

    clone.querySelector(config.btn)?.addEventListener("click", () => {
      updateUrlParameter("tab", tabKey);
    });
  });

  const activeTabKey = params?.tab || "dashboard";
  const activeConfig = TABS_CONFIG[activeTabKey];

  if (activeConfig) {
    Object.values(TABS_CONFIG).forEach((config) => {
      const btn = clone.querySelector(config.btn);
      const panel = clone.querySelector(config.panel);

      btn?.setAttribute("aria-selected", "false");
      btn?.setAttribute("tabindex", "-1");

      btn?.removeAttribute("data-state");
      panel?.removeAttribute("data-state");
      panel?.setAttribute("hidden", "true");
    });

    const targetBtn = clone.querySelector(activeConfig.btn);
    const targetPanel = clone.querySelector(activeConfig.panel);

    targetBtn?.setAttribute("aria-selected", "true");
    targetBtn?.setAttribute("tabindex", "0");
    targetBtn?.setAttribute("data-state", "active");

    targetPanel?.removeAttribute("hidden");
    targetPanel?.setAttribute("data-state", "active");
  }

  clone.querySelector("#logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("goalTrackerUser");
    refresh();
  });

  loadIcons(clone);

  setTimeout(() => {
    window.basecoat?.refresh?.(document.querySelector(".tabs"));
  }, 0);

  return clone;
}

const loadIcons = (clone) => {
  loadAndRenderIcon(
    "LayoutDashboard",
    clone.querySelector("#tabsWithIconsTabDashboardBtn"),
    clone.querySelector("#tabDashboardIcon"),
  );
  loadAndRenderIcon(
    "Logs",
    clone.querySelector("#tabsWithIconsTabTaskBtn"),
    clone.querySelector("#tabTaskIcon"),
  );
  loadAndRenderIcon(
    "Goal",
    clone.querySelector("#tabsWithIconsTabGoalBtn"),
    clone.querySelector("#tabGoalIcon"),
  );
  loadAndRenderIcon(
    "Bell",
    clone.querySelector("#tabsWithIconsTabRemindersBtn"),
    clone.querySelector("#tabRemindersIcon"),
  );
};

function updateUrlParameter(key, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, "", url);
}
