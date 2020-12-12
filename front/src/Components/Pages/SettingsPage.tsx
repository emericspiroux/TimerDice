import './SettingsPage.scss';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import SocketServices from '../../Services/Sockets/SocketServices';
import DiceAction from '../../Services/Sockets/Actions/Dice.actions';
import { IDiceFace } from '../../Services/Redux/ducks/dice.ducks';
import { getCurrentDiceFaceSettings, patchFace } from '../../Services/Redux/ducks/settings.ducks';
import UpdateFaceForm from '../Organisms/UpdateFaceForm/UpdateFaceForm';
import Loader from '../Atoms/Loader';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const currentFace: IDiceFace = useSelector<IDiceFace>((state: any): IDiceFace => _.get(state, 'settings.current'));
  const isLoadingUpdate: boolean = useSelector<boolean>((state: any): boolean =>
    _.get(state, 'settings.isLoadingUpdate'),
  );
  const isLoading: boolean = useSelector<boolean>((state: any): boolean => _.get(state, 'settings.isLoading'));

  useEffect(() => {
    const diceAction = SocketServices.shared.getAction<DiceAction>(DiceAction);
    diceAction.changeSettingsState(true);
    dispatch(getCurrentDiceFaceSettings());
    return () => {
      diceAction.changeSettingsState(false);
    };
    /* eslint-disable-next-line */
  }, []);

  function onUpdateFace(face: IDiceFace) {
    dispatch(patchFace(face.id, { name: face.name, color: face.color }));
  }

  return (
    <div className="Settings Page Page-padding">
      <div className="common-title">Paramètrage des faces {isLoading && <Loader size="16px" isInline />}</div>
      {currentFace ? (
        <UpdateFaceForm
          className="Settings__form"
          face={currentFace}
          onChange={onUpdateFace}
          isLoading={isLoadingUpdate}
        />
      ) : (
        <div className="Settings__emptyWrapper">
          <div>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              height="295.49275912777307"
              width="333.00814571369443"
              className="Settings__image"
            >
              <g opacity="1">
                <g opacity="1">
                  <path
                    fillOpacity="0"
                    stroke="rgb(168,168,168)"
                    strokeOpacity="1"
                    strokeWidth="15"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    opacity="1"
                    fillRule="evenodd"
                    /* eslint-disable-next-line max-len */
                    d="M102.2154258319257 38.068246408792746C110.06033626361446 33.67189912378075 224.14159022610775 35.11098545490005 229.47172263638143 38.068246408792746C234.80185504665513 41.02550736268544 297.7883102238584 140.19865928551422 297.7233697114357 149.25733411123116C297.65842919901286 158.3160089369481 237.75840313334592 252.4630082365099 229.47172263638143 256.98528289686215C221.1850421394169 261.50755755721445 109.55770028364911 261.0509485625757 102.2154258319257 256.98528289686215C94.8731513802023 252.9196172311486 35.34918398164655 158.3666431242639 35.28477837767905 149.25733411123116C35.22037277371155 140.14802509819842 94.37051540023691 42.464593693804744 102.2154258319257 38.068246408792746Z"
                  />
                </g>
                <g opacity="1">
                  <path
                    fillOpacity="0"
                    stroke="rgb(168,168,168)"
                    strokeOpacity="1"
                    strokeWidth="15"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    opacity="1"
                    fillRule="evenodd"
                    /* eslint-disable-next-line max-len */
                    d="M293.3200869812818 150.91409706627437C293.2751362269747 159.33342805429663 111.15606375429986 259.072444570548 104.85743837660269 255.37978712738942C98.55881299890551 251.6871296842309 94.79256777300209 49.64384979622175 104.85743837660269 43.814818180089304C114.92230898020327 37.98578656395686 293.3650377355889 142.49476607825213 293.3200869812818 150.91409706627437Z"
                  />
                </g>
                <g>
                  <text opacity="1" transform="translate(135.64189430584318, 111.57990949648786)">
                    <tspan
                      fill="rgb(168,168,168)"
                      fontSize="54"
                      fontFamily="Avenir Next"
                      fontWeight="400"
                      style={{ whiteSpace: 'pre', textTransform: 'none' }}
                      x="0"
                      y="54"
                    >
                      &nbsp;?
                    </tspan>
                  </text>
                </g>
              </g>
            </svg>
          </div>
          <div className="Settings__emptyWrapper__text">
            Met le dé dans la position que tu souhaite paramètrer pour commencer
          </div>
        </div>
      )}
    </div>
  );
}
