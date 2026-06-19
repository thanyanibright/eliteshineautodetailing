/* ============================================================
   forms.js
   Elite Shine Auto Detailing — Part 3
   Client-side validation + "processing" for the Enquiry,
   Feedback and Contact forms. No server/back-end is used —
   everything here runs in the visitor's own browser, which is
   normal and expected for a static (no-database) website.
   ============================================================ */

/* ---------------------------------------------------------- */
/* Small, reusable validation helpers                          */
/* ---------------------------------------------------------- */

// Matches South African style numbers, e.g. 079 732 5580 / 0797325580 / 079-732-5580
var SA_PHONE_PATTERN = /^0\d{2}[\s-]?\d{3}[\s-]?\d{4}$/;
// Simple, "good enough for the client side" email pattern
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmpty(value) {
  return !value || value.trim() === "";
}

function isValidPhone(value) {
  return SA_PHONE_PATTERN.test(value.trim());
}

function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * SECURITY: escapes HTML special characters before any visitor-typed
 * text is inserted back into the page with innerHTML. Without this, a
 * visitor could type something like <img src=x onerror=alert(1)> into
 * a field (e.g. "Full Name") and have it execute as real HTML/JS — a
 * basic form of DOM-based XSS. textContent is naturally safe, but
 * innerHTML is not, so anything going into innerHTML is escaped first.
 */
function escapeHTML(value) {
  var div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

/**
 * Shows / clears a small red error message under a given form field.
 * Expects every field to have a sibling <small class="error-msg"></small>
 * placed right after it in the HTML.
 */
function setFieldError(field, message) {
  var errorEl = field.parentElement.querySelector(".error-msg");
  if (!errorEl) {
    errorEl = document.createElement("small");
    errorEl.className = "error-msg";
    field.insertAdjacentElement("afterend", errorEl);
  }
  errorEl.textContent = message || "";
  field.classList.toggle("input-invalid", !!message);
}

/* ---------------------------------------------------------- */
/* PRICE LOOKUP — mirrors the table on service.html            */
/* ---------------------------------------------------------- */
var SERVICE_PRICES = {
  basic_wash:          { normal_car: 150, suv: 200, bus_truck: 500 },
  full_valet:          { normal_car: 450, suv: 600, bus_truck: 1500 },
  interior_detailing:  { normal_car: 350, suv: 500, bus_truck: 1200 },
  exterior_polishing:  { normal_car: 400, suv: 550, bus_truck: 1400 }
};

var SERVICE_NAMES = {
  basic_wash: "Basic Wash",
  full_valet: "Full Valet",
  interior_detailing: "Interior Detailing",
  exterior_polishing: "Exterior Polishing",
  unsure: "a service to be confirmed"
};

var VEHICLE_NAMES = {
  normal_car: "Normal Car",
  suv: "SUV / Bakkie / Minivan",
  bus_truck: "Bus / Truck / Large Commercial Vehicle"
};

document.addEventListener("DOMContentLoaded", function () {
  initEnquiryForm();
  initFeedbackForm();
  initContactForm();
});

/* ---------------------------------------------------------- */
/* ENQUIRY / BOOKING FORM                                      */
/* ---------------------------------------------------------- */
function initEnquiryForm() {
  var form = document.getElementById("enquiry-form");
  var responseBox = document.getElementById("enquiry-response");
  if (!form) return;

  // Stop the date picker itself from offering past dates
  var dateField = form.querySelector("#date");
  if (dateField) {
    dateField.min = new Date().toISOString().split("T")[0];
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // we are handling this ourselves, no page reload

    var fullname = form.querySelector("#fullname");
    var phone = form.querySelector("#phone");
    var location = form.querySelector("#location");
    var vehicleType = form.querySelector("#vehicle_type");
    var service = form.querySelector("#service");
    var date = form.querySelector("#date");

    var isValid = true;

    if (isEmpty(fullname.value)) {
      setFieldError(fullname, "Please tell us your full name.");
      isValid = false;
    } else {
      setFieldError(fullname, "");
    }

    if (!isValidPhone(phone.value)) {
      setFieldError(phone, "Please enter a valid SA phone number, e.g. 079 732 5580.");
      isValid = false;
    } else {
      setFieldError(phone, "");
    }

    if (isEmpty(location.value)) {
      setFieldError(location, "Please tell us where we should come to.");
      isValid = false;
    } else {
      setFieldError(location, "");
    }

    if (isEmpty(vehicleType.value)) {
      setFieldError(vehicleType, "Please select a vehicle type.");
      isValid = false;
    } else {
      setFieldError(vehicleType, "");
    }

    if (isEmpty(service.value)) {
      setFieldError(service, "Please select a service.");
      isValid = false;
    } else {
      setFieldError(service, "");
    }

    if (isEmpty(date.value)) {
      setFieldError(date, "Please choose a preferred date.");
      isValid = false;
    } else {
      // Don't allow a date that has already passed
      var chosenDate = new Date(date.value);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosenDate < today) {
        setFieldError(date, "Please choose today or a future date.");
        isValid = false;
      } else {
        setFieldError(date, "");
      }
    }

    if (!isValid) {
      showResponse(responseBox, "error",
        "Please fix the highlighted fields above and submit again.");
      return;
    }

    /* ---- "Processing" the booking once everything is valid ---- */
    var priceMessage;
    if (service.value === "unsure" || !SERVICE_PRICES[service.value]) {
      priceMessage = "We'll call you to recommend the best service and confirm a price.";
    } else {
      var price = SERVICE_PRICES[service.value][vehicleType.value];
      priceMessage = "Estimated price for " + SERVICE_NAMES[service.value] +
        " on a " + VEHICLE_NAMES[vehicleType.value] + ": <strong>R" + price + "</strong>.";
    }

    var prettyDate = new Date(date.value).toLocaleDateString("en-ZA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    showResponse(responseBox, "success",
      "Thanks, " + escapeHTML(fullname.value.split(" ")[0]) + "! Your request for " + prettyDate +
      " has been received. " + priceMessage +
      " We will call or WhatsApp you on " + escapeHTML(phone.value) + " within 2 hours to confirm availability.");

    form.reset();
  });
}

