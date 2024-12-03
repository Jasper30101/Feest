document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    let progress = 0;

    const loadingMessages = [
        "AI analyseert je voorkeuren...",
        "Thema's worden geselecteerd...",
        "Muzieklijst wordt samengesteld...",
        "Menu wordt gegenereerd...",
        "Decoratie ideeën worden verzameld...",
        "Feestplan wordt afgerond..."
    ];

    function updateProgress() {
        if (progress < 100) {
            progress += 1;
            progressBar.style.width = progress + '%';
            
            // Update tekst op bepaalde percentages
            if (progress === 20) {
                loadingText.textContent = loadingMessages[1];
            } else if (progress === 40) {
                loadingText.textContent = loadingMessages[2];
            } else if (progress === 60) {
                loadingText.textContent = loadingMessages[3];
            } else if (progress === 80) {
                loadingText.textContent = loadingMessages[4];
            } else if (progress === 95) {
                loadingText.textContent = loadingMessages[5];
            }

            // Als de voortgang 100% is, ga naar de resultaatpagina
            if (progress === 100) {
                setTimeout(() => {
                    window.location.href = 'party-plan.html';
                }, 1000);
            } else {
                setTimeout(updateProgress, 50); // Snelheid van de voortgangsbalk
            }
        }
    }

    // Start de voortgangsbalk
    setTimeout(updateProgress, 1000);
}); 