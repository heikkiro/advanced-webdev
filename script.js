// JavaScript code created with the help of AI (ChatGPT)

document.addEventListener("DOMContentLoaded", () => {
    // Get references to the form elements
    const form = document.querySelector("form[name='Contact']");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const formFeedback = document.getElementById("formfeedback");

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from actually submitting
        formFeedback.textContent = "Form submitted successfully!"; 
        formFeedback.style.color = "green"; 

        // Clear the form fields
        nameField.value = "";
        emailField.value = "";
        messageField.value = "";
    });

    // Handle form clearing
    form.addEventListener("reset", () => {
        formFeedback.textContent = "";
    });
});
