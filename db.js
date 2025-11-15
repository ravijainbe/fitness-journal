// IndexedDB Database Manager
class FitnessDB {
    constructor() {
        this.dbName = 'FitnessJournalDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create Activities object store
                if (!db.objectStoreNames.contains('activities')) {
                    const activityStore = db.createObjectStore('activities', { keyPath: 'id', autoIncrement: true });
                    activityStore.createIndex('date', 'date', { unique: false });
                    activityStore.createIndex('type', 'type', { unique: false });
                    activityStore.createIndex('dateType', ['date', 'type'], { unique: false });
                }

                // Create Goals object store
                if (!db.objectStoreNames.contains('goals')) {
                    const goalStore = db.createObjectStore('goals', { keyPath: 'id', autoIncrement: true });
                    goalStore.createIndex('targetDate', 'targetDate', { unique: false });
                    goalStore.createIndex('type', 'type', { unique: false });
                    goalStore.createIndex('status', 'status', { unique: false });
                }

                // Create User Profile object store
                if (!db.objectStoreNames.contains('profile')) {
                    db.createObjectStore('profile', { keyPath: 'id' });
                }

                console.log('Database setup complete');
            };
        });
    }

    // Activities CRUD Operations
    async addActivity(activity) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activities'], 'readwrite');
            const store = transaction.objectStore('activities');
            
            const activityData = {
                ...activity,
                createdAt: new Date().toISOString()
            };
            
            const request = store.add(activityData);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getAllActivities() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activities'], 'readonly');
            const store = transaction.objectStore('activities');
            const request = store.getAll();

            request.onsuccess = () => {
                // Sort by date descending
                const activities = request.result.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                resolve(activities);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getActivitiesByDateRange(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activities'], 'readonly');
            const store = transaction.objectStore('activities');
            const index = store.index('date');
            
            const range = IDBKeyRange.bound(startDate, endDate);
            const request = index.getAll(range);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getActivitiesByType(type) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activities'], 'readonly');
            const store = transaction.objectStore('activities');
            const index = store.index('type');
            const request = index.getAll(type);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async updateActivity(id, updates) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activities'], 'readwrite');
            const store = transaction.objectStore('activities');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const activity = getRequest.result;
                if (!activity) {
                    reject(new Error('Activity not found'));
                    return;
                }

                const updatedActivity = {
                    ...activity,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                const updateRequest = store.put(updatedActivity);

                updateRequest.onsuccess = () => {
                    resolve(updatedActivity);
                };

                updateRequest.onerror = () => {
                    reject(updateRequest.error);
                };
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    async deleteActivity(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activities'], 'readwrite');
            const store = transaction.objectStore('activities');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Goals CRUD Operations
    async addGoal(goal) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['goals'], 'readwrite');
            const store = transaction.objectStore('goals');
            
            const goalData = {
                ...goal,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            const request = store.add(goalData);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getAllGoals() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['goals'], 'readonly');
            const store = transaction.objectStore('goals');
            const request = store.getAll();

            request.onsuccess = () => {
                console.log('getAllGoals - Raw result from IndexedDB:', request.result);
                // Sort by creation date descending (use createdAt if available, otherwise createdDate)
                const goals = request.result.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.createdDate || 0);
                    const dateB = new Date(b.createdAt || b.createdDate || 0);
                    return dateB - dateA;
                });
                console.log('getAllGoals - Sorted goals:', goals);
                resolve(goals);
            };

            request.onerror = () => {
                console.error('getAllGoals - Error:', request.error);
                reject(request.error);
            };
        });
    }

    async getActiveGoals() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['goals'], 'readonly');
            const store = transaction.objectStore('goals');
            const index = store.index('status');
            const request = index.getAll('active');

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async updateGoal(id, updates) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['goals'], 'readwrite');
            const store = transaction.objectStore('goals');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const goal = getRequest.result;
                if (!goal) {
                    reject(new Error('Goal not found'));
                    return;
                }

                const updatedGoal = {
                    ...goal,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                const updateRequest = store.put(updatedGoal);

                updateRequest.onsuccess = () => {
                    resolve(updatedGoal);
                };

                updateRequest.onerror = () => {
                    reject(updateRequest.error);
                };
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    async deleteGoal(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['goals'], 'readwrite');
            const store = transaction.objectStore('goals');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // User Profile Operations
    async saveProfile(profile) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['profile'], 'readwrite');
            const store = transaction.objectStore('profile');
            
            const profileData = {
                id: 'user_profile',
                ...profile,
                updatedAt: new Date().toISOString()
            };
            
            const request = store.put(profileData);

            request.onsuccess = () => {
                resolve(profileData);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getProfile() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['profile'], 'readonly');
            const store = transaction.objectStore('profile');
            const request = store.get('user_profile');

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Analytics and Statistics
    async getActivityStats(startDate, endDate) {
        const activities = await this.getActivitiesByDateRange(startDate, endDate);
        
        const stats = {
            totalActivities: activities.length,
            totalDuration: activities.reduce((sum, a) => sum + (a.duration || 0), 0),
            totalDistance: activities.reduce((sum, a) => sum + (a.distance || 0), 0),
            totalCalories: activities.reduce((sum, a) => sum + (a.calories || 0), 0),
            byType: {}
        };

        activities.forEach(activity => {
            if (!stats.byType[activity.type]) {
                stats.byType[activity.type] = {
                    count: 0,
                    duration: 0,
                    distance: 0,
                    calories: 0
                };
            }
            stats.byType[activity.type].count++;
            stats.byType[activity.type].duration += activity.duration || 0;
            stats.byType[activity.type].distance += activity.distance || 0;
            stats.byType[activity.type].calories += activity.calories || 0;
        });

        return stats;
    }

    // Export/Import for backup
    async exportData() {
        const activities = await this.getAllActivities();
        const goals = await this.getAllGoals();
        const profile = await this.getProfile();

        return {
            version: this.version,
            exportDate: new Date().toISOString(),
            activities,
            goals,
            profile
        };
    }

    async importData(data) {
        try {
            // Import activities
            if (data.activities) {
                for (const activity of data.activities) {
                    const { id, ...activityData } = activity;
                    await this.addActivity(activityData);
                }
            }

            // Import goals
            if (data.goals) {
                for (const goal of data.goals) {
                    const { id, ...goalData } = goal;
                    await this.addGoal(goalData);
                }
            }

            // Import profile
            if (data.profile) {
                await this.saveProfile(data.profile);
            }

            return true;
        } catch (error) {
            console.error('Import failed:', error);
            throw error;
        }
    }

    // Clear all data
    async clearAllData() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activities', 'goals', 'profile'], 'readwrite');
            
            transaction.objectStore('activities').clear();
            transaction.objectStore('goals').clear();
            transaction.objectStore('profile').clear();

            transaction.oncomplete = () => {
                resolve(true);
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }
}

// Export for use in app
window.FitnessDB = FitnessDB;
