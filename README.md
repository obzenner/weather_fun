## Description

This is a simple app that fetches weather data from [Open Weather Map](https://openweathermap.org/api) and compares it with user settings of a perfect day.

- upon init it checks the time of the day and sets the background based on it
- uses `lowdb` for localstorage
- user can reset DB to default values

## Tech details

- uses [Create React App](https://github.com/facebook/create-react-app)
- implemented on node`v10.15.3`on macOS Mojave, `v10.14.6`
- `yarn`
- `lowdb`


### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.