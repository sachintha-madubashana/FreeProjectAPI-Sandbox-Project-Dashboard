import busBooking from "@/pages/busBooking.html?raw";

export default function busBookingPage() {
  const template = document.createElement("template");
  template.innerHTML = busBooking;
  const clone = template.content.cloneNode(true);

  return clone;
}
