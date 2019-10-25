import React, { useState, useEffect } from 'react';
import low from 'lowdb';
import { cloneDeep, delay } from 'lodash';
import LocalStorage from 'lowdb/adapters/LocalStorage'
import ReactSlider from 'react-slider';
import media from './utils/media';
import styled from 'styled-components';

/**
 * Component styles for the app
 */
const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: center;
	align-items: center;

	${({ isDayTime }) => isDayTime &&`
		background: rgb(34,193,195);
		background: linear-gradient(164deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
	`}

	${({ isDayTime }) => !isDayTime &&`
		background: rgb(2,0,36);
		background: linear-gradient(164deg, rgba(2,0,36,1) 0%, rgba(9,54,121,1) 53%, rgba(0,212,255,1) 100%);
	`}

	background-size: 200% 200%;
	animation: gradientBG 10s ease infinite;

	@keyframes gradientBG {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	${media.mediumDown`
		width: 100%;
		height: auto;
	`}
`;

const AppContainer = styled.div`
	display: flex;
	min-width: 300px;
	padding: 40px 20px;
	margin: 20px;

	h1, h2, h3, h4, h5, h6 {
		text-align: center;
	}

	${( { hasError }) => hasError &&`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`}

	${media.mediumUp`
		width: 800px;
		border-radius: 20px;
		justify-content: space-around;
		align-items: flex-start;
		background: rgb(198,254,255);
		background: linear-gradient(164deg, rgba(198,254,255,1) 0%, rgba(255,254,252,0.3) 100%);

		${( { hasError }) => hasError &&`
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		`}
	`}


	${media.mediumDown`
		padding: 0;
		width: 100%;
		flex-direction: column;
		align-items: center;
	`}
`;

const InfoBox = styled.div`
	h2 {
		margin: 0;
	}

	max-width: 320px;
	background-color: #fff;
	padding: 10px 20px;
	line-height: 2;
	border-radius: 10px;

	${media.mediumUp`
		width: 50%;
	`}

	${media.mediumDown`
		width: 90%;
		margin: 0 0 20px 0;
	`}
`;

const WeatherInfo = styled(InfoBox)`
`;

const UserData = styled(InfoBox)`
	position: relative;
`

const ErrorBox = styled.div`
	background: red;
	color: #fff;
	padding: 20px;
	font-size: 20px;
	text-align: center;
	border-radius: 20px;
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
`;

const Line = styled.span`
	position: relative;
	display: flex;
	justify-content: space-between;
`;

const UserLine = styled(Line)`
	flex-direction: column;
	
`;

const Title = styled.span`
	font-weight: bold;
	color: #000;
`;

const ImageTitle = styled.span`
	width: 100%;
	height: 50px;

	img {
		position: absolute;
		animation: bounce 10s ease infinite;
	}

	@keyframes bounce {
		0% { left: 0%;}
		50%{ left : 85%;}
		100%{ left: 0%;}
	}
`;

const ResetButton = styled.button`
	width: 100px;
	margin: 15px auto 0;
	background-color: rgb(209, 0, 114);
	color: #fff;
	padding: 5px;
	border-radius: 4px;
	cursor: pointer;
`;

const MessageContainer = styled.div`
	${media.mediumDown`
		margin: 20px;
	`}
`;

const DayMessage = styled.h2`
	text-align: center;
	font-family: 'digital-7regular';
	letter-spacing: 20;
	font-size: 80px;
	margin: 40px 0;
	color: #ffff00;
	text-shadow: 0px 0px 20px #ffff00, 0px 0px 8px #ffff00;
	transition: color 0.2s;

	${media.mediumDown`
		font-size: 50px;
		margin: 0;
	`}

	${({ goodDay }) => !goodDay &&`
		color: red;
		text-shadow: 0px 0px 20px blue, 0px 0px 8px blue;
	`}
`;

const WarningMessage = styled(DayMessage)`
	color: yellow;
	margin: 0 0 20px 0;
	font-size: 40px;
	text-shadow: 0px 0px 20px red, 0px 0px 8px red;
	animation: blink 0.5s infinite;

	${media.mediumUp`
		font-size: 60px;
	`}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
`;

const EditedMessaged = styled.div`
	position: absolute;
    top: 0;
	right: 0;
	font-size: 8px;
	background: rgb(9, 121, 92);
	max-width: 90px;
	text-align: center;
	margin: 0 auto;
	padding: 0px 10px;
	color: #fff;
`;

/**
 * React Slider styles
 */
const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    min-width: 25px;
    text-align: center;
    background-color: ${( { middle }) => middle ? 'rgb(209, 0, 114)' : '#000'};
    color: #fff;
	cursor: grab;
	font-size: 10px;
	padding: 0 2px;
	border-radius: 4px;
	transition: left 0.1s;

	${media.mediumDown`
		transition: none;
	`}
`;

const Thumb = (props, state) => {
	return <StyledThumb middle={state.index === 1} {...props}>{state.valueNow}</StyledThumb>;
};

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
	background: ${({ index }) => index === 2 ? 'rgb(255, 165, 0)' : index === 1 ? 'rgb(0, 255, 208)' : '#ddd'};
	transition: left 0.1s;
	
	${media.mediumDown`
		transition: none;
	`}
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;


/**
 * App consts
 */
const apiUrl = (lat, lon) => `https://openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=b6907d289e10d714a6e88b30761fae22`;

// Hardcoding these, but this can also be set by UI, of course
const tempTreshhold = 10;
const tempHazard = 50;

const humidityTreshhold = 20;
const humidityHazard = 130;

const pressureTreshhold = 300;
const pressureHazard = 2000;

const defaultDBState = { userWeather: {
	temp: [-60, 20, 60],
	pressure: [800, 1000, 2000],
	humidity: [0, 50, 150]
}};

/**
 * DB init
 */
const dbadapter = new LocalStorage('weatherdb')
const userdb = low(dbadapter);

/**
 * Main APP
 */
function App() {
	/**
	 * Database methods
	 */
	function checkDb() {
		return userdb.getState();
	}
	// set default values if DB is empty
	function setDefaultDBValues() {
		userdb.setState(cloneDeep(defaultDBState)).write();
		return checkDb();
	}

	// resets user data back to defaults
	function resetUserData() {
		setUserWeather(setDefaultDBValues());
		checkDay('reset');
	}

	/**
	 * API methods
	 */
	async function fetchWeatherFromAPI(coords) {
		const { latitude, longitude } = coords;
		const response = await fetch(apiUrl(latitude, longitude));
		response
			.json()
			.then(res => {
				setWeatherInfo(res);
				setFetched(true);
			})
			.catch(err => setErrors({
				name: `cannot connect to API`
			}));
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
		await fetchWeatherFromAPI(position.coords);
	}

	/**
	 * REACT STATE HOOKS
	 */
	const [hasError, setErrors] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [fetched, setFetched] = useState(false);
	const [editMessage, showEditMessage] = useState(false);
	const [weatherInfo, setWeatherInfo] = useState(null);

	// get user state from db or load default values
	const initUserInfoFromDB = checkDb();
	const userWeatherFromDB = (Object.keys(initUserInfoFromDB).length > 0 && initUserInfoFromDB) || setDefaultDBValues();
	const [userWeatherState, setUserWeather] = useState(userWeatherFromDB);

	const [dayInfo, setDay] = useState({});

	// Simple background load logic based on time of day
	const hours = (new Date()).getHours();
	const isDayTime = hours > 6 && hours < 20;

	// REACT: set init state based on API response which is based on lat/log info from navigator geolocation
	useEffect(() => {
		if (!navigator || !navigator.geolocation) {
			setErrors({
				name: `Your browser does not support this app`
			})
			return;
		}

		// if not fetchedd, fetch weather from API
		if (!fetched) {
			weatherDataFromAPI();
		}

		// if fetched, check if day is good or bad and update UI
		if (fetched) {
			setIsLoading(false);
			checkDay();
		}

	}, [fetched, userWeatherState])
	
	/**
	 * Helper methods for day state calc
	 */
	function showEditedMessage() {
		showEditMessage(true);
		delay(() => showEditMessage(false), 1000)
	}

	function setTemperature(data) {
		userdb.set('userWeather.temp', data).write();
		checkDay('reset');
	}


	function setHumidity(data) {
		userdb.set('userWeather.humidity', data).write();
		checkDay('reset');
	}

	function setPressure(data) {
		userdb.set('userWeather.pressure', data).write();
		checkDay('reset');
	}

	function calcGoodDay(tempDiff, pressureDiff, humidityDiff) {
		return (Math.abs(tempDiff) < tempTreshhold) && (Math.abs(pressureDiff) < pressureTreshhold) && (Math.abs(humidityDiff) < humidityTreshhold);
	}

	function calcHazard(temp, pressure, humidity) {
		return ((tempHazard - temp) < tempTreshhold) || ((pressureHazard - pressure) < pressureTreshhold) || ((humidityHazard - humidity) < humidityTreshhold);
	}

	function checkDay(reset) {
		const { main } = weatherInfo;
		const { userWeather } = userWeatherState;
		
		const isGoodDay = calcGoodDay(main.temp - userWeather.temp[1],
			main.pressure - userWeather.pressure[1],
			main.humidity - userWeather.humidity[1]);
		const isHazard = calcHazard(userWeather.temp[1], userWeather.pressure[1], userWeather.humidity[1]);

		reset && showEditedMessage();

		setDay({
			isGoodDay,
			isHazard
		});
	}

	return (
		<MainContainer isDayTime={isDayTime} className="App">
			{!isLoading && <MessageContainer>
				{!isLoading && dayInfo.isHazard && <WarningMessage>!!!WARNING!!!</WarningMessage>}
				{!isLoading && <DayMessage goodDay={dayInfo.isGoodDay}>{(dayInfo.isGoodDay ? `Today is epic weather day!`
					: `Bummer, this weather sucks!`)}</DayMessage>}
			</MessageContainer>}
			<AppContainer hasError={hasError}>
				{!hasError && isLoading && <WeatherInfo>
					<Line>Loading weather data...</Line>
				</WeatherInfo>}
				{!hasError && !isLoading && <WeatherInfo>
					<Line><h2>Weather in your location</h2></Line>
					<Line>
						<ImageTitle>
							<img alt="current-weather-icon" src={`http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`} />
						</ImageTitle>
					</Line>
					<Line><Title>You're in:</Title> <i>{weatherInfo.name}, {weatherInfo.sys.country}</i></Line>
					<Line><Title>Temperature: </Title>{weatherInfo.main.temp} C</Line>
					<Line><Title>Pressure: </Title>{weatherInfo.main.pressure} hPa</Line>
					<Line><Title>Humidity: </Title>{weatherInfo.main.humidity} %</Line>
				</WeatherInfo>}
				{!hasError && !isLoading && Object.keys(userWeatherState).length > 0 && <UserData>
					<h2>Your perfect weather</h2>
					<UserLine>
						<Title>Temperature: </Title>
						<StyledSlider
							defaultValue={userWeatherState.userWeather.temp}
							value={userWeatherState.userWeather.temp}
							renderTrack={Track}
							renderThumb={Thumb}
							max={60}
							min={-60}
							minDistance={10}
							onChange={setTemperature}
						/>
					</UserLine>
					<UserLine>
						<Title>Pressure: </Title>
						<StyledSlider
							defaultValue={userWeatherState.userWeather.pressure}
							value={userWeatherState.userWeather.pressure}
							renderTrack={Track}
							renderThumb={Thumb}
							max={2000}
							min={800}
							minDistance={120}
							onChange={setPressure}
						/>
					</UserLine>
					<UserLine>
						<Title>Humidity: </Title>
						<StyledSlider
							defaultValue={userWeatherState.userWeather.humidity}
							value={userWeatherState.userWeather.humidity}
							renderTrack={Track}
							renderThumb={Thumb}
							max={150}
							minDistance={15}
							onChange={setHumidity}
						/>
					</UserLine>
					<UserLine>
						<ResetButton onClick={resetUserData}>Reset</ResetButton>
					</UserLine>
					{editMessage && <EditedMessaged>saved!</EditedMessaged>}
				</UserData>}
				{!hasError && isLoading && <WeatherInfo>
					<Line>Loading your data...</Line>
				</WeatherInfo>}
				{hasError && <ErrorBox>{hasError.name}</ErrorBox>}
			</AppContainer>
		</MainContainer>
	);
}

export default App;
