const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let unit = "metric";

let weatherCards = [];

function createCard() {
  const cardTemplate = document.querySelector(".card--template");
  const clone = cardTemplate.cloneNode(true);
  clone.classList.remove("card--template");

  const addRemoveBtn = clone.querySelector(".add-remove-card");
  const searchBar = clone.querySelector(".search-bar");
  const addCityText = clone.querySelector(".add-city");
  const cityName = clone.querySelector(".city");
  const temp = clone.querySelector(".display-temp");
  const degSymbol = clone.querySelector(".deg");
  const tempValue = clone.querySelector(".temp-value");
  const weatherDesc = clone.querySelector(".description");
  const time = clone.querySelector(".time");
  const date = clone.querySelector(".date");
  const weatherGroupSvg = clone.querySelector(".weather-group-svg");
  const weatherInfo = clone.querySelector(".weather-info");
  const card = clone;

  const elements = {
    btn: addRemoveBtn,
    search: searchBar,
    emptyText: addCityText,
    cityEl: cityName,
    tempEl: temp,
    degEl: degSymbol,
    tempValueEl: tempValue,
    descEl: weatherDesc,
    svgEl: weatherGroupSvg,
    timeEl: time,
    dateEl: date,
    weatherInfo: weatherInfo,
    clone: card,
  };

  weatherCards.push(elements);

  addRemoveBtn.addEventListener("click", function () {
    // To Reset

    if (!weatherInfo.classList.contains("weather-info--hidden")) {
      weatherInfo.classList.add("weather-info--hidden");
      addCityText.classList.add("add-city--visible");
      addRemoveBtn.classList.remove("is-active");
      searchBar.classList.remove("search-bar--visible");
      searchBar.value = "";
      addCityText.textContent = "Add a City";
      addRemoveBtn.focus();
      let cityToRemove = elements.clone.dataset.city;
      if (cityToRemove) {
        let savedCities = JSON.parse(
          localStorage.getItem("weather_cities") || "[]",
        );
        savedCities = savedCities.filter(function (c) {
          return c !== cityToRemove;
        });
        localStorage.setItem("weather_cities", JSON.stringify(savedCities));
        delete elements.clone.dataset.city;
        delete elements.clone.dataset.timezone;
      }
      elements.clone.classList.add("is-night");
      return;
    }

    // When searching

    if (searchBar.classList.contains("search-bar--visible")) {
      searchBar.classList.remove("search-bar--visible");
      addRemoveBtn.classList.remove("is-active");
      addCityText.classList.add("add-city--visible");
    } else {
      // When Resetting

      addRemoveBtn.classList.add("is-active");
      searchBar.classList.add("search-bar--visible");
      addCityText.classList.remove("add-city--visible");
      searchBar.focus();
    }
  });

  searchBar.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      searchBar.classList.remove("search-bar--visible");

      getWeather(searchBar.value, elements);
    }
  });

  return clone;
}

