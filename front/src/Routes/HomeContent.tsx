import { Route, Switch } from 'react-router-dom';
import CurrentDicePage from '../Components/Pages/CurrentDicePage';
import StandupSummary from '../Components/Pages/StandupSummary';

export default function HomeContent() {
  return (
    <Switch>
      <Route exact path="/" component={CurrentDicePage} />
      <Route exact path="/standup" component={StandupSummary} />
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
