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

  // Mobile menu functionality
  const mobileMenuButton = document.querySelector(
    'button[aria-label="Toggle mobile menu"]'
  );

  if (mobileMenuButton) {
    // Create mobile menu structure with warp card theme
    const mobileMenu = document.createElement("div");
    mobileMenu.innerHTML = `
      <div class="lg:hidden warp-card bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 w-full mt-2 z-50">
        <ul class="space-y-4 text-white font-medium">
          <li><a href="#home" class="block hover:text-indigo-300 transition-colors py-3 px-4 rounded-lg hover:bg-white/5">Home</a></li>
          <li><a href="#services" class="block hover:text-indigo-300 transition-colors py-3 px-4 rounded-lg hover:bg-white/5">Services</a></li>
          <li><a href="#about" class="block hover:text-indigo-300 transition-colors py-3 px-4 rounded-lg hover:bg-white/5">About</a></li>
          <li><a href="#benefits" class="block hover:text-indigo-300 transition-colors py-3 px-4 rounded-lg hover:bg-white/5">Benefits</a></li>
          <li><a href="#contact" class="block hover:text-indigo-300 transition-colors py-3 px-4 rounded-lg hover:bg-white/5">Contact</a></li>
        </ul>
        <div class="mt-4 pt-4 border-t border-white/20">
          <a href="#contact" class="block bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-center font-semibold">
            Get Started
          </a>
        </div>
      </div>
    `;

    // Add mobile menu to navigation
    mobileMenu.classList.add("mobile-menu", "hidden");
    document.querySelector("nav .rounded-xl").appendChild(mobileMenu);

    // Toggle mobile menu
    mobileMenuButton.addEventListener("click", function (e) {
      e.stopPropagation();
      const menu = document.querySelector(".mobile-menu");
      menu.classList.toggle("hidden");

      // Toggle icon between bars and times
      const icon = this.querySelector("i");
      if (menu.classList.contains("hidden")) {
        icon.className = "fas fa-bars text-xl";
      } else {
        icon.className = "fas fa-times text-xl";
      }
    });

    // Close mobile menu when clicking on a link
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.querySelector("i").className = "fas fa-bars text-xl";
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !event.target.closest("nav") &&
        !mobileMenu.classList.contains("hidden")
      ) {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.querySelector("i").className = "fas fa-bars text-xl";
      }
    });
  }
});