/* ---------------------------------------------------------- */
/* FEEDBACK FORM (also on enquiry.html)                        */
/* ---------------------------------------------------------- */
function initFeedbackForm() {
  var forms = document.querySelectorAll("form");
  var feedbackForm = null;
  forms.forEach(function (f) {
    if (f.querySelector("#fb_message")) feedbackForm = f;
  });
  if (!feedbackForm) return;

  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var message = feedbackForm.querySelector("#fb_message");

    if (isEmpty(message.value) || message.value.trim().length < 5) {
      setFieldError(message, "Please write at least a short sentence of feedback.");
      return;
    }
    setFieldError(message, "");

    var thanksMsg = document.createElement("p");
    thanksMsg.className = "response-box response-success";
    thanksMsg.textContent = "Thank you for your feedback — we really appreciate it!";
    feedbackForm.insertAdjacentElement("afterend", thanksMsg);
    feedbackForm.reset();
  });
}

/* ---------------------------------------------------------- */
/* CONTACT FORM                                                */
/* ---------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById("contact-form");
  var responseBox = document.getElementById("contact-response");
  if (!form) return;

  // The address that mail will be "sent" to — change this if needed
  var RECIPIENT_EMAIL = "eliteshineauto@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.querySelector("#name");
    var phone = form.querySelector("#phone");
    var email = form.querySelector("#email");
    var subject = form.querySelector("#subject");
    var message = form.querySelector("#message");

    var isValid = true;

    if (isEmpty(name.value)) {
      setFieldError(name, "Please enter your name.");
      isValid = false;
    } else {
      setFieldError(name, "");
    }

    if (!isValidPhone(phone.value)) {
      setFieldError(phone, "Please enter a valid SA phone number, e.g. 082 345 6789.");
      isValid = false;
    } else {
      setFieldError(phone, "");
    }

    if (!isEmpty(email.value) && !isValidEmail(email.value)) {
      setFieldError(email, "That doesn't look like a valid email address.");
      isValid = false;
    } else {
      setFieldError(email, "");
    }

    if (isEmpty(message.value) || message.value.trim().length < 10) {
      setFieldError(message, "Please write a message of at least 10 characters.");
      isValid = false;
    } else {
      setFieldError(message, "");
    }

    if (!isValid) {
      showResponse(responseBox, "error",
        "Please fix the highlighted fields above and try again.");
      return;
    }

    /* ---- Compile the message into an email the visitor can send ---- */
    var emailSubject = !isEmpty(subject.value) ? subject.value : "Website enquiry from " + name.value;
    var emailBody =
      "Name: " + name.value + "\n" +
      "Phone: " + phone.value + "\n" +
      "Email: " + (email.value || "Not provided") + "\n\n" +
      "Message:\n" + message.value;

    var mailtoLink = "mailto:" + RECIPIENT_EMAIL +
      "?subject=" + encodeURIComponent(emailSubject) +
      "&body=" + encodeURIComponent(emailBody);

    responseBox.innerHTML =
      '<p class="response-box response-success">Thanks, ' + escapeHTML(name.value.split(" ")[0]) +
      '! Your message has been compiled and is ready to send.</p>' +
      '<a class="send-email-btn" href="' + mailtoLink + '">Open Email &amp; Send Message</a>';
    responseBox.style.display = "block";

    form.reset();
  });
}

/* ---------------------------------------------------------- */
/* Shared response-box helper                                  */
/* ---------------------------------------------------------- */
function showResponse(box, type, html) {
  if (!box) return;
  box.innerHTML = html;
  box.className = "response-box " + (type === "success" ? "response-success" : "response-error");
  box.style.display = "block";
}