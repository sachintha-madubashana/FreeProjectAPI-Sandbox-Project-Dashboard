import { getProjectStatuses } from "@/utils/settings.js";

export const getProjectStatusBadge = (type) => {
  const template = document.createElement("template");
  const status = getProjectStatuses();

  const classMapping = {
    [status[0]]:
      "badge bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    [status[1]]:
      "badge bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    [status[2]]:
      "badge bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  };

  let htmlString = `<span class="${classMapping[type]}">${capitalizeFirstLetter(type)}</span>`;

  template.innerHTML = htmlString.trim();

  return template.content.firstElementChild;
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const sortingFunction = (pages) => {
  const projectStatusOrder = {
    active: 1,
    developing: 2,
    unavilable: 3,
  };

  return [...pages].sort((a, b) => {
    const statusA = projectStatusOrder[a.status] || 4;
    const statusB = projectStatusOrder[b.status] || 4;

    if (statusA !== statusB) {
      return statusA - statusB;
    } else {
      return a.title.localeCompare(b.title);
    }
  });
};

export const generateDialogAndShow = (dialogComponent, data) => {
  document.getElementById("pageContent").appendChild(dialogComponent(data));
  document.getElementById(data.dialogId).showModal();
};
