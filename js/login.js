// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Check if user is already logged in
    if (window.auth && window.auth.loadSession()) {
        // Redirect to main app
        window.location.href = 'index.html';
        return;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('.login-btn');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';
        loginError.style.display = 'none';

        try {
            await window.auth.login(email, password);
            
            // Success - redirect to main app
            window.location.href = 'index.html';
            
        } catch (error) {
            // Show error
            loginError.textContent = error.message || 'Login failed. Please try again.';
            loginError.style.display = 'block';
            
            // Reset form
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
            document.getElementById('password').value = '';
        }
    });

    // Form validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    emailInput.addEventListener('blur', function() {
        if (this.value && !window.auth.isValidEmail(this.value)) {
            this.style.borderColor = '#e53e3e';
        } else {
            this.style.borderColor = '#e2e8f0';
        }
    });

    // Clear error when user starts typing
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            loginError.style.display = 'none';
            this.style.borderColor = '#e2e8f0';
        });
    });
});
