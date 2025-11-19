// Contact Form Handling with Comprehensive Validation
document.addEventListener("DOMContentLoaded", function () {
  initializeContactForm();
});

function initializeContactForm() {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");
  const fileInput = document.getElementById("fileInput");
  const fileUploadArea = document.getElementById("fileUploadArea");
  const browseButton = document.getElementById("browseButton");
  const fileList = document.getElementById("fileList");
  const messageTextarea = document.getElementById("message");
  const messageCounter = document.getElementById("messageCounter");

  // Initialize character counter
  if (messageTextarea && messageCounter) {
    initializeCharacterCounter(messageTextarea, messageCounter);
  }

  // Initialize file upload functionality
  if (fileInput && browseButton && fileUploadArea) {
    initializeFileUpload(fileInput, browseButton, fileUploadArea, fileList);
  }

  // Initialize form validation and submission
  if (form && successMessage) {
    initializeFormValidation(form, successMessage, fileList);
  }
}

function initializeCharacterCounter(textarea, counter) {
  const updateCounter = () => {
    const length = textarea.value.length;
    counter.textContent = `${length}/1000 characters`;

    if (length > 1000) {
      counter.classList.add("text-red-600");
    } else {
      counter.classList.remove("text-red-600");
    }
  };

  textarea.addEventListener("input", updateCounter);
  updateCounter(); // Initialize on load
}

function initializeFileUpload(
  fileInput,
  browseButton,
  fileUploadArea,
  fileList
) {
  browseButton.addEventListener("click", () => fileInput.click());

  fileUploadArea.addEventListener("click", () => fileInput.click());

  fileUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileUploadArea.classList.add("border-indigo-500", "bg-indigo-50");
  });

  fileUploadArea.addEventListener("dragleave", () => {
    fileUploadArea.classList.remove("border-indigo-500", "bg-indigo-50");
  });

  fileUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove("border-indigo-500", "bg-indigo-50");
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      validateAndUpdateFileList(fileInput, fileList);
    }
  });

  fileInput.addEventListener("change", () =>
    validateAndUpdateFileList(fileInput, fileList)
  );
}

function validateAndUpdateFileList(fileInput, fileList) {
  const fileError = document.getElementById("fileError");
  let hasError = false;

  if (fileInput.files.length > 0) {
    fileList.classList.remove("hidden");
    fileList.innerHTML = '<p class="text-sm font-semibold">Selected file:</p>';

    Array.from(fileInput.files).forEach((file) => {
      // File type validation
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type) || file.size > maxSize) {
        hasError = true;
        fileError.classList.remove("hidden");
        fileError.textContent = `Invalid file: ${file.name}. Must be PDF, DOC, DOCX, JPG, PNG and under 10MB`;
        return;
      }

      const fileItem = document.createElement("div");
      fileItem.className =
        "flex items-center justify-between bg-gray-50 p-2 rounded";
      fileItem.innerHTML = `
                <span class="text-sm text-gray-700">${file.name} (${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB)</span>
                <button type="button" class="text-red-500 hover:text-red-700 remove-file">
                    <i class="fas fa-times"></i>
                </button>
            `;
      fileList.appendChild(fileItem);
    });

    if (!hasError) {
      fileError.classList.add("hidden");
    }

    // Add event listeners to remove buttons
    fileList.querySelectorAll(".remove-file").forEach((button) => {
      button.addEventListener("click", function () {
        removeFile(this, fileInput, fileList);
      });
    });
  } else {
    fileList.classList.add("hidden");
    fileError.classList.add("hidden");
  }
}

function removeFile(button, fileInput, fileList) {
  const dt = new DataTransfer();
  const fileItems = Array.from(
    fileList.querySelectorAll(".flex.items-center.justify-between")
  );
  const buttonIndex =
    Array.from(button.parentNode.parentNode.children).indexOf(
      button.parentNode
    ) - 1;

  Array.from(fileInput.files).forEach((file, index) => {
    if (index !== buttonIndex) {
      dt.items.add(file);
    }
  });

  fileInput.files = dt.files;

  if (fileInput.files.length === 0) {
    fileList.classList.add("hidden");
  } else {
    validateAndUpdateFileList(fileInput, fileList);
  }
}

function initializeFormValidation(form, successMessage, fileList) {
  const fields = form.querySelectorAll(".validation-field");

  // Real-time validation
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => clearFieldError(field));
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      submitForm(form, successMessage, fileList);
    }
  });
}

function validateForm() {
  const fields = document.querySelectorAll(".validation-field");
  let isValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const errorElement = document.getElementById(field.id + "Error");
  let isValid = true;
  let errorMessage = "";

  // Clear previous error state
  clearFieldError(field);

  // Required field validation
  if (field.hasAttribute("required") && !field.value.trim()) {
    isValid = false;
    errorMessage = "This field is required";
  }

  // Pattern validation
  if (isValid && field.hasAttribute("pattern") && field.value.trim()) {
    const pattern = new RegExp(field.getAttribute("pattern"));
    if (!pattern.test(field.value)) {
      isValid = false;
      errorMessage = field.getAttribute("title") || "Invalid format";
    }
  }

  // Length validation
  if (isValid && field.value.trim()) {
    if (
      field.hasAttribute("minlength") &&
      field.value.length < parseInt(field.getAttribute("minlength"))
    ) {
      isValid = false;
      errorMessage = `Minimum ${field.getAttribute(
        "minlength"
      )} characters required`;
    }
    if (
      field.hasAttribute("maxlength") &&
      field.value.length > parseInt(field.getAttribute("maxlength"))
    ) {
      isValid = false;
      errorMessage = `Maximum ${field.getAttribute(
        "maxlength"
      )} characters allowed`;
    }
  }

  // Email specific validation
  if (isValid && field.type === "email" && field.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }
  }

  if (!isValid && errorElement) {
    field.classList.add("border-red-500", "bg-red-50");
    errorElement.textContent = errorMessage;
    errorElement.classList.remove("hidden");
  }

  return isValid;
}

function clearFieldError(field) {
  const errorElement = document.getElementById(field.id + "Error");
  if (errorElement) {
    errorElement.classList.add("hidden");
  }
  field.classList.remove("border-red-500", "bg-red-50");
}

function submitForm(form, successMessage, fileList) {
  const submitButton = document.getElementById("submitButton");
  const submitText = document.getElementById("submitText");
  const submitSpinner = document.getElementById("submitSpinner");

  // Show loading state
  submitText.classList.add("hidden");
  submitSpinner.classList.remove("hidden");
  submitButton.disabled = true;

  // Add a timeout fallback in case redirect doesn't work
  setTimeout(() => {
    if (!document.location.href.includes("thank-you")) {
      showSuccessFallback(
        successMessage,
        form,
        fileList,
        submitButton,
        submitText,
        submitSpinner
      );
    }
  }, 2000); // Check after 2 seconds

  // Submit the form
  form.submit();
}

function showSuccessFallback(
  successMessage,
  form,
  fileList,
  submitButton,
  submitText,
  submitSpinner
) {
  successMessage.classList.remove("hidden");
  form.reset();

  if (fileList) {
    fileList.classList.add("hidden");
  }

  // Reset button state
  submitText.classList.remove("hidden");
  submitSpinner.classList.add("hidden");
  submitButton.disabled = false;

  // Reset character counter
  const messageCounter = document.getElementById("messageCounter");
  if (messageCounter) {
    messageCounter.textContent = "0/1000 characters";
    messageCounter.classList.remove("text-red-600");
  }

  // Redirect manually after 1 second
  setTimeout(() => {
    window.location.href = "/thank-you.html";
  }, 1000);
}
