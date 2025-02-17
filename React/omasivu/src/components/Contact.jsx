// Contact module
import React from 'react';
import { useEffect } from 'react';
import Button from './Button'

const Contact = () => {

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const formFeedback = document.getElementById("formfeedback");

    if (nameField.value && emailField.value && emailField.checkValidity() && messageField.value) {
      formFeedback.textContent = "Form submitted successfully!";
      formFeedback.style.color = "green";
      nameField.value = "";
      emailField.value = "";
      messageField.value = "";
    } 
    else {
      formFeedback.textContent = "Please fill out all required fields correctly.";
      formFeedback.style.color = "red";
    }
  };

  // Handle form clearing
  const handleClearFields = (event) => {
    event.preventDefault();
    const formFeedback = document.getElementById("formfeedback");
    formFeedback.textContent = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
  };

  useEffect(() => {
    const form = document.querySelector("form[name='Contact']");
    form.addEventListener("submit", handleSubmit);
    form.addEventListener("reset", handleClearFields);

    return () => {
      form.removeEventListener("submit", handleSubmit);
      form.removeEventListener("reset", handleClearFields);
    };
  }, []);


  return (
    <section id="contact" className="section">
      <h2>Contact</h2>
      <form name="Contact" method="POST" target="_blank" noValidate>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="f_name" placeholder="First and last name" required />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="s-posti" placeholder="e.g. john@doe.com" required />
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" rows="4" placeholder="Write your message here, please."></textarea>
        <div className="send">
          <Button id="submit-button" onClick={handleSubmit} text="Submit" />
          <Button id="clear-button" onClick={handleClearFields} text="Clear" />
        </div>
      </form>
      <p id="formfeedback"></p>
    </section>
  );
};

export default Contact;