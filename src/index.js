import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RequestProvider from "./context/RequestStatusContext";
import ConfigProvider from "./reducers/ConfigContext";
import DataProvider from "./reducers/DataContext";
import DataTreatment from "./DataTreatment";

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <RequestProvider>
    <ConfigProvider>
      <DataProvider>
      <DataTreatment/>
      <App />
      </DataProvider>
    </ConfigProvider>
    </RequestProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
