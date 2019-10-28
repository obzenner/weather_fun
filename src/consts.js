/**
 * App consts
 */
export const apiUrl = (lat, lon) =>
	`https://openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=b6907d289e10d714a6e88b30761fae22`;

// Hardcoding these, but this can also be set by UI, of course
export const tempTreshhold = 10;
export const tempHazard = 50;

export const humidityTreshhold = 20;
export const humidityHazard = 130;

export const pressureTreshhold = 300;
export const pressureHazard = 2000;

export const defaultDBState = { userWeather: {
	temp: [-60, 20, 60],
	pressure: [800, 1000, 2000],
	humidity: [0, 50, 150]
}};