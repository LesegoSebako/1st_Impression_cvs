// Main initialization and core functionality
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

  // Add animation delays for contact methods
  const contactMethods = document.querySelectorAll(".contact-method");
  contactMethods.forEach((method, index) => {
    method.style.animationDelay = `${index * 0.1}s`;
  });
});

// Main initialization and core functionality
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

  // Add animation delays for contact methods
  const contactMethods = document.querySelectorAll(".contact-method");
  if (contactMethods.length > 0) {
    contactMethods.forEach((method, index) => {
      method.style.animationDelay = `${index * 0.1}s`;
    });
  }
});