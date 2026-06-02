# Weather Dashboard

A vanilla JavaScript weather dashboard built with HTML, CSS, and JS — no frameworks, no build tools.

## Overview

8 city weather cards arranged in a 3×3 grid (logo centered). Add cities, view live weather data, and see dynamic backgrounds that respond to weather type and time of day.

**Desktop** — 3×3 grid layout
**Mobile** — single column, logo on top

## Features

- Add cities via search
- Displays temperature (°C / °F toggle), city name, local date & time, and weather description
- Dynamic backgrounds: weather-type SVGs (rain, snow, clear, etc.)
- Day/night adaptive backgrounds (blue / black)
- Interactive "+" button that rotates to "×" to reveal the search panel
- Configurable date format (DD/MM or MM/DD)
- Responsive design — desktop grid to mobile single column
- 8 city slots, 1 logo card — all driven by JavaScript

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, transitions)
- Vanilla JavaScript (ES6+ — fetch, async/await, DOM manipulation)
- Weather API ([OpenWeatherMap](https://openweathermap.org/api) — free tier)

## What this demonstrates

- **API integration** — fetching and parsing live weather data
- **DOM manipulation** — dynamically creating, updating, and removing elements
- **Event handling** — click events, animations, search interaction, unit toggle
- **Responsive CSS** — media queries, grid layouts, mobile-first thinking
- **JavaScript replication pattern** — building one component, then scaling with JS
- **Async JavaScript** — promises, async/await, error handling for API calls
- **State management** — tracking unit preference, date format, and per-card state

## Getting Started

1. Clone the repo
2. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
3. Create a `config.js` file (gitignored) with your API key
4. Open `index.html` in your browser

No build tools, no install step — just open and go.
