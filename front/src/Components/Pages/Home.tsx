import NavBar from '../Molecules/NavBar/NavBar';
import './Home.scss';
import HomeContent from '../../Routes/HomeContent';

export default function Home() {
  return (
    <div className="Home">
      <div className="Home__NavBar">
        <NavBar />
      </div>
      <div className="Home__content">
        <HomeContent />
      </div>
    </div>
  );
}
