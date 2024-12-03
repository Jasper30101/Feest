document.addEventListener('DOMContentLoaded', function() {
    // Check of gebruiker al is ingelogd
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'home.html';
        return;
    }

    const googleBtn = document.querySelector('.google-btn');
    googleBtn.addEventListener('click', function() {
        // Voor nu simuleren we een succesvolle Google login
        const mockUser = {
            email: 'test@gmail.com',
            username: 'Test Gebruiker'
        };
        localStorage.setItem('currentUser', mockUser.email);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        window.location.href = 'home.html';
    });

    const appleBtn = document.querySelector('.apple-btn');
    appleBtn.addEventListener('click', function() {
        // Voor nu simuleren we een succesvolle Apple login
        const mockUser = {
            email: 'test@icloud.com',
            username: 'Test Gebruiker'
        };
        localStorage.setItem('currentUser', mockUser.email);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        window.location.href = 'home.html';
    });
}); 