import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './Components/Styles/common.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import SocketServices from './Services/Sockets/SocketServices';
import * as StoreServices from './Services/Redux/StoreServices';

const { store, persistor } = StoreServices.setup();

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
