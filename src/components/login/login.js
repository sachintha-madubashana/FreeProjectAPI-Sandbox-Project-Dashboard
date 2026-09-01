import loginTemplate from "@/components/login/login.html?raw";

let isPasswordVisible = false;
const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
export default function login(props) {
  const template = document.createElement("template");
  template.innerHTML = loginTemplate;

  const clone = document.importNode(template.content, true);
  clone.querySelector("h2").textContent =
    props?.title || "Login to your account";
  clone.querySelector("#passwordVisibilityIcon").innerHTML = isPasswordVisible
    ? eyeIcon
    : eyeOffIcon;
  clone
    .querySelector("#passwordVisibilityToggler")
    .addEventListener("click", () => {
      togglePasswordVisibility();
    });
  clone.querySelector("#loginBtn").addEventListener("click", () => {
    const loginBtn = document.querySelector("#loginBtn");
    const email = document.querySelector("#loginEmailInput");
    const password = document.querySelector("#loginPasswordInput");

    loginBtn.disabled = true;
    loginBtn.innerHTML = `<svg aria-label="Loading" role="status" class="animate-spin lucide lucide-loader-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Login in...`;
    email.disabled = true;
    password.disabled = true;

    const isEmailValid = checkInputsEmpty(
      email,
      document.getElementById("emailInputError"),
      "Email is required.",
    );
    const isPasswordValid = checkInputsEmpty(
      password,
      document.getElementById("passwordInputError"),
      "Password is required.",
    );

    if (isEmailValid && isPasswordValid && typeof props?.login === "function") {
      const user = {
        emailId: email.value,
        password: password.value,
      };
      props?.login?.(user);
    }
  });

  clone.querySelector("#signUpbtn").addEventListener("click", () => {
    if (typeof props?.onNavigateToSignup === "function") {
      props.onNavigateToSignup();
    }
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
    resetAllLoginBtns();
    return false;
  }
  return true;
};

export const resetAllLogins = () => {
  const loginBtn = document.querySelector("#loginBtn");
  const email = document.querySelector("#loginEmailInput");
  const password = document.querySelector("#loginPasswordInput");

  email.value = "";
  password.value = "";

  email.disabled = false;
  password.disabled = false;

  loginBtn.disabled = false;
  loginBtn.innerHTML = "Login";
};

export const resetAllLoginBtns = () => {
  const loginBtn = document.querySelector("#loginBtn");
  const email = document.querySelector("#loginEmailInput");
  const password = document.querySelector("#loginPasswordInput");

  email.disabled = false;
  password.disabled = false;

  loginBtn.disabled = false;
  loginBtn.innerHTML = "Login";
};
