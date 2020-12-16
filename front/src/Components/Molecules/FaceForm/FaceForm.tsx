import _ from 'lodash';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './FaceForm.scss';

import { getAllFaces, IDiceFace } from '../../../Services/Redux/ducks/dice.ducks';
import Loader from '../../Atoms/Loader';

export default function FaceForm({ current, onUpdate }: { current: IDiceFace; onUpdate: Function }) {
  const dispatch = useDispatch();
  const currentDiceFaces: IDiceFace[] = useSelector((state) => _.get(state, 'dice.faces'));
  const isLoadingFaces: boolean = useSelector((state) => _.get(state, 'dice.isLoadingFaces'));
  const [open, setOpen] = useState(false);
  const [currentFace, setCurrentFace] = useState(current);

  function onClickOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    dispatch(getAllFaces());
    setOpen(true);
  }

  function onClickUpdate(selected: IDiceFace) {
    setCurrentFace(selected);
    onUpdate(selected);
    setOpen(false);
  }

  return (
    <div className={`FaceForm ${open ? 'FaceForm--open' : ''}`}>
      {isLoadingFaces ? (
        <Loader size="22px" className="FaceForm__loader" />
      ) : (
        <div style={{ backgroundColor: currentFace?.color }} className="FaceForm__element" onClick={onClickOpen} />
      )}
      {Array.isArray(currentDiceFaces) &&
        currentDiceFaces
          .filter((e) => e.faceId !== currentFace.faceId)
          .map((e) => (
            <div
              style={{ backgroundColor: e.color }}
              className="FaceForm__element tooltip"
              onClick={() => onClickUpdate(e)}
              key={e.faceId}
            >
              <span className="tooltiptext">{e.name}</span>
            </div>
          ))}
    </div>
  );
}
