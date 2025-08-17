// Authentication System
class SecureAuth {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'quizApp_session';
    }

    async hashEmail(email) {
        const encoder = new TextEncoder();
        const data = encoder.encode(email.toLowerCase());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async login(email, password) {
        try {
            const hashedEmail = await this.hashEmail(email);
            
            // In production, you'd validate against a secure backend
            // For demo purposes, we accept any password with basic validation
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (!this.isValidEmail(email)) {
                throw new Error('Invalid email format');
            }

            this.currentUser = {
                id: hashedEmail,
                displayName: email.split('@')[0],
                email: email,
                loginTime: new Date().toISOString()
            };
            
            // Store session (in production, use more secure session management)
            this.saveSession();
            
            return this.currentUser;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    logout() {
        this.currentUser = null;
        this.clearSession();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    saveSession() {
        try {
            const sessionData = {
                user: this.currentUser,
                timestamp: Date.now()
            };
            // In production, use more secure storage
            sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        } catch (error) {
            console.warn('Failed to save session:', error);
        }
    }

    loadSession() {
        try {
            const sessionData = sessionStorage.getItem(this.sessionKey);
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                // Check if session is still valid (24 hours)
                const sessionAge = Date.now() - parsed.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                
                if (sessionAge < maxAge) {
                    this.currentUser = parsed.user;
                    return this.currentUser;
                }
            }
        } catch (error) {
            console.warn('Failed to load session:', error);
        }
        return null;
    }

    clearSession() {
        try {
            sessionStorage.removeItem(this.sessionKey);
        } catch (error) {
            console.warn('Failed to clear session:', error);
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Create global auth instance
window.auth = new SecureAuth();
