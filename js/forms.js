// Form validation and functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const fileInput = document.getElementById('fileInput');
    const browseButton = document.getElementById('browseButton');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileList = document.getElementById('fileList');
    const messageTextarea = document.getElementById('message');
    const messageCounter = document.getElementById('messageCounter');
    const submitButton = document.getElementById('submitButton');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const successMessage = document.getElementById('successMessage');

    // Initialize form
    initForm();

    function initForm() {
        setupEventListeners();
        setupCharacterCounter();
    }

    function setupEventListeners() {
        // File upload functionality
        if (browseButton && fileInput) {
            browseButton.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', handleFileSelect);
            
            // Drag and drop
            fileUploadArea.addEventListener('dragover', handleDragOver);
            fileUploadArea.addEventListener('dragleave', handleDragLeave);
            fileUploadArea.addEventListener('drop', handleFileDrop);
            
            // Keyboard accessibility for file upload area
            fileUploadArea.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInput.click();
                }
            });
        }

        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Real-time validation on blur
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', function() {
                clearError(this.id + 'Error');
                this.classList.remove('input-error', 'border-red-500');
            });
        });
    }

    function setupCharacterCounter() {
        if (messageTextarea && messageCounter) {
            messageTextarea.addEventListener('input', function() {
                const length = this.value.length;
                messageCounter.textContent = `${length}/1000 characters`;
                
                if (length > 0 && length < 10) {
                    showError('messageError', 'Message must be at least 10 characters');
                    this.classList.add('input-error', 'border-red-500');
                } else if (length >= 10) {
                    clearError('messageError');
                    this.classList.remove('input-error', 'border-red-500');
                    this.classList.add('input-success', 'border-green-500');
                } else {
                    clearError('messageError');
                    this.classList.remove('input-error', 'border-red-500', 'input-success', 'border-green-500');
                }
            });
        }
    }

    // Validation functions
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.id;

        // Clear previous styling
        field.classList.remove('input-error', 'border-red-500', 'input-success', 'border-green-500');

        switch(fieldName) {
            case 'name':
                if (value.length < 2) {
                    showError('nameError', 'Please enter your name (minimum 2 characters)');
                    field.classList.add('input-error', 'border-red-500');
                    return false;
                } else {
                    clearError('nameError');
                    field.classList.add('input-success', 'border-green-500');
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError('emailError', 'Please enter a valid email address');
                    field.classList.add('input-error', 'border-red-500');
                    return false;
                } else {
                    clearError('emailError');
                    field.classList.add('input-success', 'border-green-500');
                }
                break;
                
            case 'phone':
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(value)) {
                    showError('phoneError', 'Please enter a valid phone number');
                    field.classList.add('input-error', 'border-red-500');
                    return false;
                } else if (value) {
                    clearError('phoneError');
                    field.classList.add('input-success', 'border-green-500');
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    showError('messageError', 'Message must be at least 10 characters');
                    field.classList.add('input-error', 'border-red-500');
                    return false;
                } else {
                    clearError('messageError');
                    field.classList.add('input-success', 'border-green-500');
                }
                break;
        }
        
        return true;
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            // Create and dispatch blur event to trigger validation
            if (!field.value.trim()) {
                showError(field.id + 'Error', `Please fill in ${field.previousElementSibling.textContent.toLowerCase()}`);
                field.classList.add('input-error', 'border-red-500');
                isValid = false;
            } else {
                const event = new Event('blur');
                field.dispatchEvent(event);
                if (field.classList.contains('input-error')) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        console.log('Form submission attempted');
        
        if (!validateForm()) {
            console.log('Form validation failed');
            // Scroll to first error
            const firstError = contactForm.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        console.log('Form validation passed, submitting...');

        // Show loading state
        setLoadingState(true);

        // Submit form via FormSubmit
        const formData = new FormData(contactForm);
        
        // Log form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Form submission response:', response);
            if (response.ok) {
                showSuccessMessage();
                contactForm.reset();
                resetFileList();
                resetFormStyles();
                // Track conversion in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        'event_category': 'Contact Form',
                        'event_label': 'Form Submission'
                    });
                }
            } else {
                throw new Error('Form submission failed with status: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            // Fallback: allow natural form submission
            console.log('Attempting natural form submission as fallback...');
            contactForm.submit();
        })
        .finally(() => {
            setLoadingState(false);
        });
    }

    // File handling functions
    function handleFileSelect(e) {
        updateFileList();
    }

    function handleDragOver(e) {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    }

    function handleFileDrop(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        fileInput.files = e.dataTransfer.files;
        updateFileList();
    }

    function updateFileList() {
        if (fileInput.files.length > 0) {
            fileList.classList.remove('hidden');
            fileList.innerHTML = '<p class="text-sm font-semibold">Selected files:</p>';
            
            let hasLargeFile = false;
            
            Array.from(fileInput.files).forEach(file => {
                // Check file size (10MB max)
                if (file.size > 10 * 1024 * 1024) {
                    hasLargeFile = true;
                    showError('fileError', `${file.name} is too large (max 10MB)`);
                }
                
                const fileElement = document.createElement('div');
                fileElement.className = 'flex justify-between items-center text-sm bg-gray-50 p-2 rounded';
                fileElement.innerHTML = `
                    <span class="truncate flex-1">${file.name}</span>
                    <span class="text-gray-500 ml-2">${formatFileSize(file.size)}</span>
                    <button type="button" class="text-red-500 ml-2 hover:text-red-700" onclick="removeFile('${file.name}')">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                fileList.appendChild(fileElement);
            });
            
            if (!hasLargeFile) {
                clearError('fileError');
            }
        } else {
            fileList.classList.add('hidden');
            clearError('fileError');
        }
    }

    function removeFile(fileName) {
        const dt = new DataTransfer();
        const files = fileInput.files;
        
        for (let i = 0; i < files.length; i++) {
            if (files[i].name !== fileName) {
                dt.items.add(files[i]);
            }
        }
        
        fileInput.files = dt.files;
        updateFileList();
    }

    function resetFileList() {
        fileInput.value = '';
        fileList.classList.add('hidden');
        fileList.innerHTML = '';
        clearError('fileError');
    }

    function resetFormStyles() {
        // Remove all success/error styles
        const fields = contactForm.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('input-error', 'border-red-500', 'input-success', 'border-green-500');
        });
        
        // Reset character counter
        if (messageCounter) {
            messageCounter.textContent = '0/1000 characters';
        }
    }

    // Utility functions
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    function showSuccessMessage() {
        successMessage.classList.remove('hidden');
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }

    function setLoadingState(loading) {
        if (loading) {
            submitButton.disabled = true;
            submitText.classList.add('hidden');
            submitSpinner.classList.remove('hidden');
        } else {
            submitButton.disabled = false;
            submitText.classList.remove('hidden');
            submitSpinner.classList.add('hidden');
        }
    }

    // Make removeFile function globally available
    window.removeFile = removeFile;
});
