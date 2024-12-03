document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeBudgetButtons();
    initializeCustomPartyType();
    initializeThemeSelection();
    initializeStepStatus();
    initializeStepNavigation();
    
    // Voeg event listener toe voor het formulier
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm();
        });
    }
});

let currentStep = 1;
const totalSteps = 5;

// Voeg een object toe om de status van elke stap bij te houden
let stepStatuses = {
    1: { visited: false, completed: false },
    2: { visited: false, completed: false },
    3: { visited: false, completed: false },
    4: { visited: false, completed: false },
    5: { visited: false, completed: false }
};

function initializeForm() {
    // Initialize date picker functionality
    const dateInput = document.getElementById('partyDate');
    const timeInput = document.getElementById('partyTime');
    const noDateCheckbox = document.getElementById('noDateYet');

    noDateCheckbox.addEventListener('change', function() {
        dateInput.disabled = this.checked;
        timeInput.disabled = this.checked;
        if (this.checked) {
            dateInput.value = '';
            timeInput.value = '';
        }
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

function initializeBudgetButtons() {
    // Budget preset buttons
    const budgetInput = document.getElementById('budget');
    const noBudgetCheckbox = document.getElementById('noBudgetLimit');
    const presetButtons = document.querySelectorAll('.budget-preset');

    // Handle preset button clicks
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.dataset.value;
            budgetInput.value = value;
            noBudgetCheckbox.checked = false;
            
            // Remove active class from all buttons
            presetButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Handle "Budget maakt niet uit" checkbox
    noBudgetCheckbox.addEventListener('change', function() {
        budgetInput.disabled = this.checked;
        if (this.checked) {
            budgetInput.value = '';
            presetButtons.forEach(btn => btn.classList.remove('active'));
        }
    });
}

function initializeCustomPartyType() {
    const partyTypeInputs = document.querySelectorAll('input[name="partyType"]');
    const customPartyType = document.getElementById('customPartyType');
    const customPartyInput = document.getElementById('customPartyInput');

    partyTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.id === 'other') {
                customPartyType.style.display = 'block';
                customPartyInput.focus();
                // Voeg validatie toe voor de volgende stap
                customPartyInput.required = true;
            } else {
                customPartyType.style.display = 'none';
                customPartyInput.required = false;
            }
        });
    });
}

function initializeThemeSelection() {
    const themeInputs = document.querySelectorAll('input[name="partyTheme"]');
    const moreThemesDropdown = document.getElementById('moreThemesDropdown');
    const additionalThemes = document.getElementById('additionalThemes');

    themeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.id === 'theme-other') {
                moreThemesDropdown.style.display = 'block';
                // Trigger reflow voor de animatie
                void moreThemesDropdown.offsetWidth;
                moreThemesDropdown.classList.add('show');
                additionalThemes.focus();
            } else {
                moreThemesDropdown.classList.remove('show');
                setTimeout(() => {
                    moreThemesDropdown.style.display = 'none';
                }, 300); // Wacht op de animatie
            }
        });
    });

    additionalThemes.addEventListener('change', function() {
        if (this.value) {
            document.getElementById('theme-other').checked = false;
        }
    });
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step
        if (validateStep(currentStep)) {
            // Hide current step
            document.getElementById(`step${currentStep}`).classList.remove('active');
            // Show next step
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            // Update progress
            updateProgress();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        // Show previous step
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        // Update progress
        updateProgress();
    }
}

