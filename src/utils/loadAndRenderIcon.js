import { createIcons } from "lucide";

export default async function loadAndRenderIcon(
  iconName,
  rootElement,
  iElement,
) {
  const pascalIconName = toPascalCase(iconName);
  const fileName = toKebabCase(iconName);

  iElement.setAttribute("data-lucide", pascalIconName);

  try {
    const iconModule = await import(`@lucide/dist/esm/icons/${fileName}.mjs`);
    const iconComponent = iconModule.default;

    createIcons({
      icons: {
        [pascalIconName]: iconComponent,
      },
      nameAttr: "data-lucide",
      root: rootElement,
      inTemplates: true,
    });
  } catch (error) {
    console.error(
      `Lucide icon "${iconName}" failed to load dynamically:`,
      error,
    );
  }
}

function toPascalCase(str) {
  return str
    .replace(/(^\w|-\w)/g, (g) => g.replace("-", "").toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
