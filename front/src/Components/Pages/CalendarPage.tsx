/* eslint-disable */
import './CalendarPage.scss';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useEffect } from 'react';
import { IDiceFaceTime } from '../../Services/Redux/ducks/dice.ducks';

import {
  deleteEvent,
  getCalendar,
  IEventBigCalendar,
  IEventBigCalendarDrop,
  patchEvent,
  setCurrentDate,
} from '../../Services/Redux/ducks/calendar.ducks';
import { hideModal, showModal } from '../../Services/Redux/ducks/modal.ducks';
import EventCalendarOneContent from '../Organisms/ModalContents/EventCalendarOne/Content/EventCalendarOneContent';
import getMonday from '../../Libs/GetMonday/GetMonday';
import FaceSummaryDonuts from '../Molecules/FaceSummaryDonuts/FaceSummaryDonuts';
import DurationTotalCount from '../../Libs/DurationTotalCount/DurationTotalCount';
import { getRange, IDiceFaceTimeRangeElement } from '../../Services/Redux/ducks/data.ducks';
import Loader from '../Atoms/Loader';

const localizer = momentLocalizer(moment);
const startDate = new Date();
const endDate = new Date(startDate);
endDate.setHours(endDate.getHours() + 1);

const minDate = getMonday(new Date());
const maxDate = new Date(minDate);
maxDate.setDate(maxDate.getDate() + 7);

const DnDCalendar = withDragAndDrop(Calendar);

interface Event {
  title: string;
  start: Date;
  hexColor: string;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

export default function CalendarPage() {
  const dispatch = useDispatch();

  const rangeEvents: IDiceFaceTimeRangeElement[] = useSelector((state: any) => _.get(state, 'data.current'), []);
  const calendarEvents: IEventBigCalendar[] = useSelector<IEventBigCalendar[]>((state: any): IEventBigCalendar[] =>
    _.get(state, 'calendar.current'),
  );
  const isLoading: IEventBigCalendar[] = useSelector<IEventBigCalendar[]>((state: any): IEventBigCalendar[] =>
    _.get(state, 'calendar.isLoading'),
  );
  const currentDate = useSelector((state: any): { min: Date; max: Date } => ({
    min: _.get(state, 'calendar.startDate', minDate),
    max: _.get(state, 'calendar.endDate', maxDate),
  }));

  useEffect(() => {
    dispatch(getCalendar(minDate));
    dispatch(getRange({ start: minDate, end: maxDate }));
    dispatch(setCurrentDate(minDate, maxDate));
  }, [dispatch]);

  function onEventResizeOrDrop(data: IEventBigCalendarDrop) {
    dispatch(
      patchEvent(data.event.resource?.id, {
        start: data.start,
        end: data.end,
      }),
    );
  }

  function onRangeChange(startdateArray: Date[]) {
    if (startdateArray[0]) {
      const startRangeDate = new Date(startdateArray[0]);
      const endRangeDate = new Date(startdateArray[0]);
      endRangeDate.setDate(endRangeDate.getDate() + 7);
      dispatch(getCalendar(startRangeDate, endRangeDate));
      dispatch(getRange({ start: startRangeDate, end: endRangeDate }));
      dispatch(setCurrentDate(startRangeDate, endRangeDate));
    }
  }

  let timeId;
  function onChangeDescription(value: string, event: IDiceFaceTime) {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      dispatch(patchEvent(event.id, { description: value }));
    }, 1000);
  }

  function onChangeFace(faceId: number, event: IDiceFaceTime) {
    dispatch(patchEvent(event.id, { faceId }));
  }

  function onDeleteEvent(event: IDiceFaceTime) {
    dispatch(deleteEvent(event.id));
    dispatch(hideModal());
  }

  function onSelected(data: IEventBigCalendar) {
    dispatch(
      showModal(
        <EventCalendarOneContent
          key={`${data.resource.id}_${data.end}`}
          eventCalendar={data.resource}
          onChangeDescription={onChangeDescription}
          onChangeFace={onChangeFace}
          onDeleteEvent={onDeleteEvent}
        />,
      ),
    );
  }

  // eslint-disable-next-line no-shadow
  function eventStyleGetter(event: Event, _: any, _2: any, isSelected: boolean) {
    return {
      style: {
        backgroundColor: event.hexColor,
        borderColor: 'white',
        opacity: isSelected ? 0.8 : 1,
      },
    };
  }

  return (
    <div className="CalendarPage Page">
      <div className="common-title">Résumé par semaine {isLoading && <Loader size="10px" isInline />}</div>
      <div className="StandupSummary__topDate s-top">
        {moment(currentDate.min).format('LL')} - {moment(currentDate.max).format('LL')}
      </div>
      {isLoading ? (
        <div className="CalendarPage__info__loaderContainer">
          <Loader size="40px" />
          <div className="CalendarPage__info__loaderContainer__loaderWrapper__text l-top">
            Chargement des données en cours...
          </div>
        </div>
      ) : (
        <div className="CalendarPage__info__container">
          <div className="CalendarPage__donuts">
            {Array.isArray(rangeEvents) && rangeEvents.length ? (
              <FaceSummaryDonuts
                className="CalendarPage__donuts__element"
                events={rangeEvents}
                totalDuration={DurationTotalCount(rangeEvents)}
              />
            ) : (
              <div>Aucune activité enregistré cette semaine.</div>
            )}
          </div>
          <div className="CalendarPage__calendar">
            <DnDCalendar
              localizer={localizer}
              defaultView="work_week"
              views={['work_week']}
              timeslots={5}
              step={1}
              events={
                (Array.isArray(calendarEvents) &&
                  calendarEvents.map((e: IEventBigCalendar) => {
                    return {
                      ...e,
                      start: new Date(e.start),
                      end: new Date(e.end),
                    };
                  })) ||
                []
              }
              onEventDrop={onEventResizeOrDrop}
              onEventResize={onEventResizeOrDrop}
              onSelectEvent={onSelected}
              allDayAccessor={() => false}
              eventPropGetter={eventStyleGetter}
              slotPropGetter={() => ({
                style: {
                  backgroundColor: 'white',
                },
              })}
              onRangeChange={onRangeChange}
              resizable
            />
          </div>
        </div>
      )}
    </div>
  );
}