function updateProgress() {
    // Update the active state of the progress steps
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateStep(step) {
    let isValid = false;

    switch(step) {
        case 1:
            isValid = validateStepOne();
            break;
        case 2:
            isValid = validateStepTwo();
            break;
        case 3:
            isValid = validateStepThree();
            break;
        case 4:
            isValid = validateStepFour();
            break;
        case 5:
            isValid = validateStepFive();
            break;
        default:
            isValid = true;
    }

    if (isValid) {
        markStepAsCompleted(step);
    }

    return isValid;
}

function submitForm() {
    // Verzamel alle form data
    const formData = {
        // Stap 1: Basis Info
        partyType: document.querySelector('input[name="partyType"]:checked')?.value || '',
        customPartyType: document.getElementById('customPartyInput')?.value || '',
        partyDescription: document.getElementById('partyDescription')?.value || '',
        partyDate: document.getElementById('partyDate')?.value || '',
        partyTime: document.getElementById('partyTime')?.value || '',
        noDateYet: document.getElementById('noDateYet')?.checked || false,
        
        // Thema
        partyTheme: document.querySelector('input[name="partyTheme"]:checked')?.value || '',
        additionalTheme: document.getElementById('additionalThemes')?.value || '',
        
        // Stap 2: Gasten
        guestCount: document.querySelector('input[name="guestCount"]:checked')?.value || '',
        
        // Stap 3: Budget
        budget: document.getElementById('budget')?.value || '',
        noBudgetLimit: document.getElementById('noBudgetLimit')?.checked || false,
        
        // Stap 4: Locatie
        location: document.querySelector('input[name="location"]:checked')?.value || '',
        customLocation: document.querySelector('input[name="customLocation"]')?.value || '',
        
        // Stap 5: Muziek
        genres: Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(cb => cb.value),
        spotifyConnected: document.querySelector('.spotify-connect-btn')?.classList.contains('connected') || false,
        
        // Extra informatie
        skippedSteps: Object.keys(stepStatuses).filter(step => stepStatuses[step].visited && !stepStatuses[step].completed),
        completedSteps: Object.keys(stepStatuses).filter(step => stepStatuses[step].completed),
        
        // Metadata
        createdAt: new Date().toISOString(),
        userId: localStorage.getItem('currentUser')
    };

    // Debug logging
    console.log('Form Data:', formData);

    // Sla de data op in localStorage
    try {
        localStorage.setItem('partyPreferences', JSON.stringify(formData));
        window.location.href = 'summary.html';
    } catch (error) {
        console.error('Error saving form data:', error);
        alert('Er ging iets mis bij het opslaan van je voorkeuren. Probeer het opnieuw.');
    }
}

function initializeStepStatus() {
    updateStepStatuses();
    initializeSkipButtons();
}

function updateStepStatuses() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        const status = stepStatuses[stepNumber];

        if (status.completed) {
            step.setAttribute('data-status', 'completed');
        } else if (stepNumber === currentStep) {
            step.setAttribute('data-status', 'current');
            status.visited = true;
        } else if (status.visited && !status.completed) {
            step.setAttribute('data-status', 'skipped');
        } else {
            step.setAttribute('data-status', 'pending');
        }
    });
}

function initializeSkipButtons() {
    const skipButtons = document.querySelectorAll('.skip-btn');
    skipButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const stepNumber = parseInt(btn.getAttribute('data-step'));
            showPreview(stepNumber);
        });
    });
}

function showPreview(stepNumber) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="material-icons">info</i>
        <span>Je kunt stap ${stepNumber} later nog aanvullen</span>
    `;
    document.body.appendChild(toast);

    // Update status en ga naar volgende stap
    stepStatuses[stepNumber].visited = true;
    currentStep = stepNumber + 1;
    updateStepVisibility();
    updateStepStatuses();

    // Verwijder toast na 3 seconden
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateStepVisibility() {
    document.querySelectorAll('.form-step').forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function markStepAsCompleted(stepNumber) {
    stepStatuses[stepNumber].completed = true;
    updateStepStatuses();
}

// Voorbeeld validatie functies voor elke stap
function validateStepOne() {
    const partyType = document.querySelector('input[name="partyType"]:checked');
    const description = document.getElementById('partyDescription').value;
    
    if (!partyType) {
        alert('Selecteer een type feest');
        return false;
    }
    
    if (description.trim().length < 10) {
        alert('Geef een beschrijving van minimaal 10 karakters');
        return false;
    }
    
    return true;
}

// Voeg vergelijkbare validatie functies toe voor de andere stappen
function validateStepTwo() {
    // Validatie voor gasten stap
    return true; // Vervang dit met echte validatie
}

function validateStepThree() {
    // Validatie voor budget stap
    return true; // Vervang dit met echte validatie
}

function validateStepFour() {
    // Validatie voor locatie stap
    return true; // Vervang dit met echte validatie
}

function validateStepFive() {
    // Validatie voor muziek stap
    return true; // Vervang dit met echte validatie
}

function initializeStepNavigation() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', function(e) {
            // Voorkom navigatie als op de skip/bekijk knop wordt geklikt
            if (!e.target.closest('.skip-btn')) {
                const stepNumber = parseInt(this.getAttribute('data-step'));
                navigateToStep(stepNumber);
            }
        });
    });
}

function navigateToStep(stepNumber) {
    // Alleen navigeren als de stap al is bezocht of direct na de huidige stap komt
    if (stepStatuses[stepNumber].visited || stepNumber === currentStep) {
        currentStep = stepNumber;
        updateStepVisibility();
        updateStepStatuses();
    }
} 