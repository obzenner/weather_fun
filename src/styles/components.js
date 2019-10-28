import media from '../utils/media';
import styled from 'styled-components';
import ReactSlider from 'react-slider';

/**
 * Component styles for the app
 */
export const MainContainer = styled.div`
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

export const AppContainer = styled.div`
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

export const InfoBox = styled.div`
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

export const WeatherInfo = styled(InfoBox)`
`;

export const UserData = styled(InfoBox)`
	position: relative;
`

export const ErrorBox = styled.div`
	background: red;
	color: #fff;
	padding: 20px;
	font-size: 20px;
	text-align: center;
	border-radius: 20px;
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
`;

export const Line = styled.span`
	position: relative;
	display: flex;
	justify-content: space-between;
`;

export const UserLine = styled(Line)`
	flex-direction: column;
	
`;

export const Title = styled.span`
	font-weight: bold;
	color: #000;
`;

export const ImageTitle = styled.span`
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

export const ResetButton = styled.button`
	width: 100px;
	margin: 15px auto 0;
	background-color: rgb(209, 0, 114);
	color: #fff;
	padding: 5px;
	border-radius: 4px;
	cursor: pointer;
`;

export const MessageContainer = styled.div`
	${media.mediumDown`
		margin: 20px;
	`}
`;

export const DayMessage = styled.h2`
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

export const WarningMessage = styled(DayMessage)`
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

export const EditedMessaged = styled.div`
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
export const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

export const StyledThumb = styled.div`
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

export const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
	background: ${({ index }) => index === 2 ? 'rgb(255, 165, 0)' : index === 1 ? 'rgb(0, 255, 208)' : '#ddd'};
	transition: left 0.1s;
	
	${media.mediumDown`
		transition: none;
	`}
`;