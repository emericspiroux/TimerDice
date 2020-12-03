import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

export default function App({ store, persistor }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              Home
            </Route>
            <Route>
              <div>404</div>
            </Route>
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

App.propTypes = {
  // history: PropTypes.objectOf(PropTypes.any).isRequired,
  store: PropTypes.objectOf(PropTypes.any).isRequired,
  persistor: PropTypes.objectOf(PropTypes.any).isRequired,
};
