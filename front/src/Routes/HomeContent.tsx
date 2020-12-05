import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CurrentDicePage from '../Components/Pages/CurrentDicePage';

export default function HomeContent() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={CurrentDicePage} />
        <Route>
          <div>404</div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
