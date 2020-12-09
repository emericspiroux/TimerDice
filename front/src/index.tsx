import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/fr';

import './index.scss';
import './Components/Styles/common.scss';
import './Components/Styles/margin.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';

import SocketServices from './Services/Sockets/SocketServices';
import * as StoreServices from './Services/Redux/StoreServices';

const { store, persistor } = StoreServices.setup();

moment.locale('fr');

SocketServices.shared.setStore(store);

ReactDOM.render(
  <React.StrictMode>
    <App {...{ store, persistor }} />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
