document.addEventListener('DOMContentLoaded', function() {
    const formData = JSON.parse(localStorage.getItem('partyPreferences')) || {};
    console.log('Retrieved Form Data:', formData); // Debug logging
    displaySummary(formData);
});

function displaySummary(data) {
    // Basis Info Samenvatting
    const basicInfoSummary = document.getElementById('basicInfoSummary');
    let basicText = '';

    // Type feest
    if (data.partyType === 'other' && data.customPartyType) {
        basicText = `Je wilt een ${data.customPartyType} organiseren`;
    } else if (data.partyType) {
        basicText = `Je wilt een ${getPartyTypeName(data.partyType)} organiseren`;
    }

    // Thema
    if (data.partyTheme) {
        if (data.partyTheme === 'other' && data.additionalTheme) {
            basicText += ` met als thema "${data.additionalTheme}"`;
        } else {
            basicText += ` met als thema "${getThemeName(data.partyTheme)}"`;
        }
    }

    // Datum
    if (data.noDateYet) {
        basicText += `. De datum staat nog niet vast`;
    } else if (data.partyDate) {
        basicText += ` op ${formatDate(data.partyDate, data.partyTime)}`;
    }

    // Beschrijving
    if (data.partyDescription) {
        basicText += `. ${data.partyDescription}`;
    }

    basicInfoSummary.textContent = basicText || 'Basis informatie is nog niet ingevuld.';

    // Gasten Samenvatting
    const guestsSummary = document.getElementById('guestsSummary');
    if (data.guestCount) {
        guestsSummary.textContent = `Je verwacht ${getGuestRangeText(data.guestCount)} gasten op je feest.`;
    } else {
        guestsSummary.textContent = `Het aantal gasten is nog niet bepaald.`;
    }

    // Budget Samenvatting
    const budgetSummary = document.getElementById('budgetSummary');
    if (data.noBudgetLimit) {
        budgetSummary.textContent = `Je hebt aangegeven dat het budget niet uitmaakt.`;
    } else if (data.budget) {
        budgetSummary.textContent = `Je hebt een budget van €${data.budget} voor het feest.`;
    } else {
        budgetSummary.textContent = `Er is nog geen budget vastgesteld.`;
    }

    // Locatie Samenvatting
    const locationSummary = document.getElementById('locationSummary');
    if (data.location) {
        if (data.customLocation) {
            locationSummary.textContent = `Je hebt een specifieke locatie voorgesteld: ${data.customLocation}.`;
        } else {
            locationSummary.textContent = `Je wilt het feest ${getLocationName(data.location)} organiseren.`;
        }
    } else {
        locationSummary.textContent = `Er is nog geen locatie gekozen.`;
    }

    // Muziek Samenvatting
    const musicSummary = document.getElementById('musicSummary');
    let musicText = '';
    
    if (data.genres && data.genres.length > 0) {
        musicText = `Je muziekvoorkeur gaat uit naar ${data.genres.join(', ')}.`;
        if (data.spotifyConnected) {
            musicText += ` Je hebt je Spotify-account gekoppeld voor een persoonlijke playlist.`;
        }
    } else {
        musicText = `Er zijn nog geen muziekvoorkeuren opgegeven.`;
    }
    
    musicSummary.textContent = musicText;

    // Voeg de ChatGPT prompt toe
    const promptElement = document.getElementById('chatgptPrompt');
    if (promptElement) {
        promptElement.textContent = generateChatGPTPrompt(data);
    }
}

// Helper functies voor het formatteren van tekst
function getPartyTypeName(type) {
    const types = {
        'birthday': 'verjaardagsfeest',
        'wedding': 'bruiloft',
        'business': 'zakelijk evenement',
        // Voeg meer types toe indien nodig
    };
    return types[type] || type;
}

function getThemeName(theme) {
    const themes = {
        'casino': 'Casino Night',
        'countries': 'Landen van de Wereld',
        'hollywood': 'Hollywood Glamour',
        'tropical': 'Tropical Paradise',
        'masquerade': 'Masquerade Ball',
        'decades': 'Decades Party',
        'neon': 'Neon Night',
        'superhero': 'Superhelden',
        // Voeg meer thema's toe indien nodig
    };
    return themes[theme] || theme;
}

function getLocationName(location) {
    const locations = {
        'home': 'thuis',
        'garden': 'in de tuin',
        'venue': 'in een feestzaal',
        'restaurant': 'in een restaurant'
    };
    return locations[location] || location;
}

function getGuestRangeText(range) {
    const ranges = {
        '0-5': '0 tot 5',
        '5-10': '5 tot 10',
        '10-20': '10 tot 20',
        '20-50': '20 tot 50',
        '50-100': '50 tot 100',
        '100+': 'meer dan 100'
    };
    return ranges[range] || range;
}

function formatDate(dateString, timeString) {
    if (!dateString) return 'Nog niet bepaald';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('nl-NL', options);
    
    if (timeString) {
        return `${formattedDate} om ${timeString} uur`;
    }
    return formattedDate;
}

// Voeg deze functie toe aan summary.js
function generateChatGPTPrompt(data) {
    return `Je bent een professionele feestplanner. Je helpt jongeren een perfect feestje te organiseren. Gebaseerd op de volgende gegevens, maak je een compleet en gedetailleerd plan. Het plan moet bestaan uit:
1. Een korte introductie (beschrijf de sfeer en het thema).
2. Suggesties voor locatie, eten, drinken, muziek en decoratie.
3. Een tijdlijn met stappen (bijv. uitnodigingen versturen, voorbereidingen treffen).
4. Optionele extra's, zoals spelletjes of entertainment.

Hier zijn de gegevens van de gebruiker:
- **Type feest:** ${data.partyType === 'other' ? data.customPartyType : getPartyTypeName(data.partyType)}
- **Aantal gasten:** ${getGuestRangeText(data.guestCount)}
- **Budget:** ${data.noBudgetLimit ? 'Geen limiet' : `€${data.budget}`}
- **Locatie:** ${data.customLocation || getLocationName(data.location)}
- **Datum en tijd:** ${data.noDateYet ? 'Nog niet bepaald' : formatDate(data.partyDate, data.partyTime)}
- **Thema:** ${data.partyTheme === 'other' ? data.additionalTheme : getThemeName(data.partyTheme)}
- **Eten/drinken voorkeuren:** Nog niet gespecificeerd
- **Muziekstijl:** ${data.genres?.length > 0 ? data.genres.join(', ') : 'Nog niet gespecificeerd'}

Op basis van deze gegevens, stel een gedetailleerd feestplan op, inclusief specifieke suggesties. Voeg ook creatieve ideeën toe die binnen het budget passen. Houd rekening met het thema en de doelgroep (jongeren).

Genereer met de Image Generator ook meteen de volgende 2 afbeeldingen. 1: ontwerp van de kaart om mensen uit te nodigen (zet hier ook op de ingevoerde datum en tijd) 2. Een impressie van hoe het feest eruit ziet (gebruik het thema en locatie)

Zet daarna het antwoord wat je gaat geven om in een downloadbaar bestand. Een .PDF bestand. Inclusief de 2 afbeeldingen.`;
}

// Voeg de kopieer functionaliteit toe
function copyPrompt() {
    const promptText = document.getElementById('chatgptPrompt').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="material-icons">check</i>Gekopieerd!';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="material-icons">content_copy</i>Kopieer Prompt';
        }, 2000);
    }).catch(err => {
        console.error('Kon tekst niet kopiëren:', err);
        alert('Kon de tekst niet kopiëren. Probeer het opnieuw.');
    });
} 