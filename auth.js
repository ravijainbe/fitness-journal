// Authentication Manager with Supabase
class AuthManager {
    constructor() {
        this.supabaseUrl = 'https://tiqayakgbdjdztavsmty.supabase.co'; // Will be configured
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcWF5YWtnYmRqZHp0YXZzbXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIzMzQsImV4cCI6MjA3ODcwODMzNH0.AZq8OsylAQcxR0-jfxBhGiZBK-e3erSydNE2nDi9-GA'; // Will be configured
        this.supabase = null;
        this.currentUser = null;
    }

    async init() {
        // Check if Supabase is configured
        if (this.supabaseUrl.includes('YOUR_SUPABASE')) {
            console.warn('Supabase not configured. Using local storage only.');
            this.checkLocalAuth();
            return;
        }

        // Initialize Supabase client
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
        
        // Check for existing session
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            this.onAuthStateChange(true);
        }

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                this.onAuthStateChange(true);
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.onAuthStateChange(false);
            }
        });
    }

    checkLocalAuth() {
        // Fallback to local storage authentication
        const user = localStorage.getItem('fitness_user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.onAuthStateChange(true);
        }
    }

    async signUp(email, password, name) {
        if (!this.supabase) {
            // Local storage fallback
            return this.localSignUp(email, password, name);
        }

        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name
                    }
                }
            });

            if (error) throw error;

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        if (!this.supabase) {
            // Local storage fallback
            return this.localSignIn(email, password);
        }

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.currentUser = data.user;
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        if (!this.supabase) {
            // Local storage fallback
            localStorage.removeItem('fitness_user');
            this.currentUser = null;
            this.onAuthStateChange(false);
            return { success: true };
        }

        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async resetPassword(email) {
        if (!this.supabase) {
            return { success: false, error: 'Password reset not available in local mode' };
        }

        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html'
            });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Local storage fallback methods
    localSignUp(email, password, name) {
        const users = JSON.parse(localStorage.getItem('fitness_users') || '[]');
        
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email already exists' };
        }

        const user = {
            id: Date.now().toString(),
            email,
            password: btoa(password), // Simple encoding (not secure for production)
            name,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        localStorage.setItem('fitness_users', JSON.stringify(users));
        localStorage.setItem('fitness_user', JSON.stringify({ id: user.id, email: user.email, name: user.name }));
        
        this.currentUser = { id: user.id, email: user.email, name: user.name };
        this.onAuthStateChange(true);

        return { success: true, user: this.currentUser };
    }

    localSignIn(email, password) {
        const users = JSON.parse(localStorage.getItem('fitness_users') || '[]');
        const user = users.find(u => u.email === email && u.password === btoa(password));

        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }

        const userData = { id: user.id, email: user.email, name: user.name };
        localStorage.setItem('fitness_user', JSON.stringify(userData));
        
        this.currentUser = userData;
        this.onAuthStateChange(true);

        return { success: true, user: userData };
    }

    onAuthStateChange(isAuthenticated) {
        if (isAuthenticated) {
            document.getElementById('auth-container')?.classList.add('hidden');
            document.getElementById('app-container')?.classList.remove('hidden');
            document.getElementById('user-name')?.textContent = this.currentUser?.name || this.currentUser?.email || 'User';
        } else {
            document.getElementById('auth-container')?.classList.remove('hidden');
            document.getElementById('app-container')?.classList.add('hidden');
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserId() {
        return this.currentUser?.id;
    }
}

// Export for use in app
window.AuthManager = AuthManager;
