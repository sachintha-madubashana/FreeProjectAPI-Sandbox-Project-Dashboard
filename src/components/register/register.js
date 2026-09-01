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
    const email = document.querySelector("#registerEmailInput");
    const password = document.querySelector("#registerPasswordInput");
    const fullName = document.querySelector("#registerFullNameInput");

    registerBtn.disabled = true;
    registerBtn.innerHTML = `<svg aria-label="Loading" role="status" class="animate-spin lucide lucide-loader-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Registering ...`;
    fullName.disabled = true;
    email.disabled = true;
    password.disabled = true;

    const isNameValid = checkInputsEmpty(
      fullName,
      document.getElementById("registerFullNameInputError"),
      "Full Name is required.",
    );
    const isEmailValid = checkInputsEmpty(
      email,
      document.getElementById("registerEmailInputError"),
      "Email is required.",
    );
    const isPasswordValid = checkInputsEmpty(
      password,
      document.getElementById("registerPasswordInputError"),
      "Password is required.",
    );
    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      typeof props?.register === "function"
    ) {
      const user = {
        fullName: fullName.value,
        emailId: email.value,
        password: password.value,
        mobileNo: "0000000000",
      };

      props?.register?.(user);
    }
  });

  clone.querySelector("#goToLoginbtn").addEventListener("click", () => {
    navigateToLogin(props);
  });

  return clone;
}
const checkInputsEmpty = (inputTag, errorMsgTag, errorMsg) => {
  if (inputTag.value.trim() === "") {
    errorMsgTag.classList.remove("hidden");
    errorMsgTag.textContent = errorMsg;

    inputTag.addEventListener(
      "input",
      () => {
        if (inputTag.value.trim() !== "") {
          errorMsgTag.classList.add("hidden");
        }
      },
      { once: true },
    );
    resetAllRegisterBtns();
    return false;
  }
};

const togglePasswordVisibility = () => {
  isPasswordVisible = !isPasswordVisible;
  document.getElementById("registerPasswordInput").type = isPasswordVisible
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

export const resetAllRegisters = () => {
  const registerBtn = document.querySelector("#registerBtn");
  const email = document.querySelector("#registerEmailInput");
  const password = document.querySelector("#registerPasswordInput");
  const fullName = document.querySelector("#registerFullNameInput");

  fullName.value = "";
  email.value = "";
  password.value = "";

  fullName.disabled = false;
  email.disabled = false;
  password.disabled = false;

  registerBtn.disabled = false;
  registerBtn.innerHTML = "Register";
};

export const resetAllRegisterBtns = () => {
  const registerBtn = document.querySelector("#registerBtn");
  const email = document.querySelector("#registerEmailInput");
  const password = document.querySelector("#registerPasswordInput");
  const fullName = document.querySelector("#registerFullNameInput");

  fullName.disabled = false;
  email.disabled = false;
  password.disabled = false;

  registerBtn.disabled = false;
  registerBtn.innerHTML = "Register";
};
