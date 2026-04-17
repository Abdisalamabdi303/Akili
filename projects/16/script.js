// Fitness Tracker App - Vanilla JS Logic

// State Management
const state = {
  steps: 0,
  calories: 0,
  activeMinutes: 0,
  distance: 0,
  workouts: [],
  goals: {
    steps: 10000,
    calories: 2000,
    activeMinutes: 30
  }
};

// DOM Elements
const dom = {
  stepsDisplay: document.getElementById('steps-display'),
  caloriesDisplay: document.getElementById('calories-display'),
  activeMinutesDisplay: document.getElementById('active-minutes-display'),
  distanceDisplay: document.getElementById('distance-display'),
  stepsGoalProgress: document.getElementById('steps-goal-progress'),
  caloriesGoalProgress: document.getElementById('calories-goal-progress'),
  activeMinutesGoalProgress: document.getElementById('active-minutes-goal-progress'),
  workoutForm: document.getElementById('workout-form'),
  workoutList: document.getElementById('workout-list'),
  addWorkoutBtn: document.getElementById('add-workout-btn'),
  resetBtn: document.getElementById('reset-btn')
};

// Initialize App
function init() {
  loadState();
  renderDashboard();
  renderWorkouts();
  setupEventListeners();
  lucide.createIcons();
}

// Load State from LocalStorage
function loadState() {
  const savedState = localStorage.getItem('fitnessTrackerState');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    state.steps = parsed.steps || 0;
    state.calories = parsed.calories || 0;
    state.activeMinutes = parsed.activeMinutes || 0;
    state.distance = parsed.distance || 0;
    state.workouts = parsed.workouts || [];
  }
}

// Save State to LocalStorage
function saveState() {
  localStorage.setItem('fitnessTrackerState', JSON.stringify(state));
}

// Render Dashboard
function renderDashboard() {
  // Update main stats
  dom.stepsDisplay.textContent = state.steps.toLocaleString();
  dom.caloriesDisplay.textContent = state.calories.toLocaleString();
  dom.activeMinutesDisplay.textContent = state.activeMinutes.toLocaleString();
  dom.distanceDisplay.textContent = state.distance.toFixed(1);

  // Update progress bars
  const stepsPercent = Math.min((state.steps / state.goals.steps) * 100, 100);
  const caloriesPercent = Math.min((state.calories / state.goals.calories) * 100, 100);
  const activeMinutesPercent = Math.min((state.activeMinutes / state.goals.activeMinutes) * 100, 100);

  dom.stepsGoalProgress.style.width = `${stepsPercent}%`;
  dom.caloriesGoalProgress.style.width = `${caloriesPercent}%`;
  dom.activeMinutesGoalProgress.style.width = `${activeMinutesPercent}%`;

  // Update progress bar text
  document.getElementById('steps-goal-text').textContent = `${state.steps.toLocaleString()} / ${state.goals.steps.toLocaleString()}`;
  document.getElementById('calories-goal-text').textContent = `${state.calories.toLocaleString()} / ${state.goals.calories.toLocaleString()}`;
  document.getElementById('active-minutes-goal-text').textContent = `${state.activeMinutes.toLocaleString()} / ${state.goals.activeMinutes.toLocaleString()}`;
}

// Render Workouts
function renderWorkouts() {
  dom.workoutList.innerHTML = '';
  
  if (state.workouts.length === 0) {
    dom.workoutList.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i data-lucide="activity" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
        <p>No workouts logged yet. Start tracking your fitness journey!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  state.workouts.forEach((workout, index) => {
    const workoutItem = document.createElement('div');
    workoutItem.className = 'card bg-white border border-cyan-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-cyan-200 hover:scale-[1.02]';
    workoutItem.innerHTML = `
      <div class="card-body p-5">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="card-title text-xl font-bold text-gray-800">${workout.type}</h3>
            <p class="text-gray-600 text-sm mt-1">${workout.date}</p>
          </div>
          <button class="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600" onclick="deleteWorkout(${index})">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-cyan-600">${workout.duration}m</p>
            <p class="text-xs text-gray-500 uppercase tracking-wider">Duration</p>
          </div>
          <div class="text-center border-l border-gray-200">
            <p class="text-2xl font-bold text-cyan-600">${workout.calories}</p>
            <p class="text-xs text-gray-500 uppercase tracking-wider">Calories</p>
          </div>
          <div class="text-center border-l border-gray-200">
            <p class="text-2xl font-bold text-cyan-600">${workout.distance.toFixed(1)}km</p>
            <p class="text-xs text-gray-500 uppercase tracking-wider">Distance</p>
          </div>
        </div>
      </div>
    `;
    dom.workoutList.appendChild(workoutItem);
  });

  lucide.createIcons();
}

// Add Workout
function addWorkout(e) {
  e.preventDefault();
  
  const type = document.getElementById('workout-type').value;
  const duration = parseInt(document.getElementById('workout-duration').value);
  const calories = parseInt(document.getElementById('workout-calories').value);
  const distance = parseFloat(document.getElementById('workout-distance').value) || 0;
  
  const newWorkout = {
    type,
    duration,
    calories,
    distance,
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  state.workouts.unshift(newWorkout);
  
  // Update totals
  state.calories += calories;
  state.activeMinutes += duration;
  state.distance += distance;
  
  saveState();
  renderDashboard();
  renderWorkouts();
  
  // Reset form
  dom.workoutForm.reset();
}

// Delete Workout
window.deleteWorkout = function(index) {
  const workout = state.workouts[index];
  
  // Update totals
  state.calories -= workout.calories;
  state.activeMinutes -= workout.duration;
  state.distance -= workout.distance;
  
  // Remove workout
  state.workouts.splice(index, 1);
  
  saveState();
  renderDashboard();
  renderWorkouts();
};

// Setup Event Listeners
function setupEventListeners() {
  dom.workoutForm.addEventListener('submit', addWorkout);
  
  dom.addWorkoutBtn.addEventListener('click', () => {
    document.getElementById('workout-section').scrollIntoView({ behavior: 'smooth' });
  });
  
  dom.resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      state.steps = 0;
      state.calories = 0;
      state.activeMinutes = 0;
      state.distance = 0;
      state.workouts = [];
      saveState();
      renderDashboard();
      renderWorkouts();
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);