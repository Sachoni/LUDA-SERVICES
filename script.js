/* ============================================
   LUDA SERVICES — JAVASCRIPT
   Navigation, service selection and WhatsApp
   Booking requests
   ============================================ */

// ============================================
// WHATSAPP CONFIGURATION
// ============================================

// TEMPORARY TEST NUMBER.
// Replace 2547XXXXXXXX with your own WhatsApp
// number in Kenyan international format.
//
// Example format: 254712345678
// Do not include the + sign or leading 0.

const WHATSAPP_NUMBER = "254799977734";


// ============================================
// GET HTML ELEMENTS
// ============================================

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const bookingForm = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("serviceSelect");
const bookingDate = document.getElementById("bookingDate");
const formFeedback = document.getElementById("formFeedback");
const contactWhatsApp = document.getElementById("contactWhatsApp");


// ============================================
// AUTOMATIC COPYRIGHT YEAR
// ============================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ============================================
// PREVENT PAST BOOKING DATES
// ============================================

const now = new Date();

const today = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

// Customers cannot select a date before today.
bookingDate.min = today;


// ============================================
// MOBILE NAVIGATION
// ============================================

// Open and close the mobile navigation menu.
menuToggle.addEventListener("click", function () {

    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
});


// Close the mobile menu after clicking a navigation link.
navigation.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

        navigation.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    });
});


// ============================================
// SERVICE SELECTION
// ============================================

// When a customer clicks Book on a service card,
// automatically select that service in the booking form.

document.querySelectorAll(".choose-service").forEach(function (button) {

    button.addEventListener("click", function () {

        serviceSelect.value = button.dataset.service;

        // Scroll smoothly to the booking form.
        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// ============================================
// WHATSAPP CONTACT BUTTON
// ============================================

// Use the configured WhatsApp number for the
// Contact Us button.

contactWhatsApp.href =
    `https://wa.me/${WHATSAPP_NUMBER}`;

contactWhatsApp.target = "_blank";

contactWhatsApp.rel =
    "noopener noreferrer";


// ============================================
// BOOKING FORM — WHATSAPP INTEGRATION
// ============================================

bookingForm.addEventListener("submit", function (event) {

    // Stop the browser from refreshing the page.
    event.preventDefault();

    // Clear previous feedback.
    formFeedback.textContent = "";

    // Validate all required form fields.
    if (!bookingForm.reportValidity()) {
        return;
    }

    // ========================================
    // READ CUSTOMER BOOKING DETAILS
    // ========================================

    const name = document
        .getElementById("customerName")
        .value
        .trim();

    const phone = document
        .getElementById("customerPhone")
        .value
        .trim();

    const service = serviceSelect.value;

    const date = bookingDate.value;

    const time = document
        .getElementById("bookingTime")
        .value;

    const notes = document
        .getElementById("notes")
        .value
        .trim();


    // ========================================
    // PREPARE THE WHATSAPP MESSAGE
    // ========================================

    const message = [

        "HELLO LUDA SERVICES!",
        "",
        "I would like to request an appointment.",
        "",
        "BOOKING DETAILS",
        "------------------------------",
        `Customer name: ${name}`,
        `Customer phone: ${phone}`,
        `Service: ${service}`,
        `Preferred date: ${date}`,
        `Preferred time: ${time}`,

        // Include additional notes only when provided.
        notes
            ? `Additional details: ${notes}`
            : "",

        "------------------------------",
        "",
        "Please confirm whether this appointment is available."

    ].filter(Boolean).join("\n");


    // ========================================
    // CREATE THE WHATSAPP BOOKING URL
    // ========================================

    // Encode the message so spaces, punctuation,
    // and newlines work correctly in WhatsApp.

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    // ========================================
    // OPEN WHATSAPP
    // ========================================

    // Display a temporary message while opening WhatsApp.
    formFeedback.textContent =
        "Opening WhatsApp with your booking request...";

    // Attempt to open WhatsApp in a new tab.
    const newTab = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );


    // ========================================
    // POPUP BLOCKER FALLBACK
    // ========================================

    // If the browser blocks the new tab, show a
    // clickable link as an alternative.

    if (!newTab) {

        formFeedback.replaceChildren();

        formFeedback.append(
            document.createTextNode(
                "Your booking is ready. "
            )
        );

        const fallbackLink =
            document.createElement("a");

        fallbackLink.href = whatsappURL;

        fallbackLink.target = "_blank";

        fallbackLink.rel =
            "noopener noreferrer";

        fallbackLink.textContent =
            "Click here to open WhatsApp";

        fallbackLink.style.color = "#ff777d";

        formFeedback.appendChild(fallbackLink);

        formFeedback.append(
            document.createTextNode(
                ". Press Send in WhatsApp to submit your request."
            )
        );

        return;
    }


    // ========================================
    // SUCCESS INSTRUCTIONS
    // ========================================

    // Opening WhatsApp does not mean the message
    // has already been sent. The customer must
    // press Send inside WhatsApp.

    formFeedback.textContent =
        "WhatsApp has been opened with your booking request. " +
        "Press Send in WhatsApp, then wait for Luda Services to confirm.";

});