// Weather Dashboard Application
// Global state management
const state = {
  currentCity: null,
  weatherData: null,
  forecastData: null,
  searchHistory: []
};

// API Configuration (Open-Meteo for no-key API)
const API_BASE = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_ALERTS_API = "https://api.weather.gov/alerts/active";

// DOM Elements
const elements = {
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  currentLocationBtn: document.getElementById('currentLocationBtn'),
  randomCityBtn: document.getElementById('randomCityBtn'),
  loadingSection: document.getElementById('loadingSection'),
  errorSection: document.getElementById('errorSection'),
  currentWeatherSection: document.getElementById('currentWeatherSection'),
  searchResultsSection: document.getElementById('searchResultsSection'),
  retryBtn: document.getElementById('retryBtn'),
  cityName: document.getElementById('cityName'),
  currentDate: document.getElementById('currentDate'),
  weatherDescription: document.getElementById('weatherDescription'),
  weatherIcon: document.getElementById('weatherIcon'),
  temperature: document.getElementById('temperature'),
  feelsLike: document.getElementById('feelsLike'),
  windSpeed: document.getElementById('windSpeed'),
  humidity: document.getElementById('humidity'),
  uvIndex: document.getElementById('uvIndex'),
  visibility: document.getElementById('visibility'),
  forecastContainer: document.getElementById('forecastContainer'),
  alertsSection: document.getElementById('alertsSection'),
  alertsContainer: document.getElementById('alertsContainer'),
  searchResultsContainer: document.getElementById('searchResultsContainer')
};

// Weather condition mapping for icons
const weatherConditions = {
  clear: { icon: 'fa-sun', color: 'text-amber-500' },
  cloudy: { icon: 'fa-cloud', color: 'text-gray-500' },
  partlyCloudy: { icon: 'fa-cloud-sun', color: 'text-amber-500' },
  rain: { icon: 'fa-cloud-rain', color: 'text-blue-500' },
  snow: { icon: 'fa-snowflake', color: 'text-white' },
  thunderstorm: { icon: 'fa-bolt', color: 'text-yellow-500' },
  fog: { icon: 'fa-smog', color: 'text-gray-400' }
};

// Initialize the application
function init() {
  setupEventListeners();
  loadWeatherForCity('New York'); // Default city
}

// Setup event listeners
function setupEventListeners() {
  elements.searchBtn.addEventListener('click', handleSearch);
  elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  elements.currentLocationBtn.addEventListener('click', useCurrentLocation);
  elements.randomCityBtn.addEventListener('click', getRandomCity);
  elements.retryBtn.addEventListener('click', () => {
    elements.errorSection.classList.add('hidden');
    if (state.currentCity) {
      loadWeatherForCity(state.currentCity);
    }
  });
}

// Handle search functionality
function handleSearch() {
  const city = elements.searchInput.value.trim();
  if (city) {
    loadWeatherForCity(city);
    elements.searchInput.value = '';
  }
}

// Use current location
function useCurrentLocation() {
  if (navigator.geolocation) {
    showLoading();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        hideLoading();
        showError('Location access denied. Please try searching for a city.');
      }
    );
  } else {
    showError('Geolocation is not supported by your browser');
  }
}

// Get random city
function getRandomCity() {
  const cities = ['London', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Singapore', 'Dubai'];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  loadWeatherForCity(randomCity);
}

// Load weather for a specific city
async function loadWeatherForCity(city) {
  showLoading();
  state.currentCity = city;
  
  try {
    // Get coordinates for the city
    const geoResponse = await fetch(`${GEOCODING_API}?name=${city}&count=1`);
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }
    
    const { latitude, longitude, name, country } = geoData.results[0];
    
    // Fetch weather data
    await fetchWeatherByCoordinates(latitude, longitude, name, country);
    
  } catch (error) {
    hideLoading();
    showError(error.message);
  }
}

