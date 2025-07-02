document.addEventListener("DOMContentLoaded", () => {
  // === Page Fade-In Animation ===
  const content = document.querySelector(".animated-content");
  if (content) {
    content.classList.add("fade-in"); // ✅ use add() instead of toggle() for clarity
  }

  // === Bootstrap Form Validation ===
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
});
