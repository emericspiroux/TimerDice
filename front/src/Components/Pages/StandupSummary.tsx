import './StandupSummary.scss';
import _ from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getRange, IDiceFaceTimeRange, IDiceFaceTimeRangeElement } from '../../Services/Redux/ducks/data.ducks';
import { IDiceFaceTime } from '../../Services/Redux/ducks/dice.ducks';
import Loader from '../Atoms/Loader';
import timestampToTime from '../../Libs/TimestampToTime/TimestampToTime';

export default function StandupSummary() {
  const dispatch = useDispatch();
  const [last24hDate] = useState<Date>(() => {
    const last24hDateDefine = new Date();
    last24hDateDefine.setHours(last24hDateDefine.getHours() - 24);
    return last24hDateDefine;
  });
  const rangeEvents: IDiceFaceTimeRange = useSelector((state: any) => _.get(state, 'data.current'));
  const isLoading: boolean = useSelector<boolean>((state: any): boolean => _.get(state, 'data.isLoading'));

  useEffect(() => {
    dispatch(
      getRange({
        start: last24hDate,
      }),
    );
  }, [dispatch, last24hDate]);

  return (
    <div className="StandupSummary Page Page-padding">
      <h2>Résumé des dernières 24h</h2>
      <p>
        {moment(last24hDate).format('LLL')} - {moment().format('LLL')}
      </p>
      {rangeEvents ? (
        <div>
          {Object.entries(rangeEvents).map(([index, rangeEvent]: [string, IDiceFaceTimeRangeElement]) => (
            <div key={index}>
              <p style={{ color: rangeEvent.face.color }}>{rangeEvent.face.name}</p>
              <ul>
                {rangeEvent.elements
                  .sort((a: IDiceFaceTime, b: IDiceFaceTime) => b.duration - a.duration)
                  .map((rangeEventElement: IDiceFaceTime) => (
                    <li>
                      {timestampToTime(rangeEventElement.duration / 1000)} -{' '}
                      {rangeEventElement.description || 'Pas de description'}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div>Aucun événements ces dernières 24h</div>
      )}
      {isLoading && <Loader size="40px" />}
    </div>
  );
}
