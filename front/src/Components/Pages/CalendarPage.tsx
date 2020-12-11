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
      endRangeDate.setDate(endDate.getDate() + 7);
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

  function onDeleteEvent(event: IDiceFaceTime) {
    dispatch(deleteEvent(event.id));
    dispatch(hideModal());
  }

  function onSelected(data: IEventBigCalendar) {
    dispatch(
      showModal(
        <EventCalendarOneContent
          eventCalendar={data.resource}
          onChangeDescription={onChangeDescription}
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
      <div className="CalendarPage__donuts">
        {rangeEvents && <FaceSummaryDonuts events={rangeEvents} totalDuration={DurationTotalCount(rangeEvents)} />}
      </div>
      <DnDCalendar
        localizer={localizer}
        defaultView="work_week"
        views={['work_week']}
        timeslots={5}
        step={1}
        className="CalendarPage__calendar"
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
        style={{ height: 'calc(100% - 400px)' }}
        resizable
      />
    </div>
  );
}
