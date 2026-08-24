import registerTemplate from "@/components/register/register.html?raw";
import { refresh } from "@/router/router.js";

let isPasswordVisible = false;
const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;

export default function register(props) {
  const template = document.createElement("template");
  template.innerHTML = registerTemplate;

  const clone = document.importNode(template.content, true);
  clone.querySelector("h2").textContent =
    props?.title || "Create a new account";

  clone.querySelector("#passwordVisibilityIcon").innerHTML = isPasswordVisible
    ? eyeIcon
    : eyeOffIcon;
  clone
    .querySelector("#passwordVisibilityToggler")
    .addEventListener("click", () => {
      togglePasswordVisibility();
    });

  clone.querySelector("#registerBtn").addEventListener("click", () => {
    const registerBtn = document.querySelector("#registerBtn");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const name = document.querySelector("#name");

    registerBtn.disabled = true;
    registerBtn.innerHTML = `<svg aria-label="Loading" role="status" class="animate-spin lucide lucide-loader-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Registering ...`;
    name.disabled = true;
    email.disabled = true;
    password.disabled = true;

    console.log("Name:", name.value);
    console.log("Email:", email.value);
    console.log("Password:", password.value);

    // localStorage.setItem(
    //   "goalTrackerUser",
    //   JSON.stringify({
    //     userId: 1223,
    //     email: "jane@abc.d",
    //     fullName: "John Doe",
    //     password: "123456",
    //   }),
    // );

    setTimeout(() => {
      email.value = "";
      password.value = "";

      email.disabled = false;
      password.disabled = false;

      registerBtn.disabled = false;
      registerBtn.innerHTML = "Register";

      refresh();
      navigateToLogin(props);
    }, 2000);
  });

  clone.querySelector("#goToLoginbtn").addEventListener("click", () => {
    navigateToLogin(props);
  });

  return clone;
}

const togglePasswordVisibility = () => {
  isPasswordVisible = !isPasswordVisible;
  document.getElementById("password").type = isPasswordVisible
    ? "text"
    : "password";
  document.getElementById("passwordVisibilityIcon").innerHTML =
    isPasswordVisible ? eyeIcon : eyeOffIcon;
};

const navigateToLogin = (props) => {
  if (typeof props?.onNavigateToLogin === "function") {
    props.onNavigateToLogin();
  }
};
