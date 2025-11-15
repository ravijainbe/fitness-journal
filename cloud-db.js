// Cloud Database Manager with Supabase + IndexedDB sync
class CloudDB extends FitnessDB {
    constructor(authManager) {
        super();
        this.authManager = authManager;
        this.supabaseUrl = 'https://tiqayakgbdjdztavsmty.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcWF5YWtnYmRqZHp0YXZzbXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIzMzQsImV4cCI6MjA3ODcwODMzNH0.AZq8OsylAQcxR0-jfxBhGiZBK-e3erSydNE2nDi9-GA';
        this.supabase = null;
        this.syncEnabled = true;
    }

    async init() {
        // Initialize local IndexedDB first
        await super.init();

        // Check if Supabase is configured
        if (this.supabaseUrl.includes('YOUR_SUPABASE')) {
            console.warn('Cloud sync not configured. Using local storage only.');
            return;
        }

        // Initialize Supabase client
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
        this.syncEnabled = true;

        // Sync data if user is authenticated
        if (this.authManager.isAuthenticated()) {
            await this.syncFromCloud();
        }
    }

    // Override addActivity to sync with cloud
    async addActivity(activity) {
        const localId = await super.addActivity(activity);

        if (this.syncEnabled && this.authManager.isAuthenticated()) {
            try {
                const activityData = {
                    ...activity,
                    user_id: this.authManager.getUserId(),
                    local_id: localId,
                    synced_at: new Date().toISOString()
                };

                const { data, error } = await this.supabase
                    .from('activities')
                    .insert([activityData])
                    .select();

                if (error) throw error;
            } catch (error) {
                console.error('Failed to sync activity to cloud:', error);
            }
        }

        return localId;
    }

    // Override addGoal to sync with cloud
    async addGoal(goal) {
        console.log('CloudDB.addGoal called with:', goal);
        
        try {
            const localId = await super.addGoal(goal);
            console.log('Goal saved to IndexedDB with ID:', localId);

            if (this.syncEnabled && this.authManager.isAuthenticated()) {
                try {
                    const goalData = {
                        ...goal,
                        user_id: this.authManager.getUserId(),
                        local_id: localId,
                        synced_at: new Date().toISOString()
                    };

                    const { data, error } = await this.supabase
                        .from('goals')
                        .insert([goalData])
                        .select();

                    if (error) throw error;
                    console.log('Goal synced to cloud successfully');
                } catch (error) {
                    console.error('Failed to sync goal to cloud (local save succeeded):', error);
                }
            }

            return localId;
        } catch (error) {
            console.error('Failed to save goal to IndexedDB:', error);
            throw error;
        }
    }

    // Override deleteActivity to sync with cloud
    async deleteActivity(id) {
        await super.deleteActivity(id);

        if (this.syncEnabled && this.authManager.isAuthenticated()) {
            try {
                const { error } = await this.supabase
                    .from('activities')
                    .delete()
                    .eq('local_id', id)
                    .eq('user_id', this.authManager.getUserId());

                if (error) throw error;
            } catch (error) {
                console.error('Failed to delete activity from cloud:', error);
            }
        }
    }

    // Override deleteGoal to sync with cloud
    async deleteGoal(id) {
        await super.deleteGoal(id);

        if (this.syncEnabled && this.authManager.isAuthenticated()) {
            try {
                const { error } = await this.supabase
                    .from('goals')
                    .delete()
                    .eq('local_id', id)
                    .eq('user_id', this.authManager.getUserId());

                if (error) throw error;
            } catch (error) {
                console.error('Failed to delete goal from cloud:', error);
            }
        }
    }

