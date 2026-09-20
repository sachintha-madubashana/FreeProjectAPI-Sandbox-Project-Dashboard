import employeeAppUI from "@/pages/employeeApp/employeeApp.html?raw";
import employeeAppAdminUI from "@/pages/employeeApp/employeeAppAdmin.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import requestHandler from "@/utils/requestHandler.js";
import { getPageByPath } from "@/utils/settings.js";
import { getAdminMode } from "@/components/header.js";
import { showToast } from "@/utils/toastSystem.js";
import confirmationDialog from "@/components/dialogs/confirmationDialog/confirmationDialog.js";
import { generateDialogAndShow } from "@/utils/utilityFunctions.js";

const EMPLOYEES_URL =
  "https://api.freeprojectapi.com/api/EmployeeApp/GetEmployees";
const DEPARTMENTS_URL =
  "https://api.freeprojectapi.com/api/EmployeeApp/GetDepartments";
const DESIGNATIONS_URL =
  "https://api.freeprojectapi.com/api/EmployeeApp/GetDesignationsByDeptId";
const CREATE_EMPLOYEE_URL =
  "https://api.freeprojectapi.com/api/EmployeeApp/CreateEmployee";
const UPDATE_EMPLOYEE_URL =
  "https://api.freeprojectapi.com/api/EmployeeApp/UpdateEmployee";
const DELETE_EMPLOYEE_URL =
  "https://api.freeprojectapi.com/api/EmployeeApp/DeleteEmployee";
const PAGE_SIZE = 10;

export default function employeeAppPage() {
  const currentPath = window.location.pathname.split("/").pop();
  const page = getPageByPath("/" + currentPath);
  const template = document.createElement("template");
  let clone;
  if (getAdminMode()) {
    template.innerHTML = employeeAppAdminUI;
    clone = document.importNode(template.content, true);
    employeeAdminApp(clone);
  } else {
    template.innerHTML = employeeAppUI;
    clone = document.importNode(template.content, true);
    employeeApp(clone);
  }
  loadAndRenderIcon(
    page.icon,
    clone.querySelector("#pageHeader"),
    clone.querySelector("#icon"),
  );

  return clone;
}

const employeeApp = async (root) => {
  const loadingSkeleton = root.querySelector("#loadingSkeleton");
  const tableContent = root.querySelector("#tableContent");
  const pagination = root.querySelector("#pagination");
  const searchInput = root.querySelector("#searchInput");
  const searchButton = root.querySelector("#searchButton");
  let employees = [];
  let filteredEmployees = [];
  let currentPage = 1;

  const render = () => {
    const pageCount = Math.max(
      1,
      Math.ceil(filteredEmployees.length / PAGE_SIZE),
    );
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageEmployees = filteredEmployees.slice(start, start + PAGE_SIZE);
    tableContent.replaceChildren(generateTable(pageEmployees));
    renderPagination(
      pagination,
      filteredEmployees.length,
      currentPage,
      pageCount,
      (page) => {
        currentPage = page;
        render();
      },
    );
  };

  const search = () => {
    const query = searchInput.value.trim().toLowerCase();
    filteredEmployees = employees.filter((employee) =>
      [
        employee.fullName,
        employee.departmentName,
        employee.designationName,
        employee.phone,
        employee.employeeType,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
    currentPage = 1;
    render();
  };

  searchButton.addEventListener("click", search);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") search();
  });

  try {
    const response = await requestHandler(EMPLOYEES_URL);
    employees = Array.isArray(response)
      ? response
      : (response?.data ?? response?.result ?? []);
    filteredEmployees = employees;
    render();
  } catch (error) {
    tableContent.innerHTML =
      '<p class="p-4 text-sm text-destructive">Unable to load employees. Please try again later.</p>';
    console.error("Failed to load employees:", error);
  } finally {
    loadingSkeleton?.setAttribute("hidden", "true");
  }
};

const generateTable = (data) => {
  const template = document.createElement("template");
  template.innerHTML = `
  <div class="table-container">
    <table class="table">
        <thead class="sticky top-0 bg-base-100 bg-accent/50 backdrop-blur mt-0">
            <tr>
                <th>Full Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Type</th>
            </tr>
        </thead>
    <tbody>
    </tbody>
    </table>
  </div>`;
  const body = template.content.querySelector("tbody");

  data.forEach((employee) => {
    const row = document.createElement("tr");
    [
      employee.fullName,
      employee.departmentName,
      employee.designationName,
      employee.phone,
      employee.employeeType,
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value ?? "-";
      row.appendChild(cell);
    });
    body.appendChild(row);
  });

  return template.content.firstElementChild;
};

