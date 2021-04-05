import _ from 'lodash';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './FaceFormList.scss';

import { getAllFaces, IDiceFace } from '../../../Services/Redux/ducks/dice.ducks';
import Loader from '../../Atoms/Loader';

export default function FaceFormList({
  onSelect,
}: {
  // eslint-disable-next-line no-unused-vars
  onSelect: (diceFace: IDiceFace) => void;
}) {
  const dispatch = useDispatch();
  const currentDiceFaces: IDiceFace[] = useSelector((state) => _.get(state, 'dice.faces'));
  const isLoadingFaces: boolean = useSelector((state) => _.get(state, 'dice.isLoadingFaces'));

  useEffect(() => {
    dispatch(getAllFaces());
  }, [dispatch]);

  return (
    <div className={`FaceFormList ${isLoadingFaces && 'FaceFormList--loading'}`}>
      {isLoadingFaces && <Loader size="30px" />}
      {!isLoadingFaces &&
        Array.isArray(currentDiceFaces) &&
        currentDiceFaces.map((e) => (
          <div className="FaceFormList__element clickable" onClick={() => onSelect(e)} key={e.faceId}>
            <div className="FaceFormList__element__circle" style={{ backgroundColor: e.color }} />
            <div className="FaceFormList__element__name">{e.name}</div>
          </div>
        ))}
    </div>
  );
}
