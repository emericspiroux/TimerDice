import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ModalContainer from './Components/Organisms/ModalContainer/ModalContainer';
import RouteContent from './Routes';

export default function App({ store, persistor }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModalContainer />
        <RouteContent />
      </PersistGate>
    </Provider>
  );
}

App.propTypes = {
  // history: PropTypes.objectOf(PropTypes.any).isRequired,
  store: PropTypes.objectOf(PropTypes.any).isRequired,
  persistor: PropTypes.objectOf(PropTypes.any).isRequired,
};