// Fetch weather data by coordinates
async function fetchWeatherByCoordinates(latitude, longitude, cityName, country) {
  try {
    // Fetch current weather and forecast
    const response = await fetch(`${API_BASE}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&timezone=auto`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    state.weatherData = data;
    
    // Fetch weather alerts
    await fetchWeatherAlerts(latitude, longitude);
    
    // Update UI
    updateWeatherUI(data, cityName, country);
    updateForecastUI(data);
    updateCharts(data);
    
    hideLoading();
    elements.currentWeatherSection.classList.remove('hidden');
    
  } catch (error) {
    hideLoading();
    showError(error.message);
  }
}

// Fetch weather alerts
async function fetchWeatherAlerts(latitude, longitude) {
  try {
    // Note: Weather.gov API has limitations and may not work for all locations
    // This is a fallback that might not work for international locations
    const alertsResponse = await fetch(`${WEATHER_ALERTS_API}?point=${latitude},${longitude}`);
    if (alertsResponse.ok) {
      const alertsData = await alertsResponse.json();
      displayWeatherAlerts(alertsData.features);
    } else {
      elements.alertsSection.classList.add('hidden');
    }
  } catch (error) {
    // Silently handle alerts errors as they're not critical
    elements.alertsSection.classList.add('hidden');
  }
}

// Display weather alerts
function displayWeatherAlerts(alerts) {
  if (!alerts || alerts.length === 0) {
    elements.alertsSection.classList.add('hidden');
    return;
  }
  
  elements.alertsContainer.innerHTML = '';
  elements.alertsSection.classList.remove('hidden');
  
  alerts.forEach(alert => {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert alert-warning shadow-md p-4 rounded-lg';
    
    const header = document.createElement('div');
    header.className = 'flex justify-between items-start';
    
    const title = document.createElement('h4');
    title.className = 'font-bold text-lg';
    title.textContent = alert.properties.headline;
    
    const severity = document.createElement('span');
    severity.className = `badge ${getSeverityClass(alert.properties.severity)} ml-2`;
    severity.textContent = alert.properties.severity;
    
    header.appendChild(title);
    header.appendChild(severity);
    
    const description = document.createElement('p');
    description.className = 'mt-2 text-sm';
    description.textContent = alert.properties.description;
    
    alertElement.appendChild(header);
    alertElement.appendChild(description);
    elements.alertsContainer.appendChild(alertElement);
  });
}

// Get severity class for badge
function getSeverityClass(severity) {
  switch(severity) {
    case 'Severe': return 'badge-error';
    case 'Moderate': return 'badge-warning';
    case 'Minor': return 'badge-info';
    default: return 'badge-primary';
  }
}

// Update weather UI
function updateWeatherUI(data, cityName, country) {
  const current = data.current;
  const daily = data.daily;
  
  // Update basic info
  elements.cityName.textContent = `${cityName}, ${country}`;
  elements.currentDate.textContent = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Update weather description
  const weatherCode = current.weather_code;
  const weatherInfo = getWeatherInfoFromCode(weatherCode);
  elements.weatherDescription.textContent = weatherInfo.description;
  elements.weatherIcon.className = `fas ${weatherInfo.icon} text-8xl ${weatherInfo.color} mr-4`;
  
  // Update temperature
  elements.temperature.textContent = `${Math.round(current.temperature_2m)}°`;
  elements.feelsLike.textContent = `Feels like ${Math.round(current.apparent_temperature)}°`;
  
  // Update weather details
  elements.windSpeed.textContent = `${current.wind_speed_10m} km/h`;
  elements.humidity.textContent = `${current.relative_humidity_2m}%`;
  elements.visibility.textContent = '10 km'; // Default visibility, in real app would fetch this
  
  // Update UV index (simplified calculation)
  const uvIndex = Math.round(current.weather_code / 10);
  elements.uvIndex.textContent = Math.min(uvIndex, 11);
  
  // Update daily max/min temps
  const maxTemp = Math.round(daily.temperature_2m_max[0]);
  const minTemp = Math.round(daily.temperature_2m_min[0]);
  elements.feelsLike.textContent = `High: ${maxTemp}° | Low: ${minTemp}°`;
}

// Get weather info from WMO code
function getWeatherInfoFromCode(code) {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { icon: 'fa-sun', color: 'text-amber-500', description: 'Clear sky' };
  if (code >= 1 && code <= 3) return { icon: 'fa-cloud-sun', color: 'text-amber-500', description: 'Partly cloudy' };
  if (code >= 4 && code <= 5) return { icon: 'fa-cloud', color: 'text-gray-500', description: 'Cloudy' };
  if (code >= 6 && code <= 8) return { icon: 'fa-cloud-rain', color: 'text-blue-500', description: 'Rain' };
  if (code >= 9 && code <= 11) return { icon: 'fa-cloud-rain', color: 'text-blue-500', description: 'Heavy rain' };
  if (code >= 12 && code <= 15) return { icon: 'fa-snowflake', color: 'text-white', description: 'Snow' };
  if (code >= 16 && code <= 19) return { icon: 'fa-bolt', color: 'text-yellow-500', description: 'Thunderstorm' };
  if (code >= 20 && code <= 29) return { icon: 'fa-smog', color: 'text-gray-400', description: 'Fog' };
  return { icon: 'fa-question', color: 'text-gray-500', description: 'Unknown' };
}

// Update forecast UI
function updateForecastUI(data) {
  elements.forecastContainer.innerHTML = '';
  
  const daily = data.daily;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(daily.time[i]);
    const weatherCode = daily.weather_code[i];
    const weatherInfo = getWeatherInfoFromCode(weatherCode);
    
    const forecastCard = document.createElement('div');
    forecastCard.className = 'weather-card bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-300';
    
    const dayName = days[date.getDay()];
    const dateStr = date.getDate() + '/' + (date.getMonth() + 1);
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    
    forecastCard.innerHTML = `
      <div class="text-lg font-semibold text-gray-700 mb-2">${dayName}</div>
      <div class="text-sm text-gray-500 mb-3">${dateStr}</div>
      <i class="fas ${weatherInfo.icon} text-3xl ${weatherInfo.color} mb-3"></i>
      <div class="text-lg font-bold text-gray-800 mb-1">${maxTemp}°</div>
      <div class="text-sm text-gray-500">${minTemp}°</div>
      <div class="text-xs text-gray-600 mt-2">${weatherInfo.description}</div>
    `;
    
    elements.forecastContainer.appendChild(forecastCard);
  }
}

