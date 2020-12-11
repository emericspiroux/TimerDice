import './SettingsPage.scss';
// import _ from 'lodash';
// import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import SocketServices from '../../Services/Sockets/SocketServices';
import DiceAction from '../../Services/Sockets/Actions/Dice.actions';

export default function SettingsPage() {
  // const dispatch = useDispatch();
  // const currentFace: IDiceFace = useSelector<IDiceFace>((state: any): IDiceFace => _.get(state, 'face.current'));

  useEffect(() => {
    const diceAction = SocketServices.shared.getAction<DiceAction>(DiceAction);
    diceAction.changeSettingsState(true);
    return () => {
      diceAction.changeSettingsState(false);
    };
  }, []);

  return <div className="Settings Page">Settings</div>;
}
