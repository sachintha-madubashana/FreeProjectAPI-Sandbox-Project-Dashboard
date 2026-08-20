import { createIcons } from "lucide";

export default async function loadAndRenderIcon(iconName, rootElement) {
  const fileName = iconName.toLowerCase();

  try {
    const iconModule = await import(
      `../../node_modules/lucide/dist/esm/icons/${fileName}.mjs`
    );
    const iconComponent = iconModule.default;

    createIcons({
      icons: {
        [iconName]: iconComponent,
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
