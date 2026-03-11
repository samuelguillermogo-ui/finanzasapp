/* =============================================
   AUTH SERVICE - Supabase Authentication
   ============================================= */

const AuthService = {
    currentUser: null,

    /**
     * Sign up with email and password
     */
    async signUp(email, password, fullName) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName || '' }
            }
        });
        if (error) throw error;
        this.currentUser = data.user;
        return data;
    },

    /**
     * Sign in with email and password
     */
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        this.currentUser = data.user;
        return data;
    },

    /**
     * Sign out
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.currentUser = null;
    },

    /**
     * Get current session
     */
    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
            this.currentUser = session.user;
        }
        return session;
    },

    /**
     * Get current user
     */
    getUser() {
        return this.currentUser;
    },

    /**
     * Get user ID
     */
    getUserId() {
        return this.currentUser?.id || null;
    },

    /**
     * Get display name
     */
    getDisplayName() {
        if (!this.currentUser) return 'Usuario';
        return this.currentUser.user_metadata?.full_name || 
               this.currentUser.email?.split('@')[0] || 
               'Usuario';
    },

    /**
     * Listen for auth state changes
     */
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            callback(event, session);
        });
    },

    /**
     * Send password reset email
     */
    async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return data;
    }
};
