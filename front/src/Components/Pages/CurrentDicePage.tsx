import './CurrentDicePage.scss';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useEffect } from 'react';
import {
  getCurrentDiceFaceTime,
  IDiceFaceTime,
  setDice,
  stopCurrentDiceFaceTime,
} from '../../Services/Redux/ducks/dice.ducks';
import DiceTimer from '../Organisms/DiceTimer/DiceTimer';
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

const localizer = momentLocalizer(moment);
const startDate = new Date();
const endDate = new Date(startDate);
endDate.setHours(endDate.getHours() + 1);

const minDate = new Date();
minDate.setHours(9);
minDate.setMinutes(0);
const maxDate = new Date(minDate);
maxDate.setHours(23);
maxDate.setMinutes(0);

const DnDCalendar = withDragAndDrop(Calendar);

interface Event {
  title: string;
  start: Date;
  hexColor: string;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

export default function CurrentDicePage() {
  const dispatch = useDispatch();
  const currentDice: IDiceFaceTime = useSelector<IDiceFaceTime>(
    (state: any): IDiceFaceTime => _.get(state, 'dice.current'),
  );

  const isLoadingCurrent: boolean = useSelector<boolean>((state: any): boolean => _.get(state, 'dice.isLoading'));

  const calendarEvents: IEventBigCalendar[] = useSelector<IEventBigCalendar[]>((state: any): IEventBigCalendar[] =>
    _.get(state, 'calendar.current'),
  );

  const currentDate: { start: Date; end: Date } = useSelector<{ start: Date; end: Date }>((state: any): {
    start: Date;
    end: Date;
  } => ({
    start: _.get(state, 'calendar.startDate'),
    end: _.get(state, 'calendar.endDate'),
  }));

  useEffect(() => {
    dispatch(getCurrentDiceFaceTime());
    const startDateOnOpen = new Date();
    startDateOnOpen.setMinutes(0);
    startDateOnOpen.setHours(0);
    startDateOnOpen.setMilliseconds(0);
    const endDateOnOpen = new Date(startDateOnOpen);
    endDateOnOpen.setDate(endDateOnOpen.getDate() + 1);
    dispatch(getCalendar(startDateOnOpen));
    dispatch(setCurrentDate(startDateOnOpen, endDateOnOpen));
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
      endRangeDate.setDate(endRangeDate.getDate() + 1);
      dispatch(getCalendar(startRangeDate, endRangeDate));
      dispatch(setCurrentDate(startRangeDate, endRangeDate));
    }
  }

  let timeId;
  function onChangeDescription(value: string, event: IDiceFaceTime) {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      dispatch(patchEvent(event.id, { description: value }));
      if (event.id === currentDice.id) dispatch(getCurrentDiceFaceTime());
    }, 1000);
  }

  function onChangeFace(faceId: number, event: IDiceFaceTime) {
    dispatch(patchEvent(event.id, { faceId }));
    if (!event.end) {
      dispatch(setDice({ ...event }));
    }
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

  function onStopEvent() {
    dispatch(stopCurrentDiceFaceTime());
    dispatch(getCalendar(currentDate.start, currentDate.end));
    dispatch(hideModal());
  }

  function onUpdate(data: IDiceFaceTime) {
    dispatch(
      showModal(
        <EventCalendarOneContent
          key={`${data.id}_${data.end}`}
          eventCalendar={data}
          onChangeDescription={onChangeDescription}
          onChangeFace={onChangeFace}
          onStopEvent={onStopEvent}
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
    <div className="CurrentDicePage Page">
      <div className="CurrentDicePage__diceTimerWrapper">
        <DiceTimer current={currentDice} isLoading={isLoadingCurrent} onUpdate={onUpdate} />
      </div>
      <div className="CurrentDicePage__calendarWrapper">
        <DnDCalendar
          localizer={localizer}
          defaultView="day"
          views={['day']}
          timeslots={4}
          step={1}
          min={minDate}
          max={maxDate}
          events={
            (Array.isArray(calendarEvents) &&
              calendarEvents.map((e: IEventBigCalendar) => ({
                ...e,
                start: new Date(e.start),
                end: new Date(e.end),
              }))) ||
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
          style={{ width: '100%' }}
          resizable
        />
      </div>
    </div>
  );
}
