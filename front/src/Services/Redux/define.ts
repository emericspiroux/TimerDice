import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import { CalendarReducer, DiceReducer, ModalReducer, DataReducer, SettingsReducer } from './ducks';

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
  calendar: CalendarReducer,
  routing: routerReducer,
  data: DataReducer,
  modal: ModalReducer,
  settings: SettingsReducer,
  // user: persistReducer(userConfig, User),
});

export default persistReducer(persistConfig, rootReducer);

export const defaultStates = {};
