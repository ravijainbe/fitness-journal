// Authentication Handler
let authManager;
let cloudDb;

// Initialize authentication
document.addEventListener('DOMContentLoaded', async () => {
    authManager = new AuthManager();
    await authManager.init();

    // Setup form handlers
    setupAuthForms();

    // If user is authenticated, initialize the app
    if (authManager.isAuthenticated()) {
        await initializeApp();
    }
});

function setupAuthForms() {
    // Login form
    document.getElementById('login-form-element').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });

    // Signup form
    document.getElementById('signup-form-element').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSignup();
    });

    // Forgot password form
    document.getElementById('forgot-form-element').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleForgotPassword();
    });
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    showAuthMessage('Signing in...', 'info');

    const result = await authManager.signIn(email, password);

    if (result.success) {
        showAuthMessage('Login successful!', 'success');
        await initializeApp();
    } else {
        showAuthMessage(result.error || 'Login failed', 'error');
    }
}

async function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (password !== confirm) {
        showAuthMessage('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }

    showAuthMessage('Creating account...', 'info');

    const result = await authManager.signUp(email, password, name);

    if (result.success) {
        showAuthMessage('Account created! Please sign in.', 'success');
        setTimeout(() => {
            showLogin();
        }, 2000);
    } else {
        showAuthMessage(result.error || 'Signup failed', 'error');
    }
}

async function handleForgotPassword() {
    const email = document.getElementById('forgot-email').value;

    showAuthMessage('Sending reset link...', 'info');

    const result = await authManager.resetPassword(email);

    if (result.success) {
        showAuthMessage('Password reset link sent to your email!', 'success');
    } else {
        showAuthMessage(result.error || 'Failed to send reset link', 'error');
    }
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        const result = await authManager.signOut();
        if (result.success) {
            window.location.reload();
        }
    }
}

async function syncData() {
    if (!cloudDb) {
        alert('Cloud sync is not available');
        return;
    }

    try {
        const btn = event.target;
        btn.disabled = true;
        btn.textContent = '🔄 Syncing...';

        await cloudDb.manualSync();
        await journal.loadData();
        journal.render();

        btn.textContent = '✓ Synced!';
        setTimeout(() => {
            btn.textContent = '🔄 Sync';
            btn.disabled = false;
        }, 2000);
    } catch (error) {
        alert('Sync failed: ' + error.message);
        event.target.disabled = false;
        event.target.textContent = '🔄 Sync';
    }
}

async function initializeApp() {
    // Initialize cloud database
    cloudDb = new CloudDB(authManager);
    await cloudDb.init();

    // Update the global journal instance to use cloud database
    if (window.journal) {
        journal.db = cloudDb;
        await journal.loadData();
        journal.render();
    }
}

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-form').classList.add('hidden');
    clearAuthMessage();
}

function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('forgot-form').classList.add('hidden');
    clearAuthMessage();
}

function showForgotPassword() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-form').classList.remove('hidden');
    clearAuthMessage();
}

function showAuthMessage(message, type) {
    const messageEl = document.getElementById('auth-message');
    messageEl.textContent = message;
    messageEl.className = `auth-message show ${type}`;
}

function clearAuthMessage() {
    const messageEl = document.getElementById('auth-message');
    messageEl.className = 'auth-message';
}
