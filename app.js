// Grab the CSS variables I want to manipulate

const addRemoveBtn = document.querySelector(".add-remove-card");
const searchBar = document.querySelector(".search-bar");
const addCityText = document.querySelector(".add-city");
const cityName = document.querySelector(".city");
const temp = document.querySelector(".display-temp");
const weatherDesc = document.querySelector(".description");
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const weatherGroupSvg = document.querySelector(".weather-group-svg");
const weatherInfo = document.querySelector(".weather-info");
const card = document.querySelector(".card");

// Onclick of the +/x button what changes to the class do I want to make

addRemoveBtn.addEventListener("click", function () {
  // To Reset
  if (!weatherInfo.classList.contains("weather-info--hidden")) {
    weatherInfo.classList.add("weather-info--hidden");
    addCityText.classList.add("add-city--visible");
    addRemoveBtn.classList.remove("is-active");
    searchBar.classList.remove("search-bar--visible");
    searchBar.value = "";
    addCityText.textContent = "Add a City";
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

// If enter is hit in the search bar get the value + pass to getWeather

searchBar.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchBar.classList.remove("search-bar--visible");
    getWeather(searchBar.value);
  }
});

async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    // Fetch the API data
    const response = await fetch(url);

    // City incorrect

    if (!response.ok) {
      searchBar.classList.add("search-bar--visible");
      addCityText.classList.add("add-city--visible");
      addCityText.textContent = "City not found — try again";
      return;
    }
    // Standard Path

    const data = await response.json();

    // Update City

    cityName.textContent = data.name;

    // Update Temp

    temp.textContent = Math.round(data.main.temp) + "°C";

    //Update Desc

    weatherDesc.textContent = data.weather[0].description;
    weatherDesc.textContent =
      weatherDesc.textContent[0].toUpperCase() +
      weatherDesc.textContent.slice(1);

    //Assign API data to SVGS + Update SVGS

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

    const svgPath = "weather/" + svgName + ".svg";

    weatherGroupSvg.src = svgPath;

    // Update day or night

    if (suffix === "n") {
      card.classList.add("is-night");
    } else {
      card.classList.remove("is-night");
    }

    // Update Time

    const localTime = new Date(Date.now() + data.timezone * 1000);
    const hours = localTime.getUTCHours().toString().padStart(2, "0");
    const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");

    time.textContent = `${hours}:${minutes}`;

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

    //Update Date

    date.textContent =
      weekdays[localTime.getUTCDay()] +
      ", " +
      localTime.getUTCDate() +
      " " +
      months[localTime.getUTCMonth()] +
      " " +
      localTime.getUTCFullYear();

    if (weatherInfo.classList.contains("weather-info--hidden")) {
      weatherInfo.classList.remove("weather-info--hidden");
      addCityText.classList.remove("add-city--visible");
    }
  } catch (error) {
    console.log(error);
  }
}
