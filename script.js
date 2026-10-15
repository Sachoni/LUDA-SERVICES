
/* ============================================
   LUDA SERVICES — JAVASCRIPT
   Navigation, service selection and WhatsApp
   ============================================ */

// Client's WhatsApp number.
// Kenyan international format: 254 + 9 digits.
const WHATSAPP_NUMBER = "254799977734";

// Get the HTML elements.
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const bookingForm = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("serviceSelect");
const bookingDate = document.getElementById("bookingDate");
const formFeedback = document.getElementById("formFeedback");
const contactWhatsApp = document.getElementById("contactWhatsApp");

// Update the copyright year automatically.
document.getElementById("year").textContent =
    new Date().getFullYear();

// Prevent selecting a past appointment date.
const now = new Date();

const today = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

bookingDate.min = today;

// MOBILE NAVIGATION
menuToggle.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu when a navigation link is selected.
navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// SERVICE SELECTION
// Clicking a service card's Book button selects that service.
document.querySelectorAll(".choose-service").forEach(function (button) {
    button.addEventListener("click", function () {
        serviceSelect.value = button.dataset.service;

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// WHATSAPP CONTACT BUTTON
// The number is included directly in the HTML link too.
// This code ensures the destination is set consistently.
contactWhatsApp.href = `https://wa.me/${WHATSAPP_NUMBER}`;
contactWhatsApp.target = "_blank";
contactWhatsApp.rel = "noopener noreferrer";

// BOOKING FORM
bookingForm.addEventListener("submit", function (event) {
    // Stop the page from refreshing when the form is submitted.
    event.preventDefault();

    formFeedback.textContent = "";

    // Ask the browser to check all required fields.
    if (!bookingForm.reportValidity()) {
        return;
    }

    // Read the customer's information.
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const service = serviceSelect.value;
    const date = bookingDate.value;
    const time = document.getElementById("bookingTime").value;
    const notes = document.getElementById("notes").value.trim();

    // Build the WhatsApp message.
    const message = [
        "Hello Luda Services!",
        "",
        "I would like to request an appointment.",
        "",
        `Customer name: ${name}`,
        `Customer phone: ${phone}`,
        `Service: ${service}`,
        `Preferred date: ${date}`,
        `Preferred time: ${time}`,
        notes ? `Additional details: ${notes}` : "",
        "",
        "Please confirm if this appointment is available."
    ].filter(Boolean).join("\n");

    // Encode the message so spaces and newlines work in the URL.
    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab.
    const newTab = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

    // If the browser blocks the new tab, give the customer a fallback link.
    if (!newTab) {
        formFeedback.innerHTML =
            `Your request is ready. ` +
            `<a href="${whatsappURL}" target="_blank" ` +
            `rel="noopener noreferrer" style="color:#ff777d;">` +
            `Click here to open WhatsApp</a>.`;
        return;
    }

    formFeedback.textContent =
        "WhatsApp opened with your request. Press Send in WhatsApp, then wait for Luda Services to confirm.";
});
