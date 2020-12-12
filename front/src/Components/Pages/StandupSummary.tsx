import './StandupSummary.scss';
import _ from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { deleteEventRange, getRange, IDiceFaceTimeRangeElement } from '../../Services/Redux/ducks/data.ducks';
import Loader from '../Atoms/Loader';
import FaceSummaryDescriptions from '../Molecules/FaceSummaryDescriptions/FaceSummaryDescriptions';
import DurationTotalCount from '../../Libs/DurationTotalCount/DurationTotalCount';
import { IDiceFaceTime } from '../../Services/Redux/ducks/dice.ducks';
import { patchEvent } from '../../Services/Redux/ducks/calendar.ducks';
import FaceSummaryDonuts from '../Molecules/FaceSummaryDonuts/FaceSummaryDonuts';

export default function StandupSummary() {
  const dispatch = useDispatch();
  const [last24hDate] = useState<Date>(() => {
    const last24hDateDefine = new Date();
    last24hDateDefine.setHours(last24hDateDefine.getHours() - 26);
    return last24hDateDefine;
  });
  const rangeEvents: IDiceFaceTimeRangeElement[] = useSelector((state: any) => _.get(state, 'data.current'), []);
  const isLoading: boolean = useSelector<boolean>((state: any): boolean => _.get(state, 'data.isLoading'));

  function onChangeDescription(e: ChangeEvent<HTMLTextAreaElement>, element: IDiceFaceTime) {
    dispatch(patchEvent(element.id, { description: e.target.value }));
  }

  function onDelete(element: IDiceFaceTime) {
    dispatch(deleteEventRange(element));
  }

  useEffect(() => {
    dispatch(
      getRange({
        start: last24hDate,
      }),
    );
  }, [dispatch, last24hDate]);

  const totalDuration = rangeEvents ? DurationTotalCount(rangeEvents) : 0;

  return (
    <div className="StandupSummary Page Page-padding">
      <div className="common-title">Résumé des dernières 24h {isLoading && <Loader size="10px" isInline />}</div>
      <div className="StandupSummary__topDate s-top">
        {moment(last24hDate).format('LLL')} - {moment().format('LLL')}
      </div>
      <div className="l-top">
        {Array.isArray(rangeEvents) && rangeEvents.length ? (
          <div>
            <FaceSummaryDonuts events={rangeEvents} totalDuration={totalDuration} />
            <FaceSummaryDescriptions
              className="xl-top"
              events={rangeEvents}
              onChangeDescription={onChangeDescription}
              onDelete={onDelete}
              totalDuration={totalDuration}
            />
          </div>
        ) : (
          <div>{isLoading ? 'Chargement en cours...' : 'Aucun événements ces dernières 24h'}</div>
        )}
      </div>
    </div>
  );
}
