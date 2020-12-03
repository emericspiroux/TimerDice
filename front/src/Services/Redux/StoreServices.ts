import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer, { defaultStates } from './define';

const browserHistory = createBrowserHistory();
const setup = () => {
  const enhancers: any[] = [];

  const middleware = [thunk, routerMiddleware(browserHistory)];

  if (process.env.REACT_APP_REDUX_LOG === 'true') {
    enhancers.push(applyMiddleware(logger));
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const composedEnhancers = composeEnhancers(
    applyMiddleware(...middleware),
    ...enhancers,
  );
  const store = createStore(rootReducer, defaultStates, composedEnhancers);
  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};

export { browserHistory, setup };