// Update charts
function updateCharts(data) {
  // Temperature trend chart
  const tempCtx = document.getElementById('temperatureChart');
  if (tempCtx) {
    const maxTemps = data.daily.temperature_2m_max;
    const minTemps = data.daily.temperature_2m_min;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Max Temp (°C)',
            data: maxTemps,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Min Temp (°C)',
            data: minTemps,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Temperature (°C)' }
          }
        }
      }
    });
  }
  
  // Humidity and pressure chart
  const humidityCtx = document.getElementById('humidityChart');
  if (humidityCtx) {
    const humidity = data.daily.relative_humidity_2m;
    const windSpeed = data.daily.wind_speed_10m_max;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    new Chart(humidityCtx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Humidity (%)',
            data: humidity,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3b82f6',
            borderWidth: 1
          },
          {
            label: 'Wind Speed (km/h)',
            data: windSpeed,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: '#10b981',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Value' }
          }
        }
      }
    });
  }
}

// Show loading state
function showLoading() {
  elements.loadingSection.classList.remove('hidden');
  elements.currentWeatherSection.classList.add('hidden');
  elements.searchResultsSection.classList.add('hidden');
  elements.errorSection.classList.add('hidden');
}

// Hide loading state
function hideLoading() {
  elements.loadingSection.classList.add('hidden');
}

// Show error state
function showError(message) {
  elements.errorSection.classList.remove('hidden');
  elements.loadingSection.classList.add('hidden');
  
  const errorText = elements.errorSection.querySelector('.text-error-content');
  if (errorText) {
    errorText.textContent = message;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);