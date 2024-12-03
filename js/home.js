document.addEventListener('DOMContentLoaded', function() {
    // Check of gebruiker is ingelogd
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Toon gebruikers email in navbar
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === currentUser);
    if (user) {
        document.getElementById('userEmail').textContent = user.email;
    }

    // Laad en toon feestjes
    loadParties();
});

function loadParties() {
    const currentUser = localStorage.getItem('currentUser');
    const parties = JSON.parse(localStorage.getItem('parties') || '[]');
    const userParties = parties.filter(party => party.userId === currentUser);
    const partiesList = document.getElementById('partiesList');

    if (userParties.length === 0) {
        partiesList.innerHTML = `
            <div class="no-parties">
                <p>Je hebt nog geen feestjes gepland.</p>
                <p>Klik op "Nieuw Feest Plannen" om te beginnen!</p>
            </div>
        `;
        return;
    }

    partiesList.innerHTML = userParties.map(party => `
        <div class="party-card">
            <div class="party-date">${formatDate(party.partyDate)}</div>
            <div class="party-details">
                <p><strong>Locatie:</strong> ${party.location}</p>
                <p><strong>Aantal gasten:</strong> ${party.guestCount}</p>
                <p><strong>Budget:</strong> €${party.budget}</p>
                <p><strong>Type:</strong> ${party.partyType.join(', ')}</p>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
} 