// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const resultContainer = document.getElementById('resultContainer');

// Initialize Lucide Icons safely
const initIcons = () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

// Initialize on load
initIcons();

// Mock Data Generator
const generateMockWeather = (city) => {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Partly Cloudy', 'Windy'];
    const temps = {
        'Sunny': { min: 20, max: 35 },
        'Cloudy': { min: 15, max: 25 },
        'Rainy': { min: 10, max: 18 },
        'Stormy': { min: 12, max: 20 },
        'Partly Cloudy': { min: 18, max: 28 },
        'Windy': { min: 8, max: 15 }
    };

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const tempRange = temps[condition];
    const temp = Math.floor(Math.random() * (tempRange.max - tempRange.min + 1)) + tempRange.min;
    const humidity = Math.floor(Math.random() * (90 - 30 + 1)) + 30;

    return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        temp,
        condition,
        humidity,
        wind: Math.floor(Math.random() * 20) + 5
    };
};

// Async Mock Fetch Function
const fetchWeatherData = async (city) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (city.toLowerCase() === 'error') {
                reject(new Error('City not found or service unavailable.'));
            } else {
                resolve(generateMockWeather(city));
            }
        }, 2000); // 2 second simulated delay
    });
};

// UI State Handlers
const setLoading = (isLoading) => {
    if (isLoading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        searchBtn.disabled = true;
        searchBtn.classList.add('btn-disabled');
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        searchBtn.disabled = false;
        searchBtn.classList.remove('btn-disabled');
    }
};

const renderSuccess = (data) => {
    // Determine icon based on condition
    let iconClass = 'cloud';
    if (data.condition === 'Sunny') iconClass = 'sun';
    if (data.condition === 'Rainy' || data.condition === 'Stormy') iconClass = 'cloud-rain';
    if (data.condition === 'Windy') iconClass = 'wind';

    resultContainer.innerHTML = `
        <div class="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden animate-fade-in-up">
            <figure class="bg-gradient-to-r from-primary to-secondary h-32 relative">
                <div class="absolute inset-0 bg-black/10"></div>
                <i data-lucide="${iconClass}" class="w-24 h-24 text-white/20 absolute -bottom-4 -right-4"></i>
            </figure>
            <div class="card-body items-center text-center">
                <h2 class="card-title text-3xl font-bold mb-1">${data.city}</h2>
                <div class="badge badge-lg badge-ghost mb-4">${data.condition}</div>
                
                <div class="flex items-end gap-2 mb-6">
                    <span class="text-6xl font-black text-primary">${data.temp}°</span>
                    <span class="text-xl text-base-content/60 mb-2">Celsius</span>
                </div>

                <div class="grid grid-cols-2 gap-4 w-full">
                    <div class="stat bg-base-200 rounded-box p-2">
                        <div class="stat-figure text-secondary">
                            <i data-lucide="droplets" class="w-6 h-6"></i>
                        </div>
                        <div class="stat-title text-xs">Humidity</div>
                        <div class="stat-value text-secondary text-2xl">${data.humidity}%</div>
                    </div>
                    <div class="stat bg-base-200 rounded-box p-2">
                        <div class="stat-figure text-accent">
                            <i data-lucide="wind" class="w-6 h-6"></i>
                        </div>
                        <div class="stat-title text-xs">Wind Speed</div>
                        <div class="stat-value text-accent text-2xl">${data.wind} km/h</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    initIcons();
};

const renderError = (message) => {
    resultContainer.innerHTML = `
        <div role="alert" class="alert alert-error shadow-lg animate-shake">
            <i data-lucide="alert-circle" class="w-6 h-6"></i>
            <div>
                <h3 class="font-bold">Search Failed</h3>
                <div class="text-xs">${message}</div>
            </div>
            <button class="btn btn-sm btn-ghost" onclick="this.parentElement.remove()">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    initIcons();
};

// Main Event Handler
const handleSearch = async () => {
    const city = cityInput.value.trim();
    
    if (!city) {
        cityInput.focus();
        cityInput.classList.add('input-error');
        setTimeout(() => cityInput.classList.remove('input-error'), 2000);
        return;
    }

    // Reset UI
    resultContainer.classList.add('hidden');
    setLoading(true);

    try {
        const data = await fetchWeatherData(city);
        renderSuccess(data);
        resultContainer.classList.remove('hidden');
    } catch (error) {
        renderError(error.message);
        resultContainer.classList.remove('hidden');
    } finally {
        setLoading(false);
    }
};

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Add custom animations via style injection for this specific file scope
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
`;
document.head.appendChild(style);