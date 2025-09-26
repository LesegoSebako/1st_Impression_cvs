// File upload functionality
document.addEventListener("DOMContentLoaded", function () {
  const fileUploadArea = document.getElementById("fileUploadArea");
  const fileInput = document.getElementById("fileInput");
  const browseButton = document.getElementById("browseButton");
  const fileList = document.getElementById("fileList");

  if (!fileUploadArea || !fileInput) return;

  // Browse button functionality
  if (browseButton) {
    browseButton.addEventListener("click", () => {
      fileInput.click();
    });
  }

  // File input change handler
  fileInput.addEventListener("change", handleFileSelect);

  // Drag and drop functionality
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    fileUploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    fileUploadArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    fileUploadArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    fileUploadArea.classList.add("dragover");
  }

  function unhighlight() {
    fileUploadArea.classList.remove("dragover");
  }

  fileUploadArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
  }

  function handleFiles(files) {
    if (files.length > 0 && fileList) {
      fileList.innerHTML =
        '<p class="text-sm font-semibold">Selected files:</p>';
      fileList.classList.remove("hidden");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement("div");
        fileItem.className =
          "flex items-center justify-between bg-gray-100 p-2 rounded";
        fileItem.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-file text-gray-500 mr-2"></i>
                        <span class="text-sm">${file.name}</span>
                    </div>
                    <button type="button" class="text-red-500 hover:text-red-700" data-index="${i}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
        fileList.appendChild(fileItem);
      }

      // Add event listeners to remove buttons
      fileList.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", function () {
          const index = this.getAttribute("data-index");
          this.parentElement.remove();
          if (fileList.children.length === 1) {
            fileList.classList.add("hidden");
          }
        });
      });
    }
  }

  // Contact form handling
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simple form validation
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const message = this.querySelector("textarea").value;

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Show success message
      if (successMessage) {
        successMessage.style.display = "block";
      }

      // Reset form
      this.reset();
      if (fileList) {
        fileList.classList.add("hidden");
        fileList.innerHTML = "";
      }

      // Hide success message after 5 seconds
      setTimeout(() => {
        if (successMessage) {
          successMessage.style.display = "none";
        }
      }, 5000);
    });
  }
});