const renderPagination = (
  container,
  total,
  currentPage,
  pageCount,
  onPageChange,
) => {
  const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, total);
  container.replaceChildren();

  const summary = document.createElement("p");
  summary.className = "text-sm text-muted-foreground";
  summary.textContent = `Showing ${start} to ${end} of ${total} entries`;

  const controls = document.createElement("nav");
  controls.className = "flex items-center gap-1";

  const prevButton = document.createElement("button");
  prevButton.innerHTML = `<svg class="lucide lucide-chevron-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>`;
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => onPageChange(currentPage - 1));
  prevButton.type = "button";
  prevButton.className = "btn btn-sm";
  prevButton.dataset.variant = "ghost";
  controls.appendChild(prevButton);

  for (let page = 1; page <= pageCount; page += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-sm";
    button.dataset.variant = page === currentPage ? "primary" : "ghost";
    button.textContent = page;
    button.addEventListener("click", () => onPageChange(page));
    controls.appendChild(button);
  }

  const nextButton = document.createElement("button");
  nextButton.innerHTML = `<svg class="lucide lucide-chevron-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>`;
  nextButton.disabled = currentPage === pageCount;
  nextButton.addEventListener("click", () => onPageChange(currentPage + 1));
  nextButton.type = "button";
  nextButton.className = "btn btn-sm";
  nextButton.dataset.variant = "ghost";
  controls.appendChild(nextButton);

  container.append(summary, controls);
};

