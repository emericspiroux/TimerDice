import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import { DiceReducer } from './ducks';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['dice'],
};

// const userConfig = {
// key: 'user',
// storage: storage,
// whitelist: ['token'],
// };

const rootReducer = combineReducers({
  dice: DiceReducer,
  routing: routerReducer,
  // user: persistReducer(userConfig, User),
});

export default persistReducer(persistConfig, rootReducer);

export const defaultStates = {};