    // Sync data from cloud to local
    async syncFromCloud() {
        if (!this.syncEnabled || !this.authManager.isAuthenticated()) {
            console.log('syncFromCloud - Skipped (not enabled or not authenticated)');
            return;
        }

        try {
            const userId = this.authManager.getUserId();
            console.log('syncFromCloud - Fetching data from cloud for user:', userId);

            // Fetch activities from cloud
            const { data: activities, error: activitiesError } = await this.supabase
                .from('activities')
                .select('*')
                .eq('user_id', userId);

            if (activitiesError) {
                console.warn('syncFromCloud - Failed to fetch activities, keeping local data:', activitiesError);
                throw activitiesError;
            }

            // Fetch goals from cloud
            const { data: goals, error: goalsError } = await this.supabase
                .from('goals')
                .select('*')
                .eq('user_id', userId);

            if (goalsError) {
                console.warn('syncFromCloud - Failed to fetch goals, keeping local data:', goalsError);
                throw goalsError;
            }

            console.log(`syncFromCloud - Fetched ${activities ? activities.length : 0} activities and ${goals ? goals.length : 0} goals from cloud`);

            // Get local data to compare
            const localActivities = await super.getAllActivities();
            const localGoals = await super.getAllGoals();
            
            console.log(`syncFromCloud - Local data: ${localActivities.length} activities, ${localGoals.length} goals`);

            // Only clear and sync if cloud has data OR if local is empty
            // This prevents clearing local data when cloud is empty
            if ((activities && activities.length > 0) || (goals && goals.length > 0) || (localActivities.length === 0 && localGoals.length === 0)) {
                console.log('syncFromCloud - Clearing local data and importing from cloud');
                await this.clearAllData();

                // Import cloud data to local
                if (activities) {
                    for (const activity of activities) {
                        const { user_id, local_id, synced_at, id: cloudId, ...activityData } = activity;
                        await super.addActivity(activityData);
                    }
                }

                if (goals) {
                    for (const goal of goals) {
                        const { user_id, local_id, synced_at, id: cloudId, ...goalData } = goal;
                        await super.addGoal(goalData);
                    }
                }

                console.log(`syncFromCloud - Successfully synced ${activities ? activities.length : 0} activities and ${goals ? goals.length : 0} goals from cloud`);
            } else {
                console.log('syncFromCloud - Cloud is empty but local has data. Syncing local to cloud instead.');
                await this.syncToCloud();
            }
        } catch (error) {
            console.error('syncFromCloud - Error, keeping local data intact:', error);
            // Don't clear local data on error - just keep what we have
        }
    }

    // Sync local data to cloud
    async syncToCloud() {
        if (!this.syncEnabled || !this.authManager.isAuthenticated()) {
            return;
        }

        try {
            const userId = this.authManager.getUserId();
            const activities = await super.getAllActivities();
            const goals = await super.getAllGoals();

            // Delete existing cloud data for this user
            await this.supabase.from('activities').delete().eq('user_id', userId);
            await this.supabase.from('goals').delete().eq('user_id', userId);

            // Upload activities
            if (activities.length > 0) {
                const activitiesData = activities.map(a => ({
                    ...a,
                    user_id: userId,
                    local_id: a.id,
                    synced_at: new Date().toISOString()
                }));

                const { error } = await this.supabase
                    .from('activities')
                    .insert(activitiesData);

                if (error) throw error;
            }

            // Upload goals
            if (goals.length > 0) {
                const goalsData = goals.map(g => ({
                    ...g,
                    user_id: userId,
                    local_id: g.id,
                    synced_at: new Date().toISOString()
                }));

                const { error } = await this.supabase
                    .from('goals')
                    .insert(goalsData);

                if (error) throw error;
            }

            console.log(`Synced ${activities.length} activities and ${goals.length} goals to cloud`);
        } catch (error) {
            console.error('Failed to sync to cloud:', error);
        }
    }

    // Manual sync trigger
    async manualSync() {
        if (!this.syncEnabled) {
            throw new Error('Cloud sync is not enabled');
        }

        if (!this.authManager.isAuthenticated()) {
            throw new Error('User must be authenticated to sync');
        }

        await this.syncFromCloud();
        return { success: true, message: 'Data synced successfully' };
    }

    // Diagnostic function to check cloud data
    async checkCloudData() {
        if (!this.syncEnabled || !this.authManager.isAuthenticated()) {
            console.log('Cannot check cloud data - not authenticated');
            return null;
        }

        try {
            const userId = this.authManager.getUserId();
            
            const { data: activities, error: activitiesError } = await this.supabase
                .from('activities')
                .select('*')
                .eq('user_id', userId);

            const { data: goals, error: goalsError } = await this.supabase
                .from('goals')
                .select('*')
                .eq('user_id', userId);

            const localActivities = await super.getAllActivities();
            const localGoals = await super.getAllGoals();

            const report = {
                cloud: {
                    activities: activities ? activities.length : 0,
                    goals: goals ? goals.length : 0,
                    activitiesError: activitiesError ? activitiesError.message : null,
                    goalsError: goalsError ? goalsError.message : null
                },
                local: {
                    activities: localActivities.length,
                    goals: localGoals.length
                },
                userId: userId
            };

            console.log('Cloud Data Report:', report);
            return report;
        } catch (error) {
            console.error('Failed to check cloud data:', error);
            return { error: error.message };
        }
    }
}

// Export for use in app
window.CloudDB = CloudDB;
