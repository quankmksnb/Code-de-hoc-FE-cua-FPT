document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const dropZoneContent = document.querySelector('.drop-zone-content');
    const progressContainer = document.getElementById('progress-container');
    const successState = document.getElementById('success-state');
    const progressFill = document.getElementById('progress-fill');
    const statusText = document.getElementById('status-text');
    const payButton = document.getElementById('pay-button');
    const steps = document.querySelectorAll('.step');

    // Handle Drop Zone Click
    dropZone.addEventListener('click', () => {
        if (progressContainer.classList.contains('hidden') && successState.classList.contains('hidden')) {
            fileInput.click();
        }
    });

    // Handle File Selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Drag and Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    function handleFileUpload(file) {
        // Switch to progress state
        dropZoneContent.classList.add('hidden');
        progressContainer.classList.remove('hidden');
        
        simulateTransformation();
    }

    function simulateTransformation() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;

            // Update status text and active steps
            if (progress < 30) {
                statusText.innerText = 'Scanning document for insights...';
                updateSteps(0);
            } else if (progress < 70) {
                statusText.innerText = 'Applying AI-powered transformations...';
                updateSteps(1);
            } else if (progress < 100) {
                statusText.innerText = 'Polishing and finalizing export...';
                updateSteps(2);
            } else {
                statusText.innerText = 'Transformation complete!';
                clearInterval(interval);
                setTimeout(showSuccess, 500);
            }
        }, 400);
    }

    function updateSteps(activeIndex) {
        steps.forEach((step, index) => {
            if (index <= activeIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function showSuccess() {
        progressContainer.classList.add('hidden');
        successState.classList.remove('hidden');
    }

    // Payment Button Simulation
    payButton.addEventListener('click', () => {
        const originalText = payButton.innerText;
        payButton.innerText = 'Processing...';
        payButton.disabled = true;
        
        setTimeout(() => {
            alert('Redirecting to secure payment gateway for $4.99 USD...');
            payButton.innerText = originalText;
            payButton.disabled = false;
        }, 1000);
    });
});
