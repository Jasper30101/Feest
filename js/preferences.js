document.addEventListener('DOMContentLoaded', function() {
    const preferencesForm = document.getElementById('preferencesForm');
    
    // Datum checkbox handler
    const dateInput = document.getElementById('partyDate');
    const noDateCheckbox = document.getElementById('noDateYet');
    
    noDateCheckbox.addEventListener('change', function() {
        dateInput.disabled = this.checked;
        if (this.checked) {
            dateInput.value = '';
        }
    });

    // Guest range selectie
    const guestOptions = document.querySelectorAll('.guest-option');
    let selectedGuestRange = null;

    guestOptions.forEach(option => {
        option.addEventListener('click', function() {
            guestOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedGuestRange = this.dataset.range;
        });
    });

    // Budget checkbox handler
    const budgetInput = document.getElementById('budget');
    const noBudgetCheckbox = document.getElementById('noBudgetLimit');

    noBudgetCheckbox.addEventListener('change', function() {
        budgetInput.disabled = this.checked;
        if (this.checked) {
            budgetInput.value = '';
        }
    });

    // Locatie suggestie handler
    const suggestLocationBtn = document.querySelector('.suggest-location-btn');
    suggestLocationBtn.addEventListener('click', function() {
        const suggestion = prompt('Voer een locatie suggestie in:');
        if (suggestion) {
            const locationSelect = document.getElementById('location');
            const option = new Option(suggestion, 'suggested:' + suggestion);
            locationSelect.add(option);
            locationSelect.value = option.value;
        }
    });

    // Spotify connect simulatie
    const spotifyBtn = document.querySelector('.spotify-connect-btn');
    spotifyBtn.addEventListener('click', function() {
        alert('Spotify integratie komt binnenkort beschikbaar!');
    });

    // Form submit handler
    preferencesForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            description: document.getElementById('partyDescription').value,
            partyDate: noDateCheckbox.checked ? 'nog niet bekend' : dateInput.value,
            guestRange: selectedGuestRange,
            budget: noBudgetCheckbox.checked ? 'geen limiet' : budgetInput.value,
            location: document.getElementById('location').value,
            partyType: Array.from(document.querySelectorAll('input[name="partyType"]:checked'))
                .map(checkbox => checkbox.value),
            userId: localStorage.getItem('currentUser'),
            createdAt: new Date().toISOString()
        };

        // Sla de data op
        const parties = JSON.parse(localStorage.getItem('parties') || '[]');
        parties.push(formData);
        localStorage.setItem('parties', JSON.stringify(parties));

        // Ga naar de loading pagina
        window.location.href = 'loading.html';
    });
}); 