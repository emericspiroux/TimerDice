import './CurrentDicePage.scss';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { IDiceFaceTime } from '../../Services/Redux/ducks/dice.ducks';
import DiceTimer from '../Organisms/DiceTimer/DiceTimer';

const localizer = momentLocalizer(moment);
const startDate = new Date();
const endDate = new Date(startDate);
endDate.setHours(endDate.getHours() + 1);

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
  const currentDice: IDiceFaceTime = useSelector<IDiceFaceTime>(
    (state: any): IDiceFaceTime => _.get(state, 'dice.current'),
  );

  function onEventResize(data) {
    const { start, end } = data;

    console.log({ data, start, end });
  }

  function onEventDrop(data) {
    console.log(data);
  }

  function onRangeChange(startdateArray) {
    console.log(
      '🚀 ~ file: CurrentDicePage.tsx ~ line 42 ~ onRangeChange ~ data',
      startdateArray,
    );
  }

  function eventStyleGetter(event: Event) {
    return {
      style: {
        backgroundColor: event.hexColor,
        borderColor: 'white',
      },
    };
  }

  return (
    <div className="CurrentDicePage">
      <div className="CurrentDicePage__diceTimerWrapper">
        <DiceTimer current={currentDice} />
      </div>
      <div className="CurrentDicePage__calendarWrapper">
        <DnDCalendar
          localizer={localizer}
          defaultView="day"
          views={['day']}
          scrollToTime={startDate}
          defaultDate={new Date()}
          events={[
            {
              title: 'Test',
              start: startDate,
              end: endDate,
              hexColor: '#333333',
              ressource: {
                test: true,
              },
            },
          ]}
          startAccessor="start"
          endAccessor="end"
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
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
