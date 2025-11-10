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
        }

        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    }

    function setupCharacterCounter() {
        if (messageTextarea && messageCounter) {
            messageTextarea.addEventListener('input', function() {
                const length = this.value.length;
                messageCounter.textContent = `${length}/1000 characters`;
                
                if (length < 10) {
                    showError('messageError', 'Message must be at least 10 characters');
                } else {
                    clearError('messageError');
                }
            });
        }
    }

    // Validation functions
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.id;

        switch(fieldName) {
            case 'name':
                if (value.length < 2) {
                    showError('nameError', 'Please enter your name (minimum 2 characters)');
                    return false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError('emailError', 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'phone':
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(value)) {
                    showError('phoneError', 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    showError('messageError', 'Message must be at least 10 characters');
                    return false;
                }
                break;
        }
        
        clearError(fieldName + 'Error');
        return true;
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const event = new Event('blur');
            field.dispatchEvent(event);
            if (field.classList.contains('error')) {
                isValid = false;
            }
        });

        return isValid;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Submit form via FormSubmit
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showSuccessMessage();
                contactForm.reset();
                resetFileList();
                // Track conversion in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        'event_category': 'Contact Form',
                        'event_label': 'Form Submission'
                    });
                }
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error submitting your form. Please try again or contact us directly.');
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
            const inputField = errorElement.previousElementSibling;
            if (inputField) {
                inputField.classList.add('border-red-500');
                inputField.classList.remove('border-gray-300');
            }
        }
    }

    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.classList.add('hidden');
            const inputField = errorElement.previousElementSibling;
            if (inputField) {
                inputField.classList.remove('border-red-500');
                inputField.classList.add('border-gray-300');
            }
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