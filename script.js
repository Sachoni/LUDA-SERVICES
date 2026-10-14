/* =========================================================
   LUDA SERVICES — Interactive behaviour
   IMPORTANT:
   1. Set WHATSAPP_NUMBER to the client's number, digits only.
      Example Kenya number: 2547XXXXXXXX (no +, spaces or dashes).
   2. The form opens WhatsApp; it does not confirm appointments.
   3. This front-end does not save bookings to a business database.
   ========================================================= */

// Replace this placeholder with the client's WhatsApp number.
const WHATSAPP_NUMBER = "25479997734";

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const bookingForm = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("serviceSelect");
const bookingDate = document.getElementById("bookingDate");
const formFeedback = document.getElementById("formFeedback");

// Set the footer year automatically.
document.getElementById("year").textContent = new Date().getFullYear();

// Do not allow customers to choose a date in the past.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
bookingDate.min = localToday;

// Mobile navigation toggle.
menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

// Close mobile navigation after a link is selected.
siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

// Service buttons pre-select the service in the booking form.
document.querySelectorAll(".choose-service").forEach((button) => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.service;
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    serviceSelect.focus({ preventScroll: true });
  });
});

// Create a WhatsApp message from the form. The customer reviews/sends it in WhatsApp.
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "";

  if (!bookingForm.reportValidity()) return;

  // Do not open a fake or broken WhatsApp link while the number is still a placeholder.
  if (!/^254\d{9}$/.test(WHATSAPP_NUMBER)) {
    formFeedback.textContent =
      "The booking form is ready, but the business WhatsApp number has not been configured yet. Please contact the site owner.";
    return;
  }

  const formData = new FormData(bookingForm);
  const customerName = String(formData.get("customerName")).trim();
  const customerPhone = String(formData.get("customerPhone")).trim();
  const service = String(formData.get("service"));
  const date = String(formData.get("date"));
  const time = String(formData.get("time"));
  const notes = String(formData.get("notes")).trim();

  const message = [
    "Hello Luda Services, I would like to request an appointment.",
    "",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Service: ${service}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    notes ? `Extra details: ${notes}` : ""
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  formFeedback.textContent = "WhatsApp has opened with your request. Send the message there; wait for the business to confirm.";
});

// Contact button scrolls to booking until the business number is set.
document.getElementById("contactWhatsApp").addEventListener("click", (event) => {
  if (!/^254\d{9}$/.test(WHATSAPP_NUMBER)) {
    event.preventDefault();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    formFeedback.textContent = "The business WhatsApp number will be added before the website goes live.";
  } else {
    event.currentTarget.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  }
});
