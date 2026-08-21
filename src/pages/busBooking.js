import busBooking from "@/pages/html/busBooking.html?raw";
import bussBookingAdmin from "@/pages/html/busBookingAdmin.html?raw";
import { getAdminMode } from "@/components/header.js";

export default function busBookingPage() {
  const template = document.createElement("template");
  if (getAdminMode()) {
    template.innerHTML = bussBookingAdmin;
  } else {
    template.innerHTML = busBooking;
  }

  const clone = template.content.cloneNode(true);

  return clone;
}
