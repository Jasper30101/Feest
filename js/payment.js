document.addEventListener('DOMContentLoaded', function() {
    // Haal package informatie uit URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const package = urlParams.get('package');
    
    // Package details
    const packages = {
        starter: { name: 'Starter Pakket', price: '5,00' },
        duo: { name: 'Duo Pakket', price: '7,50' },
        pro: { name: 'Party Pro Pakket', price: '9,95' }
    };

    // Update package informatie
    const selectedPackage = packages[package] || packages.starter;
    document.getElementById('selectedPackage').textContent = 
        `Geselecteerd: ${selectedPackage.name}`;
    document.getElementById('packageName').textContent = selectedPackage.name;
    document.getElementById('packagePrice').textContent = `€${selectedPackage.price}`;
    document.getElementById('totalPrice').textContent = `€${selectedPackage.price}`;
});

function processPayment() {
    const selectedBank = document.querySelector('input[name="bank"]:checked');
    
    if (!selectedBank) {
        alert('Selecteer eerst een bank om door te gaan.');
        return;
    }

    // Simuleer een betaling (in een echte app zou dit naar een payment provider gaan)
    alert('Je wordt doorgestuurd naar je bank...');
    
    // Simuleer een succesvolle betaling
    setTimeout(() => {
        window.location.href = 'register.html';
    }, 1500);
} 