async function getWeather(city, elements) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
    // Fetch the API data
    const response = await fetch(url);

    // City incorrect

    if (!response.ok) {
      elements.search.classList.add("search-bar--visible");
      elements.emptyText.classList.add("add-city--visible");
      elements.emptyText.textContent = "City not found — try again";
      return;
    }
    // Standard Path

    const data = await response.json();

    // Update City

    elements.cityEl.textContent = data.name;
    elements.clone.dataset.city = data.name;
    let cities = JSON.parse(localStorage.getItem("weather_cities") || "[]");
    if (!cities.includes(data.name)) {
      cities.push(data.name);
      localStorage.setItem("weather_cities", JSON.stringify(cities));
    }
    // Update Temp

    elements.tempValueEl.textContent = Math.round(data.main.temp);
    elements.degEl.textContent = unit === "metric" ? "°C" : "°F";

    // Update Desc

    elements.descEl.textContent = data.weather[0].description;
    elements.descEl.textContent =
      elements.descEl.textContent[0].toUpperCase() +
      elements.descEl.textContent.slice(1);

    // Assign API data to SVGS + Update SVGS

    const weatherGroup = data.weather[0].main;
    const suffix = data.weather[0].icon.at(-1);

    const svgMap = {
      Clear: "Clear",
      Clouds: "Cloudy",
      Rain: "Rain",
      Snow: "Snow",
      Drizzle: "Drizzle",
      Thunderstorm: "Thunder",
      Mist: "Mist",
      Smoke: "Mist",
      Fog: "Mist",
      Haze: "Mist",
      Dust: "Mist",
    };

    let svgName = svgMap[weatherGroup];

    if (weatherGroup === "Clear") {
      svgName = svgName + "-" + suffix;
    }

    const svgPath = "/assets/weather/" + svgName + ".svg";

    elements.svgEl.src = svgPath;
    elements.svgEl.alt =
      data.weather[0].description.charAt(0).toUpperCase() +
      data.weather[0].description.slice(1);

    // Update day or night

    if (suffix === "n") {
      elements.clone.classList.add("is-night");
    } else {
      elements.clone.classList.remove("is-night");
    }

    // Update Time

    updateTimeDisplay(data.timezone, elements.timeEl);
    elements.clone.dataset.timezone = data.timezone;

    // Update Date

    updateDateDisplay(data.timezone, elements.dateEl);

    if (elements.weatherInfo.classList.contains("weather-info--hidden")) {
      elements.weatherInfo.classList.remove("weather-info--hidden");
      elements.emptyText.classList.remove("add-city--visible");
      elements.btn.classList.add("is-active");
    }
  } catch (error) {
    console.log(error);
  }
}

// Helper function update time
function updateTimeDisplay(offset, timeEl) {
  let localTime = new Date(Date.now() + offset * 1000);
  let hours = localTime.getUTCHours().toString().padStart(2, "0");
  let minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
  timeEl.textContent = hours + ":" + minutes;
}

// Helper function update date

function updateDateDisplay(offset, dateEl) {
  let localTime = new Date(Date.now() + offset * 1000);
  dateEl.textContent =
    weekdays[localTime.getUTCDay()] +
    ", " +
    localTime.getUTCDate() +
    " " +
    months[localTime.getUTCMonth()] +
    " " +
    localTime.getUTCFullYear();
}

const app = document.querySelector(".app");

for (let i = 0; i < 8; i++) {
  const card = createCard();
  app.appendChild(card);
}

setInterval(updateClocks, 60000);

function updateClocks() {
  let cards = document.querySelectorAll(".card[data-timezone]");

  cards.forEach(function (card) {
    let timeEl = card.querySelector(".time");
    let offset = parseInt(card.dataset.timezone, 10);
    let dateEl = card.querySelector(".date");
    updateTimeDisplay(offset, timeEl);
    updateDateDisplay(offset, dateEl);
  });
}

setInterval(refreshWeather, 600000);

function refreshWeather() {
  weatherCards.forEach(function (elements) {
    if (elements.clone.dataset.city) {
      getWeather(elements.clone.dataset.city, elements);
    }
  });
}

const unitToggle = document.getElementById("unit-toggle-input");

unitToggle.addEventListener("change", function () {
  unit = this.checked ? "imperial" : "metric";
  localStorage.setItem("weather_unit", unit);
  weatherCards.forEach(function (elements) {
    if (elements.clone.dataset.city) {
      getWeather(elements.clone.dataset.city, elements);
    }
  });
});

const themeToggle = document.getElementById("theme-toggle-input");

themeToggle.addEventListener("change", function () {
  document.body.classList.toggle("is-dark", this.checked);
  localStorage.setItem("weather_dark", this.checked);
});

function loadSavedData() {
  // 1. Restore dark mode
  let darkSaved = localStorage.getItem("weather_dark");
  if (darkSaved === "true") {
    document.getElementById("theme-toggle-input").checked = true;
    document.body.classList.add("is-dark");
  }

  // 2. Restore unit
  let unitSaved = localStorage.getItem("weather_unit");
  if (unitSaved) {
    unit = unitSaved;
    if (unit === "imperial") {
      document.getElementById("unit-toggle-input").checked = true;
    }
  }

  // 3. Restore cities
  let cities = JSON.parse(localStorage.getItem("weather_cities") || "[]");
  let cardIndex = 0;
  cities.forEach(function (city) {
    if (weatherCards[cardIndex]) {
      getWeather(city, weatherCards[cardIndex]);
      cardIndex++;
    }
  });
}

loadSavedData();
