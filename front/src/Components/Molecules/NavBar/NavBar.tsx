import './NavBar.scss';
import { useHistory, NavLink } from 'react-router-dom';
import logo from '../../../Images/logo/logo.svg';

export default function NavBar() {
  const history = useHistory();
  // const currentDice: IDiceFaceTime = useSelector<IDiceFaceTime>(
  //   (state: any): IDiceFaceTime => _.get(state, 'dice.current'),
  // );

  function onLogoClick() {
    history.push('/');
  }

  return (
    <div className="NavBar">
      <div className="NavBar__logoWrapper clickable" onClick={onLogoClick}>
        <img src={logo} alt="" className="NavBar__logoWrapper__image" />
      </div>
      <NavLink
        to="/standup"
        className={`NavBar__logoWrapper NavBar__icon standup ${
          window.location.pathname === '/standup' ? 'selected' : ''
        }`}
      />
    </div>
  );
}
