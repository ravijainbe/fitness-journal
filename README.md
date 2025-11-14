# Fitness Journal

A comprehensive health and fitness tracking application that helps you log activities, set goals, track progress, and visualize improvements over time.

## Features

### 📊 Dashboard
- Quick overview of your fitness stats
- Total activities logged
- Active goals count
- Weekly activity summary
- Current streak tracker
- Recent activities feed

### 🏃 Activity Logging
- Log various activity types (running, cycling, swimming, gym, yoga, walking, etc.)
- Track duration, distance, and calories burned
- Add personal notes to each activity
- View complete activity history
- Delete activities as needed

### 🎯 Goal Setting
- Create custom fitness goals
- Multiple goal types:
  - Activity frequency (e.g., "Exercise 5 times per week")
  - Total duration (e.g., "Complete 300 minutes this month")
  - Total distance (e.g., "Run 50km this month")
  - Weight targets
- Set target dates
- Visual progress tracking with progress bars
- Automatic progress calculation

### 📈 Progress Visualization
- **Activity Frequency Chart**: Bar chart showing daily activities over the last 30 days
- **Duration Trends Chart**: Doughnut chart displaying time spent on each activity type
- Interactive charts powered by Chart.js

## How to Use

1. **Open the App**: Simply open `index.html` in your web browser
2. **Log Activities**: Click "Log Activity" to record your workouts
3. **Set Goals**: Navigate to Goals and create targets to work towards
4. **Track Progress**: View the Progress tab to see your improvements over time
5. **Monitor Dashboard**: Check your dashboard for quick stats and recent activities

## Data Storage

All data is stored locally in your browser using **IndexedDB**, providing:
- **Better Performance**: Handles large datasets efficiently
- **Structured Storage**: Organized data with indexes for fast queries
- **Reliability**: More robust than localStorage
- **Privacy**: All data stays on your device
- **Export/Import**: Backup and restore your data anytime

### Database Features
- Automatic indexing for fast date and type-based queries
- Support for complex data structures
- Transaction-based operations for data integrity
- Export data as JSON for backup
- Import data from previous backups

## Technologies Used

- HTML5
- CSS3 (with modern gradients and responsive design)
- Vanilla JavaScript (ES6+)
- **IndexedDB** for robust local database storage
- Chart.js for data visualization
- Async/Await for clean asynchronous operations

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript (async/await, classes)
- IndexedDB API
- Canvas API (for Chart.js)
- CSS Grid and Flexbox

Tested on:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Opera 67+

## Getting Started

No installation required! Just:
1. Download the files
2. Open `index.html` in your browser
3. Start tracking your fitness journey

## Tips

- Log activities consistently to build your streak
- Set realistic, achievable goals
- Review your progress charts weekly to stay motivated
- Use the notes field to track how you felt during workouts
- Update your goals as you achieve them
- **Export your data regularly** as a backup
- Use the import feature to restore data or transfer between devices

## Data Management

### Export Data
Click the "📥 Export Data" button on the dashboard to download a JSON backup of all your activities, goals, and profile data.

### Import Data
Click the "📤 Import Data" button to restore from a previous backup. This will add the imported data to your existing data (it won't overwrite).

### Database Structure
The app uses three IndexedDB object stores:
- **activities**: All logged workouts with indexes on date and type
- **goals**: Fitness goals with progress tracking
- **profile**: User profile information (future feature)

Enjoy your fitness journey! 💪
