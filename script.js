const userInput = document.getElementById("user-input");
const searchButton = document.getElementById("search-button");
const weatherDiv = document.getElementById("weather");
const myKey = "f9efe2c13685c17cc78016edd4183921";
let isCelsius = true; // Default unit is Celsius

const showLoading = () => {
    weatherDiv.innerHTML = '<div class="loading">Loading...</div>';
};

// Function to toggle between Celsius and Fahrenheit
const toggleTemperature = () => {
    isCelsius = !isCelsius;
    const location = userInput.value.trim();
    if (location) {
        searchWeather(); // Refresh weather data with new unit
    }
};

async function getWeather(lat, long) {
    showLoading();

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${myKey}`);
    const data = await response.json();
    displayWeather(data);
}

async function searchWeather() {
    const location = userInput.value.trim();
    
    if (location == "") {
        alert("Please enter a location.");
        return;
    }

    if (location) {
        localStorage.setItem('lastLocation', location); // Save last searched location
        showLoading();

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${myKey}`);
        const data = await response.json();
        displayWeather(data);
    }
}

function displayWeather(data) {
    if (data.cod == 200) {
        const tempInKelvin = data?.main?.temp;
        const tempInCelsius = tempInKelvin - 273.15;
        const tempInFahrenheit = (tempInCelsius * 9 / 5) + 32;
        const temperature = isCelsius ? Math.round(tempInCelsius) : Math.round(tempInFahrenheit);

        const weatherIcon = data?.weather[0]?.icon;
        const date = new Date().toLocaleString();

        weatherDiv.innerHTML = `
            <div class="card">
                <h2> ${data?.name} <sup> ${data?.sys?.country} </sup> </h2>
                <i class="fas fa-cloud-sun weather-icon"></i>
                <h4>Temperature: ${temperature} °${isCelsius ? 'C' : 'F'}</h4>
                <p>Weather: ${data?.weather[0]?.description}</p>
                <p>Wind Speed: ${data?.wind?.speed} m/s</p>
                <p>Updated: ${date}</p>
            </div>
            <button id="temp-toggle">Switch to ${isCelsius ? 'Fahrenheit' : 'Celsius'}</button>
        `;

        const tempToggleButton = document.getElementById("temp-toggle");
        tempToggleButton.addEventListener('click', toggleTemperature);
    } else {
        weatherDiv.innerHTML = `<p>Not Found</p>`;
    }
}

// Get user's current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        getWeather(lat, long);
    });
}

searchButton.addEventListener('click', searchWeather);