const employeeAdminApp = async (root) => {
  const loadingSkeleton = root.querySelector("#loadingSkeleton");
  const tableContent = root.querySelector("#tableContent");
  const pagination = root.querySelector("#pagination");
  const form = root.querySelector("#employeeForm");
  const formTitle = root.querySelector("#formTitle");
  const saveEmployeeText = root.querySelector("#saveEmployeeText");
  const cancelEditButton = root.querySelector("#cancelEditButton");
  const departmentSelect = root.querySelector("#departmentId");
  const designationSelect = root.querySelector("#designationId");
  const genderSelect = root.querySelector("#gender");
  const employeeTypeSelect = root.querySelector("#employeeType");
  const searchInput = root.querySelector("#searchInput");
  const searchButton = root.querySelector("#searchButton");
  let employees = [];
  let filteredEmployees = [];
  let currentPage = 1;
  let editingEmployeeId = null;
  const genderList = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  setupCustomSelect(form, "gender");
  setupCustomSelect(form, "employeeType");
  setupCustomSelect(form, "departmentId");
  setupCustomSelect(form, "designationId");
  setCustomSelectOptions(form, "gender", genderList, "Select gender");
  setCustomSelectOptions(
    form,
    "employeeType",
    [
      { value: "Permanent", label: "Permanent" },
      { value: "Contract", label: "Contract" },
      { value: "Part-time", label: "Part-time" },
      { value: "Full-time", label: "Full-time" },
    ],
    "Select type",
  );

  const render = () => {
    const pageCount = Math.max(
      1,
      Math.ceil(filteredEmployees.length / PAGE_SIZE),
    );
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageEmployees = filteredEmployees.slice(start, start + PAGE_SIZE);
    tableContent.replaceChildren(generateAdminTable(pageEmployees));
    renderPagination(
      pagination,
      filteredEmployees.length,
      currentPage,
      pageCount,
      (page) => {
        currentPage = page;
        render();
      },
    );
  };

  const search = () => {
    const query = searchInput.value.trim().toLowerCase();
    filteredEmployees = employees.filter((employee) =>
      [
        employee.fullName,
        employee.email,
        employee.departmentName,
        employee.designationName,
        employee.phone,
        employee.employeeType,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
    currentPage = 1;
    render();
  };

  const refreshEmployees = async () => {
    const response = await requestHandler(EMPLOYEES_URL);
    employees = getArrayResponse(response);
    search();
  };

  const resetForm = () => {
    editingEmployeeId = null;
    form.reset();
    [
      genderSelect,
      employeeTypeSelect,
      departmentSelect,
      designationSelect,
    ].forEach((select) => setCustomSelectValue(form, select.id, ""));
    formTitle.textContent = "Create Employee";
    saveEmployeeText.textContent = "Register Employee";
    cancelEditButton.hidden = true;
    setCustomSelectOptions(
      form,
      "designationId",
      [],
      "Select department first",
    );
    setCustomSelectDisabled(form, "designationId", true);
    clearValidation(form);
  };

  const loadDesignations = async (departmentId, selectedId = "") => {
    setCustomSelectOptions(
      form,
      "designationId",
      [],
      "Loading designations...",
    );
    setCustomSelectDisabled(form, "designationId", true);
    if (!departmentId) {
      setCustomSelectOptions(
        form,
        "designationId",
        [],
        "Select department first",
      );
      return;
    }
    try {
      const response = await requestHandler(DESIGNATIONS_URL, "GET", {
        deptId: departmentId,
      });
      setCustomSelectOptions(
        form,
        "designationId",
        getArrayResponse(response),
        "Select designation",
        "designationId",
        "designationName",
      );
      setCustomSelectValue(form, "designationId", selectedId);
    } catch (error) {
      setCustomSelectOptions(
        form,
        "designationId",
        [],
        "Unable to load designations",
      );
      notify("error", "Unable to load designations", error.message);
    } finally {
      setCustomSelectDisabled(form, "designationId", false);
    }
  };

  const startEditing = async (employee) => {
    console.log("Editing employee:", employee);
    editingEmployeeId = employee.employeeId;
    formTitle.textContent = "Update Employee";
    saveEmployeeText.textContent = "Save Changes";
    cancelEditButton.hidden = false;
    ["fullName", "email", "phone", "dateOfJoining", "salary"].forEach(
      (field) => {
        form.querySelector(`#${field}`).value =
          field === "dateOfJoining"
            ? String(employee[field] ?? "").slice(0, 10)
            : (employee[field] ?? "");
      },
    );
    setCustomSelectValue(form, "gender", employee.gender.toLowerCase());
    setCustomSelectValue(form, "employeeType", employee.employeeType);
    setCustomSelectValue(form, "departmentName", employee.departmentName);
    await loadDesignations(employee.departmentId, employee.designationId);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  departmentSelect.addEventListener("change", () => {
    loadDesignations(departmentSelect.value);
  });
  searchButton.addEventListener("click", search);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") search();
  });
  cancelEditButton.addEventListener("click", resetForm);
  tableContent.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;
    const employee = employees.find(
      (item) => String(item.employeeId) === actionButton.dataset.employeeId,
    );
    if (!employee) return;
    if (actionButton.dataset.action === "edit") {
      await startEditing(employee);
      return;
    }
    if (actionButton.dataset.action === "delete") {
      generateDialogAndShow(confirmationDialog, {
        dialogId: "deleteConfirmationDialog",
        title: `Delete ${employee.fullName}?`,
        description:
          "This action cannot be undone. Please confirm your choice.",
        confermButtonText: "Delete",
        onConfirm: async () => {
          try {
            await requestHandler(DELETE_EMPLOYEE_URL, "DELETE", {
              id: employee.employeeId,
            });
            if (editingEmployeeId === employee.employeeId) resetForm();
            await refreshEmployees();
            notify(
              "success",
              "Employee deleted",
              `${employee.fullName} was removed.`,
            );
          } catch (error) {
            notify("error", "Unable to delete employee", error.message);
          }
        },
      });
    }
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const formData = new FormData(form);
    const employee = Object.fromEntries(formData.entries());
    employee.departmentId = Number(employee.departmentId);
    employee.designationId = Number(employee.designationId);
    employee.salary = Number(employee.salary);
    if (editingEmployeeId !== null) employee.employeeId = editingEmployeeId;

    try {
      await requestHandler(
        editingEmployeeId === null
          ? CREATE_EMPLOYEE_URL
          : UPDATE_EMPLOYEE_URL + "?id=" + editingEmployeeId,
        editingEmployeeId === null ? "POST" : "PUT",
        employee,
      );
      const wasEditing = editingEmployeeId !== null;
      resetForm();
      await refreshEmployees();
      notify(
        "success",
        wasEditing ? "Employee updated" : "Employee created",
        "The employee registry is up to date.",
      );
    } catch (error) {
      notify("error", "Unable to save employee", error.message);
    }
  });

  try {
    const [departmentResponse, employeeResponse] = await Promise.all([
      requestHandler(DEPARTMENTS_URL),
      requestHandler(EMPLOYEES_URL),
    ]);
    setCustomSelectOptions(
      form,
      "departmentId",
      getArrayResponse(departmentResponse),
      "Select department",
      "departmentId",
      "departmentName",
    );
    employees = getArrayResponse(employeeResponse);
    filteredEmployees = employees;
    render();
  } catch (error) {
    tableContent.innerHTML =
      '<p class="p-4 text-sm text-destructive">Unable to load employee data. Please try again later.</p>';
    notify("error", "Unable to load employee data", error.message);
  } finally {
    loadingSkeleton?.setAttribute("hidden", "true");
  }
};

const getArrayResponse = (response) =>
  Array.isArray(response)
    ? response
    : (response?.data ?? response?.result ?? []);

const setupCustomSelect = (root, selectId) => {
  const listbox = root.querySelector(`#${selectId}-listbox`);
  const trigger = root.querySelector(`#${selectId}-trigger`);
  const input = root.querySelector(`#${selectId}`);
  listbox.addEventListener("click", (event) => {
    const option = event.target.closest('[role="option"]');
    if (!option || trigger.disabled) return;
    setCustomSelectValue(root, selectId, option.dataset.value);
    input.dispatchEvent(new Event("change", { bubbles: true }));
    trigger.setAttribute("aria-expanded", "false");
  });
};

