import './DiceSettingsPage.scss';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import SocketServices from '../../Services/Sockets/SocketServices';
import DiceAction from '../../Services/Sockets/Actions/Dice.actions';
import { IDiceFace, startCurrentSettingDiceFace } from '../../Services/Redux/ducks/dice.ducks';
import { getCurrentDiceFaceSettings, patchFace } from '../../Services/Redux/ducks/settings.ducks';
import UpdateFaceForm from '../Organisms/UpdateFaceForm/UpdateFaceForm';
import Loader from '../Atoms/Loader';
import DiceLogoPlaceholder from '../Atoms/DiceLogoPlaceholder';
import EventCalendarStartContent from '../Organisms/ModalContents/EventCalendarStart/Content/EventCalendarStartContent';
import { hideModal, showModal } from '../../Services/Redux/ducks/modal.ducks';

export default function DiceSettingsPage() {
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
    dispatch(
      patchFace(face.id, {
        color: face.color,
        name: face.name,
        slackStatus: face.slackStatus,
      }),
    );
  }

  function onSelectFaceRequested() {
    dispatch(
      showModal(
        <EventCalendarStartContent
          title="Selectionner la face à paramètrer"
          onStart={(face: IDiceFace) => {
            dispatch(startCurrentSettingDiceFace(face.faceId));
            dispatch(hideModal());
          }}
        />,
      ),
    );
  }

  return (
    <div className="DiceSettingsPage Page Page-padding">
      <div className="common-title">Paramètrage des faces {isLoading && <Loader size="16px" isInline />}</div>
      {currentFace ? (
        <UpdateFaceForm
          className="DiceSettings__form"
          face={currentFace}
          onChange={onUpdateFace}
          isLoading={isLoadingUpdate}
        />
      ) : (
        <div className="DiceSettingsPage__emptyWrapper">
          <div>
            <DiceLogoPlaceholder color="rgb(168,168,168)" />
          </div>
          <div className="DiceSettingsPage__emptyWrapper__text">
            Place le dé dans la position que tu souhaites paramètrer pour commencer <br />
            <button type="button" onClick={onSelectFaceRequested} className="button button-blue m-top">
              Selectionner une face manuellement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
