import { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SocketServices from '../Services/Sockets/SocketServices';
import DiceAction from '../Services/Sockets/Actions/Dice.actions';
import Home from '../Components/Pages/Home';

export default function RouteContent() {
  useEffect(() => {
    const diceAction = SocketServices.shared.getAction<DiceAction>(DiceAction);
    diceAction.startListenning();
    return diceAction.stopListenning;
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}
