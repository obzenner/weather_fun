import React, { useState, useEffect } from 'react';
import low from 'lowdb';
import { cloneDeep, delay } from 'lodash';
import LocalStorage from 'lowdb/adapters/LocalStorage'
import { tempTreshhold,
	tempHazard,
	humidityTreshhold,
	humidityHazard,
	pressureTreshhold,
	pressureHazard,
	defaultDBState
} from './consts';

/** STYLES */
import { MainContainer,
	AppContainer,
	WeatherInfo,
	UserData,
	ErrorBox,
	Line,
	UserLine,
	Title,
	ImageTitle,
	ResetButton,
	MessageContainer,
	DayMessage,
	WarningMessage,
	EditedMessaged,
	StyledSlider,
	StyledThumb,
	StyledTrack
} from './styles/components';


const Thumb = (props, state) => {
	return <StyledThumb middle={state.index === 1} {...props}>{state.valueNow}</StyledThumb>;
};

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

/**
 * DB init
 */
const dbadapter = new LocalStorage('weatherdb')
const userdb = low(dbadapter);

/**
 * Main APP
 */
function App(props) {
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
	 * REACT STATE HOOKS
	 */
	const [hasError, setErrors] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [fetched, setFetched] = useState(false);
	const [editMessage, showEditMessage] = useState(false);
	const [weatherInfo, setWeatherInfo] = useState(null);
	const { weatherAPI } = props;

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
			weatherAPI().then((res) => {
				setWeatherInfo(res);
				setFetched(true);
			})
			.catch(err => setErrors({
				name: `${err}: cannot connect to API`
			}));
		}

		// if fetched, check if day is good or bad and update UI
		if (fetched) {
			setIsLoading(false);
			checkDay(fetched);
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
		<MainContainer isDayTime={isDayTime} className="App" data-testid="weatherapp">
			{!isLoading && <span><MessageContainer>
				{dayInfo.isHazard && <WarningMessage>!!!WARNING!!!</WarningMessage>}
				<DayMessage goodDay={dayInfo.isGoodDay}>{(dayInfo.isGoodDay ? `Today is epic weather day!`
					: `Bummer, this weather sucks!`)}</DayMessage>
				</MessageContainer>
			</span>}
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
