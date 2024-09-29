const userInput = document.getElementById("user-input");
const searchButton = document.getElementById("search-button");
const weatherDiv = document.getElementById("weather");
const myKey = "f9efe2c13685c17cc78016edd4183921";

const showLoading = () => {
    weatherDiv.innerHTML = '<div class="loading">Loading...</div>';
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
        showLoading();

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${myKey}`);
        const data = await response.json();
        displayWeather(data);
    }
}

function displayWeather(data) {
    if (data.cod == 200) {
        const temperatureHandle = data?.main?.temp - 273;
        const weatherIcon = data?.weather[0]?.icon;

        weatherDiv.innerHTML = `
            <div class="card">
                <h2> ${data?.name} <sup> ${data?.sys?.country} </sup> </h2>
                <i class="fas fa-cloud-sun weather-icon"></i>
                <h4>Temperature: ${Math.round(temperatureHandle)} °C</h4>
                <p>Weather: ${data?.weather[0]?.description}</p>
                <p>Wind Speed: ${data?.wind?.speed} m/s</p>
            </div>`;
    } else {
        weatherDiv.innerHTML = `<p>Not Found</p>`;
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        getWeather(lat, long);
    });
}

searchButton.addEventListener('click', searchWeather);
