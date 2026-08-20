import dashboardBanner from "@/components/dashboard/dashboard-banner.html?raw";

const template = document.createElement("template");
template.innerHTML = dashboardBanner;

export default function dashboardBannerComponent(data) {
  const clone = template.content.cloneNode(true);
  const badge = clone.querySelector(".badge").cloneNode(true);
  const badgeContainer = clone.querySelector("#bannerBadges");
  badgeContainer.replaceChildren();

  clone.querySelector("h1").textContent = data.title;
  clone.querySelector("p").textContent = data.description;

  data.badges.forEach((badgeData) => {
    const badgeClone = badge.cloneNode(true);
    badgeClone.textContent = badgeData.text;

    badgeContainer.appendChild(badgeClone);
  });

  return clone;
}