const setCustomSelectOptions = (
  root,
  selectId,
  options,
  placeholder,
  valueKey = "value",
  labelKey = "label",
) => {
  const listbox = root.querySelector(`#${selectId}-listbox`);
  const input = root.querySelector(`#${selectId}`);
  const triggerText = root.querySelector(`#${selectId}-trigger span`);
  const select = root.querySelector(`#${selectId}-select`);
  if (!listbox || !input || !triggerText) return;
  listbox.replaceChildren();
  input.value = "";
  select.dataset.placeholder = placeholder;
  triggerText.textContent = placeholder;
  options.forEach((option) => {
    const item = document.createElement("div");
    item.role = "option";
    item.dataset.value = option[valueKey];
    item.textContent = option[labelKey];
    listbox.appendChild(item);
  });
};

const setCustomSelectValue = (root, selectId, value) => {
  const input = root.querySelector(`#${selectId}`);
  const trigger = root.querySelector(`#${selectId}-trigger`);
  const option = root.querySelector(
    `#${selectId}-listbox [data-value="${CSS.escape(String(value ?? ""))}"]`,
  );
  input.value = value ?? "";
  trigger.querySelector("span").textContent =
    option?.textContent ?? trigger.closest(".select").dataset.placeholder;
};

const setCustomSelectDisabled = (root, selectId, disabled) => {
  const trigger = root.querySelector(`#${selectId}-trigger`);
  trigger.disabled = disabled;
  trigger.setAttribute("aria-disabled", String(disabled));
};

const validateForm = (form) => {
  clearValidation(form);
  const values = Object.fromEntries(new FormData(form).entries());
  const errors = {
    fullName: !values.fullName.trim()
      ? "Please enter the employee's full name."
      : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ? "Enter a valid email address."
      : "",
    phone: !values.phone.trim() ? "Enter a phone number." : "",
    gender: !values.gender ? "Please select a gender." : "",
    dateOfJoining: !values.dateOfJoining ? "Please select a joining date." : "",
    employeeType: !values.employeeType ? "Please select an employee type." : "",
    salary:
      !values.salary || Number(values.salary) < 0
        ? "Enter a valid salary."
        : "",
    departmentId: !values.departmentId ? "Please select a department." : "",
    designationId: !values.designationId ? "Please select a designation." : "",
  };
  Object.entries(errors).forEach(([field, message]) => {
    if (message) setFieldError(form, field, message);
  });
  return Object.values(errors).every((message) => !message);
};

const clearValidation = (form) => {
  form.querySelectorAll("[data-field]").forEach((field) => {
    field.removeAttribute("data-invalid");
    field
      .querySelectorAll("input, button")
      .forEach((control) => control.removeAttribute("aria-invalid"));
    const error = field.querySelector('[role="alert"]');
    if (error) error.hidden = true;
  });
};

const setFieldError = (form, fieldName, message) => {
  const field = form.querySelector(`[data-field="${fieldName}"]`);
  field.dataset.invalid = "true";
  field
    .querySelectorAll("input, button")
    .forEach((control) => control.setAttribute("aria-invalid", "true"));
  const error = field.querySelector('[role="alert"]');
  error.textContent = message;
  error.hidden = false;
};

const notify = (category, title, description) => {
  showToast({ category, title, description });
};

const generateAdminTable = (data) => {
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="table-container">
      <table class="table">
        <thead class="sticky top-0 bg-base-100 bg-accent/50 backdrop-blur">
          <tr><th>Employee</th><th>Department</th><th>Designation</th><th>Contact</th><th>Actions</th></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>`;
  const body = template.content.querySelector("tbody");
  data.forEach((employee) => {
    const row = document.createElement("tr");
    const values = [
      [employee.fullName, employee.email],
      [employee.departmentName],
      [employee.designationName],
      [employee.phone],
    ];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent =
        index === 0
          ? `${value[0] ?? "-"} (${value[1] ?? "-"})`
          : (value[0] ?? "-");
      row.appendChild(cell);
    });
    const actions = document.createElement("td");
    actions.className = "whitespace-nowrap";
    [
      ["edit", "Edit", "outline"],
      ["delete", "Delete", "destructive"],
    ].forEach(([action, label, variant]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-sm me-1";
      button.dataset.variant = variant;
      button.dataset.action = action;
      button.dataset.employeeId = employee.employeeId;
      button.textContent = label;
      actions.appendChild(button);
    });
    row.appendChild(actions);
    body.appendChild(row);
  });
  return template.content.firstElementChild;
};
