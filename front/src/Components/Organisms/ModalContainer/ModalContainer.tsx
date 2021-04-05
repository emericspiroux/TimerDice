import _ from 'lodash';
import { ReactNode, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideModal } from '../../../Services/Redux/ducks/modal.ducks';
import './ModalContainer.scss';

export default function ModalContainer() {
  const isDiplayed: Boolean = useSelector<Boolean>((state: any) => _.get(state, 'modal.isDiplayed'));
  const modalContent: ReactNode = useSelector<ReactNode>((state: any) => _.get(state, 'modal.content'));
  const dispatch = useDispatch();

  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        dispatch(hideModal());
      }
    },
    [dispatch],
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className={`ModalContainer ${isDiplayed && 'show'}`} onMouseDown={() => dispatch(hideModal())}>
      <div className="ModalContainer__container" onMouseDown={(e) => e.stopPropagation()}>
        {modalContent}
      </div>
    </div>
  );
}
