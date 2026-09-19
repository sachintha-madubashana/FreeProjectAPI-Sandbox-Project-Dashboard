import employeeAppUI from "@/pages/employeeApp/employeeApp.html?raw";
import employeeAppAdminUI from "@/pages/employeeApp/employeeAppAdmin.html?raw";
import loadAndRenderIcon from "@/utils/loadAndRenderIcon.js";
import requestHandler from "@/utils/requestHandler.js";
import { getPageByPath } from "@/utils/settings.js";
import { getAdminMode } from "@/components/header.js";

const EMPLOYEES_URL =
  "https://api.freeprojectapi.com/api/EmployeeApp/GetEmployees";
const PAGE_SIZE = 5;

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

const employeeAdminApp = (root) => {
  const loadingSkeleton = root.querySelector("#loadingSkeleton");
  const tableContent = root.querySelector("#tableContent");
};
