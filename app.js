// Data Storage with IndexedDB
class FitnessJournal {
    constructor() {
        this.db = new FitnessDB();
        this.activities = [];
        this.goals = [];
        this.init();
    }

    async init() {
        try {
            await this.db.init();
            await this.loadData();
            this.setupNavigation();
            this.setupModals();
            this.setupForms();
            this.setupDataManagement();
            this.render();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            alert('Failed to initialize database. Please refresh the page.');
        }
    }

    async loadData() {
        try {
            this.activities = await this.db.getAllActivities();
            this.goals = await this.db.getAllGoals();
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(viewName).classList.add('active');
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        if (viewName === 'progress') {
            this.renderCharts();
        }
    }

    setupModals() {
        const activityModal = document.getElementById('activity-modal');
        const goalModal = document.getElementById('goal-modal');

        document.getElementById('add-activity-btn').addEventListener('click', () => {
            activityModal.classList.add('active');
            document.getElementById('activity-date').valueAsDate = new Date();
        });

        document.getElementById('add-goal-btn').addEventListener('click', () => {
            goalModal.classList.add('active');
        });

        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                activityModal.classList.remove('active');
                goalModal.classList.remove('active');
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === activityModal) activityModal.classList.remove('active');
            if (e.target === goalModal) goalModal.classList.remove('active');
        });
    }

    setupForms() {
        document.getElementById('activity-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addActivity();
        });

        document.getElementById('goal-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addGoal();
        });
    }

    setupDataManagement() {
        // Add export/import buttons to dashboard
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid && !document.getElementById('data-management')) {
            const dataManagement = document.createElement('div');
            dataManagement.id = 'data-management';
            dataManagement.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;';
            dataManagement.innerHTML = `
                <button class="btn-primary" onclick="journal.exportData()">📥 Export Data</button>
                <button class="btn-primary" onclick="document.getElementById('import-file').click()">📤 Import Data</button>
                <input type="file" id="import-file" accept=".json" style="display: none;">
            `;
            statsGrid.parentElement.appendChild(dataManagement);

            document.getElementById('import-file').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await this.importData(file);
                    e.target.value = '';
                }
            });
        }
    }

    async exportData() {
        try {
            const data = await this.db.exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fitness-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            alert('Data exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        }
    }

    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (confirm('This will add the imported data to your existing data. Continue?')) {
                await this.db.importData(data);
                await this.loadData();
                this.render();
                alert('Data imported successfully!');
            }
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import data. Please check the file format.');
        }
    }

    async addActivity() {
        try {
            const activity = {
                type: document.getElementById('activity-type').value,
                duration: parseInt(document.getElementById('activity-duration').value),
                distance: parseFloat(document.getElementById('activity-distance').value) || null,
                calories: parseInt(document.getElementById('activity-calories').value) || null,
                notes: document.getElementById('activity-notes').value,
                date: document.getElementById('activity-date').value
            };

            await this.db.addActivity(activity);
            await this.loadData();
            
            document.getElementById('activity-modal').classList.remove('active');
            document.getElementById('activity-form').reset();
            this.render();
        } catch (error) {
            console.error('Failed to add activity:', error);
            alert('Failed to save activity. Please try again.');
        }
    }

    async deleteActivity(id) {
        if (confirm('Delete this activity?')) {
            try {
                await this.db.deleteActivity(id);
                await this.loadData();
                this.render();
            } catch (error) {
                console.error('Failed to delete activity:', error);
                alert('Failed to delete activity. Please try again.');
            }
        }
    }

    async addGoal() {
        try {
            const goal = {
                title: document.getElementById('goal-title').value,
                type: document.getElementById('goal-type').value,
                target: parseFloat(document.getElementById('goal-target').value),
                targetDate: document.getElementById('goal-date').value,
                description: document.getElementById('goal-description').value,
                createdDate: new Date().toISOString().split('T')[0],
                current: 0
            };

            await this.db.addGoal(goal);
            await this.loadData();
            
            document.getElementById('goal-modal').classList.remove('active');
            document.getElementById('goal-form').reset();
            this.render();
        } catch (error) {
            console.error('Failed to add goal:', error);
            alert('Failed to save goal. Please try again.');
        }
    }

    async deleteGoal(id) {
        if (confirm('Delete this goal?')) {
            try {
                await this.db.deleteGoal(id);
                await this.loadData();
                this.render();
            } catch (error) {
                console.error('Failed to delete goal:', error);
                alert('Failed to delete goal. Please try again.');
            }
        }
    }

    calculateGoalProgress(goal) {
        let current = 0;
        const now = new Date();
        const targetDate = new Date(goal.targetDate);
        const createdDate = new Date(goal.createdDate || goal.createdAt);

        switch (goal.type) {
            case 'frequency':
                current = this.activities.filter(a => 
                    new Date(a.date) >= createdDate &&
                    new Date(a.date) <= targetDate
                ).length;
                break;
            case 'duration':
                current = this.activities
                    .filter(a => new Date(a.date) >= createdDate)
                    .reduce((sum, a) => sum + (a.duration || 0), 0);
                break;
            case 'distance':
                current = this.activities
                    .filter(a => new Date(a.date) >= createdDate && a.distance)
                    .reduce((sum, a) => sum + (a.distance || 0), 0);
                break;
        }

        return Math.min((current / goal.target) * 100, 100);
    }

    calculateStreak() {
        if (this.activities.length === 0) return 0;

        const sortedDates = [...new Set(this.activities.map(a => a.date))].sort().reverse();
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let date of sortedDates) {
            const activityDate = new Date(date);
            activityDate.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
                streak++;
                currentDate = activityDate;
            } else {
                break;
            }
        }

        return streak;
    }

    getWeekActivities() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return this.activities.filter(a => new Date(a.date) >= weekAgo).length;
    }

    render() {
        this.renderDashboard();
        this.renderActivities();
        this.renderGoals();
    }

    renderDashboard() {
        document.getElementById('total-activities').textContent = this.activities.length;
        document.getElementById('active-goals').textContent = this.goals.length;
        document.getElementById('week-activities').textContent = this.getWeekActivities();
        document.getElementById('streak-days').textContent = `${this.calculateStreak()} days`;

        const recentContainer = document.getElementById('recent-activities');
        const recent = this.activities.slice(0, 5);

        if (recent.length === 0) {
            recentContainer.innerHTML = '<div class="empty-state"><h3>No activities yet</h3><p>Start logging your workouts!</p></div>';
            return;
        }

        recentContainer.innerHTML = recent.map(activity => `
            <div class="activity-item">
                <div class="activity-header">
                    <span class="activity-type">${this.formatActivityType(activity.type)}</span>
                    <span class="activity-date">${this.formatDate(activity.date)}</span>
                </div>
                <div class="activity-details">
                    <span class="detail-item">⏱️ ${activity.duration} min</span>
                    ${activity.distance ? `<span class="detail-item">📍 ${activity.distance} km</span>` : ''}
                    ${activity.calories ? `<span class="detail-item">🔥 ${activity.calories} cal</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderActivities() {
        const container = document.getElementById('activities-list');

        if (this.activities.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No activities logged</h3><p>Click "Log Activity" to get started</p></div>';
            return;
        }

        container.innerHTML = this.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-header">
                    <span class="activity-type">${this.formatActivityType(activity.type)}</span>
                    <div>
                        <span class="activity-date">${this.formatDate(activity.date)}</span>
                        <button class="btn-delete" onclick="journal.deleteActivity(${activity.id})">Delete</button>
                    </div>
                </div>
                <div class="activity-details">
                    <span class="detail-item">⏱️ ${activity.duration} min</span>
                    ${activity.distance ? `<span class="detail-item">📍 ${activity.distance} km</span>` : ''}
                    ${activity.calories ? `<span class="detail-item">🔥 ${activity.calories} cal</span>` : ''}
                </div>
                ${activity.notes ? `<p style="margin-top: 10px; color: #6c757d;">${activity.notes}</p>` : ''}
            </div>
        `).join('');
    }

    renderGoals() {
        const container = document.getElementById('goals-list');

        if (this.goals.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No goals set</h3><p>Click "New Goal" to create one</p></div>';
            return;
        }

        container.innerHTML = this.goals.map(goal => {
            const progress = this.calculateGoalProgress(goal);
            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <h3>${goal.title}</h3>
                        <button class="btn-delete" onclick="journal.deleteGoal(${goal.id})">Delete</button>
                    </div>
                    <p style="color: #6c757d; margin: 10px 0;">${goal.description}</p>
                    <div class="activity-details">
                        <span class="detail-item">🎯 ${this.formatGoalType(goal.type)}</span>
                        <span class="detail-item">📅 Target: ${this.formatDate(goal.targetDate)}</span>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <p class="progress-text">${progress.toFixed(1)}% complete</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCharts() {
        this.renderFrequencyChart();
        this.renderDurationChart();
    }

    renderFrequencyChart() {
        const canvas = document.getElementById('frequency-chart');
        const ctx = canvas.getContext('2d');

        // Destroy existing chart
        if (window.frequencyChart) {
            window.frequencyChart.destroy();
        }

        // Get last 30 days
        const days = [];
        const counts = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            counts.push(this.activities.filter(a => a.date === dateStr).length);
        }

        window.frequencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Activities',
                    data: counts,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    renderDurationChart() {
        const canvas = document.getElementById('duration-chart');
        const ctx = canvas.getContext('2d');

        if (window.durationChart) {
            window.durationChart.destroy();
        }

        // Group by activity type
        const typeData = {};
        this.activities.forEach(activity => {
            if (!typeData[activity.type]) {
                typeData[activity.type] = 0;
            }
            typeData[activity.type] += activity.duration;
        });

        const labels = Object.keys(typeData).map(type => this.formatActivityType(type));
        const data = Object.values(typeData);

        window.durationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(237, 100, 166, 0.8)',
                        'rgba(255, 154, 158, 0.8)',
                        'rgba(250, 208, 196, 0.8)',
                        'rgba(255, 223, 186, 0.8)',
                        'rgba(161, 228, 235, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    formatActivityType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    formatGoalType(type) {
        const types = {
            frequency: 'Activity Count',
            duration: 'Total Minutes',
            distance: 'Total Distance (km)',
            weight: 'Weight Target'
        };
        return types[type] || type;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Initialize app
let journal;
document.addEventListener('DOMContentLoaded', () => {
    journal = new FitnessJournal();
});
