import React from 'react';
import ReactDOM from 'react-dom';
import RequestProvider from './data/context/RequestStatusContext';
import ThemeProvider from './data/context/ThemeContext';
import NotificationProvider from './data/reducers/NotificationContext';
import ConfigProvider from './data/reducers/ConfigContext';
import DataProvider from './data/reducers/DataContext';
import DataTreatment from './data/DataTreatment';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <RequestProvider>
      <ConfigProvider>
        <DataProvider>
          <NotificationProvider>
            <DataTreatment />
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </NotificationProvider>
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
