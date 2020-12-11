import { Route, Switch } from 'react-router-dom';
import CalendarPage from '../Components/Pages/CalendarPage';
import CurrentDicePage from '../Components/Pages/CurrentDicePage';
import SettingsPage from '../Components/Pages/SettingsPage';
import StandupSummary from '../Components/Pages/StandupSummary';

export default function HomeContent() {
  return (
    <Switch>
      <Route exact path="/" component={CurrentDicePage} />
      <Route exact path="/standup" component={StandupSummary} />
      <Route exact path="/calendar" component={CalendarPage} />
      <Route exact path="/settings" component={SettingsPage} />
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
