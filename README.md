# CPU MONITOR

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), it uses [Material UI (MUI)](https://material-ui.com/), [Express](https://expressjs.com/) and [D3](https://d3js.org/)

The monitor's purpose is to display the current CPU load average with a chart and notify the user in case of high load average reached during x min.
The high load limit, the time needed to consider a high load / recovery time and the window history are configurable in the code (in file src/data/reducers/ConfigContext.jsx) and will be soon available in the settings panel.

## Install

`npm i`

## Run using npm run all to start Express server and react App

`npm run dev`

NB: This is a project running on unix only so far.
