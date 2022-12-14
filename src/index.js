function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2">
        <div class="weather-forecast-day">${formatDay(forecastDay.time)}</div>
        <div class="weather-forecast-icon">
            <img
                src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png"
                alt="Snow"
                width="40"
                />
            </div>
        <div class="weather-forecast-temperature">
        <span class="temperature-max">${Math.round(
          forecastDay.temperature.maximum
        )}º</span>
        <span class="temperature-min">${Math.round(
          forecastDay.temperature.minimum
        )}º</span>
        </div>
    </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "ae183e1c92o08fb1071d0e97f254bdtd";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  celsiusTemperature = response.data.temperature.current;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.city;

  let countryElement = document.querySelector("#country");
  countryElement.innerHTML = response.data.country;

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.condition.description;

  let feelsLike = Math.round(response.data.temperature.feels_like);
  let feelsLikeElement = document.querySelector("#feelsLike");
  feelsLikeElement.innerHTML = `Feels like: ${feelsLike}°C`;

  let humidity = Math.round(response.data.temperature.humidity);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `Humidity: ${humidity}%`;

  let wind = Math.round(response.data.wind.speed);
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `Wind: ${wind} km/h`;

  let nowElement = document.querySelector("#now");
  nowElement.innerHTML = formatDate(response.data.time * 1000);

  let weatherIconElement = document.querySelector("#weather-icon");
  //deleted code link
  // weatherIconElement.setAttribute(
  // "src",
  // `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  //);

  weatherIconElement.setAttribute("src", response.data.condition.icon_url);
  weatherIconElement.setAttribute("alt", response.data.condition.icon);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "ae183e1c92o08fb1071d0e97f254bdtd";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

//show current location
function handlePosition(position) {
  let myLatitude = position.coords.latitude;
  let myLongitude = position.coords.longitude;
  let apiKey = "ae183e1c92o08fb1071d0e97f254bdtd";
  let unit = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${myLongitude}&lat=${myLatitude}&key=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(displayWeatherCondition);
}

function setCurrentLocation() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}
//end location

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

//location buttton call
let currentLocationSearch = document.querySelector("button.location-button");
currentLocationSearch.addEventListener("click", setCurrentLocation);
//location button call end

search("Frankfurt");
displayForecast();
