// Challenger Registration Script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('challengerForm');
    const successMessage = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const challengerData = {
                id: Date.now(), // Unique ID based on timestamp
                username: document.getElementById('username').value.trim(),
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                score: 0,
                attempts: 0,
                extraInfo: '',
                registeredAt: new Date().toISOString()
            };

            // Get existing challengers from localStorage
            let challengers = JSON.parse(localStorage.getItem('challengers')) || [];

            // Add new challenger
            challengers.push(challengerData);

            // Save to localStorage
            localStorage.setItem('challengers', JSON.stringify(challengers));

            // Show success message
            successMessage.classList.add('show');

            // Reset form
            form.reset();

            // Hide success message after 3 seconds
            setTimeout(function() {
                successMessage.classList.remove('show');
            }, 3000);
        });
    }
});
