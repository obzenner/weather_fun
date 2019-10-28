import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { apiUrl } from './consts';

/**
 * API methods
 */
async function fetchWeatherFromAPI(coords) {
    const { latitude, longitude } = coords;
    const response = await fetch(apiUrl(latitude, longitude));
    return response.json()
        .catch(err => `${err}: cannot connect to API`);
}

// Getting coordinates from navigator
function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

// Combined async call for coordinates and weather API
async function weatherDataFromAPI() {
    const position = await getPosition();
    return await fetchWeatherFromAPI(position.coords);
}

ReactDOM.render(<App weatherAPI={weatherDataFromAPI} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
