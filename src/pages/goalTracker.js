import login from "@/components/login/login.js";
import register from "@/components/register/register.js";
import goalTrakerDashboard from "@/pages/html/goalTraker/dashboard.js";

export default function goalTracker() {
  const template = document.createElement("div");
  template.classList.add("size-full");
  const logedInUser = localStorage.getItem("goalTrackerUser") || false;

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

  template.appendChild(
    logedInUser === false ? login(loginProps) : goalTrakerDashboard(),
  );

  return template;
}
