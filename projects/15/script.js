// Wait for Lucide to load before initializing
const initApp = () => {
    if (typeof lucide === 'undefined') {
        setTimeout(initApp, 100);
        return;
    }

    // Initialize Lucide Icons
    lucide.createIcons();

    // State Management
    const state = {
        city: 'New York',
        unit: 'imperial', // 'metric' (C) or 'imperial' (F)
        theme: 'light',
        weatherData: null
    };

    // DOM Elements
    const elements = {
        searchInput: document.getElementById('city-search'),
        searchBtn: document.getElementById('search-btn'),
        themeToggle: document.getElementById('theme-toggle'),
        locationName: document.getElementById('location-name'),
        currentDate: document.getElementById('current-date'),
        lastUpdated: document.getElementById('last-updated'),
        mainTemp: document.getElementById('main-temp'),
        mainCondition: document.getElementById('main-condition'),
        tempLarge: document.getElementById('temp-large'),
        humidity: document.getElementById('humidity'),
        windSpeed: document.getElementById('wind-speed'),
        uvIndex: document.getElementById('uv-index'),
        sunrise: document.getElementById('sunrise'),
        sunset: document.getElementById('sunset'),
        aqiValue: document.getElementById('aqi-value'),
        forecastBody: document.getElementById('forecast-body'),
        tempChartCtx: document.getElementById('tempChart').getContext('2d'),
        rainChartCtx: document.getElementById('rainChart').getContext('2d')
    };

    // Mock Data Generator (Simulating API)
    const generateWeatherData = (city) => {
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Partly Cloudy'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const baseTemp = Math.floor(Math.random() * 20) + 10; // 10-30C
        
        return {
            city: city,
            country: 'US',
            temp: baseTemp,
            condition: condition,
            high: baseTemp + 5,
            low: baseTemp - 4,
            humidity: Math.floor(Math.random() * 40) + 40,
            wind: Math.floor(Math.random() * 20) + 5,
            uv: Math.floor(Math.random() * 10),
            aqi: Math.floor(Math.random() * 50) + 10,
            sunrise: '6:23 AM',
            sunset: '8:14 PM',
            hourly: Array.from({length: 24}, (_, i) => ({
                time: `${i}:00`,
                temp: baseTemp + Math.sin(i / 3) * 5,
                rain: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0
            })),
            forecast: Array.from({length: 7}, (_, i) => {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const today = new Date().getDay();
                return {
                    day: days[(today + i) % 7],
                    condition: conditions[Math.floor(Math.random() * conditions.length)],
                    high: baseTemp + Math.floor(Math.random() * 5),
                    low: baseTemp - Math.floor(Math.random() * 5),
                    precip: Math.floor(Math.random() * 100),
                    wind: Math.floor(Math.random() * 15)
                };
            })
        };
    };

    // Chart Initialization
    let tempChart, rainChart;

    const initCharts = (data) => {
        // Destroy existing charts if they exist
        if (tempChart) tempChart.destroy();
        if (rainChart) rainChart.destroy();

        const labels = data.hourly.map(h => h.time);
        const tempData = data.hourly.map(h => h.temp);
        const rainData = data.hourly.map(h => h.rain);

        // Temperature Chart
        tempChart = new Chart(elements.tempChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: tempData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { grid: { color: 'rgba(0,0,0,0.05)' } }
                }
            }
        });

        // Rain Chart
        rainChart = new Chart(elements.rainChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Precipitation (mm)',
                    data: rainData,
                    backgroundColor: '#06b6d4',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { grid: { color: 'rgba(0,0,0,0.05)' } }
                }
            }
        });
    };

    // UI Updates
    const updateUI = (data) => {
        // Header
        elements.locationName.textContent = `${data.city}, ${data.country}`;
        elements.currentDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        elements.lastUpdated.textContent = 'Just now';

        // Main Card
        const tempDisplay = state.unit === 'metric' ? Math.round(data.temp) + '°C' : Math.round((data.temp * 9/5) + 32) + '°F';
        elements.mainTemp.textContent = tempDisplay;
        elements.tempLarge.textContent = state.unit === 'metric' ? Math.round(data.temp) + '°' : Math.round((data.temp * 9/5) + 32) + '°';
        elements.mainCondition.textContent = data.condition;
        
        // Stats
        elements.humidity.textContent = `${data.humidity}%`;
        elements.windSpeed.textContent = `${data.wind} km/h`;
        elements.uvIndex.textContent = `${data.uv} ${data.uv > 5 ? 'High' : 'Moderate'}`;
        
        // Sun & Air
        elements.sunrise.textContent = data.sunrise;
        elements.sunset.textContent = data.sunset;
        elements.aqiValue.textContent = data.aqi;
        
        // Forecast Table
        elements.forecastBody.innerHTML = data.forecast.map(day => `
            <tr class="hover">
                <td class="font-bold">${day.day}</td>
                <td>
                    <div class="flex items-center gap-2">
                        <i data-lucide="${getWeatherIcon(day.condition)}" class="w-5 h-5 text-primary"></i>
                        ${day.condition}
                    </div>
                </td>
                <td>${state.unit === 'metric' ? day.high + '°' : Math.round((day.high * 9/5) + 32) + '°'}</td>
                <td>${state.unit === 'metric' ? day.low + '°' : Math.round((day.low * 9/5) + 32) + '°'}</td>
                <td>
                    <div class="flex items-center gap-1 text-blue-500">
                        <i data-lucide="droplets" class="w-3 h-3"></i> ${day.precip}%
                    </div>
                </td>
                <td>${day.wind} km/h</td>
            </tr>
        `).join('');

        // Re-initialize icons for new elements
        lucide.createIcons();
        
        // Update Charts
        initCharts(data);
    };

    const getWeatherIcon = (condition) => {
        const map = {
            'Sunny': 'sun',
            'Cloudy': 'cloud',
            'Rainy': 'cloud-rain',
            'Stormy': 'cloud-lightning',
            'Partly Cloudy': 'cloud-sun'
        };
        return map[condition] || 'cloud';
    };

    // Event Listeners
    elements.searchBtn.addEventListener('click', () => {
        const query = elements.searchInput.value.trim();
        if (query) {
            state.city = query;
            const data = generateWeatherData(state.city);
            state.weatherData = data;
            updateUI(data);
            elements.searchInput.value = '';
        }
    });

    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') elements.searchBtn.click();
    });

    elements.themeToggle.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
    });

    // Initialization
    const init = () => {
        const data = generateWeatherData(state.city);
        state.weatherData = data;
        updateUI(data);
    };

    // Run immediately
    init();
};

// Start the app
initApp();