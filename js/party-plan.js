function downloadPDF() {
    // Haal de feestgegevens op uit localStorage
    const currentUser = localStorage.getItem('currentUser');
    const parties = JSON.parse(localStorage.getItem('parties') || '[]');
    const latestParty = parties.filter(party => party.userId === currentUser)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    // Genereer een dummy PDF bestand (in een echte app zou je hier een echte PDF genereren)
    const blob = new Blob([`
        Party Planner - Feestplan
        
        Datum: ${new Date(latestParty.partyDate).toLocaleDateString('nl-NL')}
        Aantal gasten: ${latestParty.guestCount}
        Locatie: ${latestParty.location}
        Budget: €${latestParty.budget}
        
        Type feest: ${latestParty.partyType.join(', ')}
        Muziekstijlen: ${latestParty.musicStyle.join(', ')}
        
        Extra wensen: ${latestParty.notes}
    `], { type: 'application/pdf' });

    // Creëer een download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feestplan.pdf';
    
    // Trigger de download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Voeg een confetti effect toe wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', function() {
    // Hier zou je een confetti animatie kunnen toevoegen
    console.log('Pagina geladen - klaar voor download!');
}); 