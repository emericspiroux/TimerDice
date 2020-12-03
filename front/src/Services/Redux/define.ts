import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['user'],
};

// const userConfig = {
// key: 'user',
// storage: storage,
// whitelist: ['token'],
// };

const rootReducer = combineReducers({
  // duck1,
  routing: routerReducer,
  // user: persistReducer(userConfig, User),
});

export default persistReducer(persistConfig, rootReducer);

export const defaultStates = {};
